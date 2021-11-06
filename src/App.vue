<template>
    <div>
        <InputFile :field="fileField" @update:modelValue="uploadedFile" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SEAL from 'node-seal';
import Papa from 'papaparse';

import InputFile from '@/components/inputs/InputFile.vue';
import { InputFieldFile, InputType } from '@/types';
import { chunkArray } from '@/utils/helper';
import { CHUNK_SIZE } from '@/utils/constants';

export default defineComponent({
    name: 'App',
    components: {
        InputFile,
    },
    data: function() {
        return {
            fileField: {
                type: InputType.file,
                acceptedMIMETypes: {
                    'text/csv': true,
                },
                value: null,
                previewURL: require('@/assets/icons/file-delimited.svg'),
            } as InputFieldFile,
        };
    },
    methods: {
        uploadedFile: function(files: FileList) {
            Papa.parse(files[0], {
                worker: true,
                complete: result => {
                    console.log(result);
                    const chunks = chunkArray(result.data, CHUNK_SIZE);
                    console.log(chunks);
                },
            });
        },
        performEncryptionTest: async function() {
            const seal = await SEAL();
            const schemeType = seal.SchemeType.bfv;
            const securityLevel = seal.SecurityLevel.tc128;
            const polyModulusDegree = 4096;
            const bitSizes = [36, 36, 37];
            const bitSize = 20;

            const encParms = seal.EncryptionParameters(schemeType);

            // Set the PolyModulusDegree
            encParms.setPolyModulusDegree(polyModulusDegree);

            // Create a suitable set of CoeffModulus primes
            encParms.setCoeffModulus(
                seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
            );

            // Set the PlainModulus to a prime of bitSize 20.
            encParms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize));

            ////////////////////////
            // Context
            ////////////////////////

            // Create a new Context
            const context = seal.Context(
                encParms, // Encryption Parameters
                true, // ExpandModChain
                securityLevel // Enforce a security level
            );

            if (!context.parametersSet()) {
                throw new Error(
                    'Could not set the parameters in the given context. Please try different encryption parameters.'
                );
            }

            ////////////////////////
            // Keys
            ////////////////////////

            // Create a new KeyGenerator (creates a new keypair internally)
            const keyGenerator = seal.KeyGenerator(context);

            const secretKey = keyGenerator.secretKey();
            const publicKey = keyGenerator.createPublicKey();
            const relinKey = keyGenerator.createRelinKeys();
            // Generating Galois keys takes a while compared to the others
            const galoisKey = keyGenerator.createGaloisKeys();

            // Saving a key to a string is the same for each type of key
            const secretBase64Key = secretKey.save();
            const publicBase64Key = publicKey.save();
            const relinBase64Key = relinKey.save();
            // Please note saving Galois keys can take an even longer time and the output is **very** large.
            const galoisBase64Key = galoisKey.save();

            // Loading a key from a base64 string is the same for each type of key
            // Load from the base64 encoded string
            const UploadedSecretKey = seal.SecretKey();
            UploadedSecretKey.load(context, secretBase64Key);

            // NOTE
            //
            // A KeyGenerator can also be instantiated with existing keys. This allows you to generate
            // new Relin/Galois keys with a previously generated SecretKey.

            // // Uploading a SecretKey: first, create an Empty SecretKey to load
            // const UploadedSecretKey = seal.SecretKey()

            // // Load from the base64 encoded string
            // UploadedSecretKey.load(context, secretBase64Key)

            // // Create a new KeyGenerator (use uploaded secretKey)
            // const keyGenerator = seal.KeyGenerator(context, UploadedSecretKey)

            // // Similarly, you may also create a KeyGenerator with a PublicKey. However, the benefit is purley to
            // // save time by not generating a new PublicKey

            // // Uploading a PublicKey: first, create an Empty PublicKey to load
            // const UploadedPublicKey = seal.PublicKey()

            // // Load from the base64 encoded string
            // UploadedPublicKey.load(context, publicBase64Key)

            // // Create a new KeyGenerator (use both uploaded keys)
            // const keyGenerator = seal.KeyGenerator(context, UploadedSecretKey, UploadedPublicKey)

            ////////////////////////
            // Instances
            ////////////////////////

            // Create an Evaluator which will allow HE functions to execute
            const evaluator = seal.Evaluator(context);

            // Create a BatchEncoder (only BFV SchemeType)
            const encoder = seal.BatchEncoder(context);

            // Or a CKKSEncoder (only CKKS SchemeType)
            // const encoder = seal.CKKSEncoder(context)

            // Create an Encryptor to encrypt PlainTexts
            const encryptor = seal.Encryptor(context, publicKey);

            // Create a Decryptor to decrypt CipherTexts
            const decryptor = seal.Decryptor(context, secretKey);

            // Encode data to a PlainText
            const plainTextA = encoder.encode(
                Int32Array.from([1, 2, 3]) // This could also be a Uint32Array
            );

            // An encryptor and decryptor also accept a cihperText and plainText
            // optional parameter. If not provided, an encryptor will
            // return a new cipherText and a decyprtor will return a new plainText.
            // If the optional parameter is specified, it will be modified and both
            // methods will return void.
            // Ex:
            //
            // // Create a plainText
            // const cipherTextA = seal.CipherText()
            //
            // //... some time later ...
            //
            // encryptor.encrypt(
            //   plainTextA,
            //   cipherTextA
            // )
            //
            // ... cipherTextA contains the encrypted plainText parameter
            //
            if (plainTextA) {
                // Encrypt a PlainText
                const cipherTextA = encryptor.encrypt(plainTextA);

                // Add CipherText B to CipherText A and store the sum in a destination CipherText
                const cipherTextD = seal.CipherText();

                if (cipherTextA && cipherTextD) {
                    evaluator.add(cipherTextA, cipherTextA, cipherTextD);

                    // Decrypt a CipherText
                    const plainTextD = decryptor.decrypt(cipherTextD);

                    if (plainTextD) {
                        // `signed` defaults to 'true' if not specified and will return an Int32Array.
                        // If you have encrypted a Uint32Array and wish to decrypt it, set
                        // this to false.
                        const decoded = encoder.decode(
                            plainTextD,
                            true // Can be omitted since this defaults to true.
                        );

                        console.log('decoded', decoded);
                    }
                }
            }
        },
    },
    mounted: function() {
        // this.performEncryptionTest();
    },
});
</script>

<style scoped lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
