<template>
    <q-page ref="pageRef" class="row items-center justify-evenly">
        <Logo />
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SEAL from 'node-seal';
import Papa from 'papaparse';

import { chunkArray } from 'src/utils/helper';
import { CHUNK_SIZE } from 'src/utils/constants';
import { SEALLibrary } from 'node-seal/implementation/seal';
import { Context } from 'node-seal/implementation/context';
import { PublicKey } from 'node-seal/implementation/public-key';
import { SecretKey } from 'node-seal/implementation/secret-key';
import { CipherText } from 'node-seal/implementation/cipher-text';
import { createAPIKey } from 'src/service/service';
import Logo from 'src/components/Logo.vue';
import gsap, { Linear, Back, Power1 } from 'gsap';

export default defineComponent({
    name: 'PageIndex',
    components: {
        Logo,
    },
    setup() {
        const winHeight = window.innerHeight,
            winWidth = window.innerWidth;

        return {
            density: 50,
            speed: 2,

            start: {
                yMin: winHeight - winHeight,
                yMax: winHeight,
                xMin: winWidth / 2 + 10,
                xMax: winWidth / 2 + 40,
                scaleMin: 0.1,
                scaleMax: 0.25,
                scaleXMin: 0.1,
                scaleXMax: 1,
                scaleYMin: 1,
                scaleYMax: 2,
                opacityMin: 0.1,
                opacityMax: 0.4,
            },
            mid: {
                yMin: winHeight * 0.4 - winHeight,
                yMax: winHeight * 0.9 - winHeight,
                xMin: winWidth * 0.1,
                xMax: winWidth * 0.9,
                scaleMin: 0.2,
                scaleMax: 0.8,
                opacityMin: 0.5,
                opacityMax: 1,
            },
            end: {
                yMin: -180 - winHeight,
                yMax: -180 - winHeight,
                xMin: -100,
                xMax: winWidth + 180,
                scaleMin: 0.1,
                scaleMax: 1,
                opacityMin: 0.4,
                opacityMax: 0.7,
            },
        };
    },
    methods: {
        async initFHEContext(): Promise<{ seal: SEALLibrary; context: Context }> {
            const seal = await SEAL();
            seal.SchemeType.bfv;
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

            return {
                seal,
                context,
            };
        },
        generateKeys(
            seal: SEALLibrary,
            context: Context
        ): { publicKey: PublicKey; secretKey: SecretKey } {
            ////////////////////////
            // Keys
            ////////////////////////

            // Create a new KeyGenerator (creates a new keypair internally)
            const keyGenerator = seal.KeyGenerator(context);

            const secretKey = keyGenerator.secretKey();
            const publicKey = keyGenerator.createPublicKey();
            // const relinKey = keyGenerator.createRelinKeys();
            // // Generating Galois keys takes a while compared to the others
            // const galoisKey = keyGenerator.createGaloisKeys();

            // Saving a key to a string is the same for each type of key
            const secretBase64Key = secretKey.save();
            // const publicBase64Key = publicKey.save();
            // const relinBase64Key = relinKey.save();
            // // Please note saving Galois keys can take an even longer time and the output is **very** large.
            // const galoisBase64Key = galoisKey.save();

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
            return {
                publicKey,
                secretKey,
            };
        },
        encryptData(
            seal: SEALLibrary,
            context: Context,
            publicKey: PublicKey,
            data: number[]
        ): CipherText {
            ////////////////////////
            // Instances
            ////////////////////////

            // Create an Evaluator which will allow HE functions to execute
            // const evaluator = seal.Evaluator(context);

            // Create a BatchEncoder (only BFV SchemeType)
            const encoder = seal.BatchEncoder(context);

            // Or a CKKSEncoder (only CKKS SchemeType)
            // const encoder = seal.CKKSEncoder(context)

            // Create an Encryptor to encrypt PlainTexts
            const encryptor = seal.Encryptor(context, publicKey);

            // Create a Decryptor to decrypt CipherTexts

            // Encode data to a PlainText
            const plainTextA = encoder.encode(
                Int32Array.from(data) // This could also be a Uint32Array
            );

            // An encryptor and decryptor also accept a cihperText and plainText
            // optional parameter. If not provided, an encryptor will
            // return a new cipherText and a decryptor will return a new plainText.
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

                if (cipherTextA) {
                    return cipherTextA;
                } else {
                    throw new Error('Ciphertext could not be created.');
                }
                // // Add CipherText B to CipherText A and store the sum in a destination CipherText
                // const cipherTextD = seal.CipherText();

                // if (cipherTextA && cipherTextD) {
                //     evaluator.add(cipherTextA, cipherTextA, cipherTextD);
                // }
            } else {
                throw new Error('Plaintext could not be created.');
            }
        },
        decryptData(
            seal: SEALLibrary,
            context: Context,
            secretKey: SecretKey,
            encryptedData: CipherText
        ): Int32Array | Uint32Array {
            const decryptor = seal.Decryptor(context, secretKey);

            // Create a BatchEncoder (only BFV SchemeType)
            const encoder = seal.BatchEncoder(context);

            // Decrypt a CipherText
            const plainTextD = decryptor.decrypt(encryptedData);

            if (plainTextD) {
                // `signed` defaults to 'true' if not specified and will return an Int32Array.
                // If you have encrypted a Uint32Array and wish to decrypt it, set
                // this to false.
                return encoder.decode(
                    plainTextD,
                    true // Can be omitted since this defaults to true.
                );
            } else {
                throw new Error('Could not decrypt ciphertext.');
            }
        },
        uploadedFile(files: FileList) {
            Papa.parse(files[0], {
                worker: true,
                header: false,
                complete: async (result) => {
                    const chunks: number[][][] = chunkArray(
                        result.data,
                        CHUNK_SIZE
                    ) as number[][][];
                    console.log('Chunks', chunks);
                    const firstChunk = chunks[0];
                    // TODO: find elegant way to handle this.
                    const valueColumn = firstChunk.map((val) => val[5]);
                    valueColumn.shift();
                    const { seal, context } = await this.initFHEContext();
                    const { publicKey, secretKey } = this.generateKeys(seal, context);
                    const serializedSecretKey = secretKey.save();
                    console.log(serializedSecretKey);
                    const encryptedValues = this.encryptData(seal, context, publicKey, valueColumn);
                    const decryptedValues = this.decryptData(
                        seal,
                        context,
                        secretKey,
                        encryptedValues
                    );
                    console.log(decryptedValues);
                },
            });
        },
        async testWebsocket() {
            console.log('test');
            const apiKeyResponse = await createAPIKey();
            console.log(apiKeyResponse);
            const ws = new WebSocket(process.env.BACKEND_WSS_URL, apiKeyResponse.data);

            ws.onopen = function open() {
                console.log('connected');
            };

            ws.onclose = function close() {
                console.log('closed');
            };
        },
        range(min: number, max: number) {
            return min + (max - min) * Math.random();
        },
        sign() {
            return Math.random() < 0.5 ? -1 : 1;
        },
        randomEase(easeThis: gsap.EaseFunction, easeThat: gsap.BackConfig) {
            if (Math.random() < 0.5) {
                return easeThat;
            }
            return easeThis;
        },
        spawn(particle: gsap.TweenTarget) {
            var wholeDuration = (10 / this.speed) * (0.7 + Math.random() * 0.4),
                delay = wholeDuration * Math.random(),
                partialDuration = (wholeDuration + 1) * (0.2 + Math.random() * 0.3);
            gsap.set(particle, {
                y: this.range(this.start.yMin, this.start.yMax),
                x: this.range(this.start.xMin, this.start.xMax),
                scaleX: this.range(this.start.scaleXMin, this.start.scaleXMax),
                scaleY: this.range(this.start.scaleYMin, this.start.scaleYMax),
                scale: this.range(this.start.scaleMin, this.start.scaleMax),
                opacity: this.range(this.start.opacityMin, this.start.opacityMax),
                visibility: 'hidden',
            });
            // Moving upward
            gsap.to(particle, {
                duration: partialDuration,
                delay: delay,
                y: this.range(this.mid.yMin, this.mid.yMax),
                ease: this.randomEase(Linear.easeOut, Back.easeInOut),
            });
            gsap.to(particle, {
                duration: wholeDuration - partialDuration,
                delay: partialDuration + delay,
                y: this.range(this.end.yMin, this.end.yMax),
                ease: Back.easeIn,
            });
            //Moving on axis X
            gsap.to(particle, {
                duration: partialDuration,
                delay: delay,
                x: this.range(this.mid.xMin, this.mid.xMax),
                ease: Power1.easeOut,
            });
            gsap.to(particle, {
                duration: wholeDuration - partialDuration,
                delay: partialDuration + delay,
                x: this.range(this.end.xMin, this.end.xMax),
                ease: Power1.easeIn,
            });
            //opacity and scale
            partialDuration = wholeDuration * (0.5 + Math.random() * 0.3);
            gsap.to(particle, {
                duration: partialDuration,
                delay: delay,
                scale: this.range(this.mid.scaleMin, this.mid.scaleMax),
                autoAlpha: this.range(this.mid.opacityMin, this.mid.opacityMax),
                ease: Linear.easeNone,
            });
            gsap.to(particle, {
                duration: wholeDuration - partialDuration,
                delay: partialDuration + delay,
                scale: this.range(this.end.scaleMin, this.end.scaleMax),
                autoAlpha: this.range(this.end.opacityMin, this.end.opacityMax),
                ease: Linear.easeNone,
                onComplete: this.spawn,
                onCompleteParams: [particle],
            });
        },
        createParticle() {
            for (let i = 0; i < this.density; ++i) {
                const particleSpark = document.createElement('div');
                particleSpark.classList.add('spark');
                document.body.appendChild(particleSpark);
                this.spawn(particleSpark);
            }
        },
    },
    mounted() {
        this.createParticle();
    },
});
</script>

<style scoped lang="scss">
.particles-canvas {
    position: absolute;
}
</style>
