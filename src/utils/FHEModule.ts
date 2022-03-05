import SEAL from 'node-seal';

import { SEALLibrary } from 'node-seal/implementation/seal';
import { Context } from 'node-seal/implementation/context';
import { PublicKey } from 'node-seal/implementation/public-key';
import { SecretKey } from 'node-seal/implementation/secret-key';
import { CipherText } from 'node-seal/implementation/cipher-text';
import { KeyPair } from 'src/types/models';

export class FHEModule {
    public static instance: FHEModule;
    public seal: null | SEALLibrary;
    public context: null | Context;
    public publicKey: null | PublicKey;
    public privateKey: null | SecretKey;

    private constructor() {
        this.seal = null;
        this.context = null;
        this.publicKey = null;
        this.privateKey = null;
    }

    async initFHEContext(): Promise<void> {
        const seal = await SEAL();
        seal.SchemeType.bfv;
        const schemeType = seal.SchemeType.bfv;
        const securityLevel = seal.SecurityLevel.tc128;
        const polyModulusDegree = 4096;
        const bitSizes = [36, 36, 37];
        const bitSize = 40; // Controls the max number that we can work with / encrypt.

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

        this.seal = seal;
        this.context = context;
    }
    generateKeys(): {
        publicKey: string;
        privateKey: string;
    } {
        if (this.seal && this.context) {
            ////////////////////////
            // Keys
            ////////////////////////

            // Create a new KeyGenerator (creates a new keypair internally)
            const keyGenerator = this.seal.KeyGenerator(this.context);

            this.privateKey = keyGenerator.secretKey();
            this.publicKey = keyGenerator.createPublicKey();
            // const relinKey = keyGenerator.createRelinKeys();
            // // Generating Galois keys takes a while compared to the others
            // const galoisKey = keyGenerator.createGaloisKeys();

            // Saving a key to a string is the same for each type of key
            // const secretBase64Key = secretKey.save();
            // const publicBase64Key = publicKey.save();
            // const relinBase64Key = relinKey.save();
            // // Please note saving Galois keys can take an even longer time and the output is **very** large.
            // const galoisBase64Key = galoisKey.save();

            // Loading a key from a base64 string is the same for each type of key
            // Load from the base64 encoded string
            // const UploadedSecretKey = seal.SecretKey();
            // UploadedSecretKey.load(context, secretBase64Key);

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
                publicKey: this.publicKey.save(),
                privateKey: this.privateKey.save(),
            };
        } else {
            throw new Error('FHE Module has not been initialized.');
        }
    }
    setPublicKey(publicKey: string) {
        if (this.seal && this.context) {
            this.publicKey = this.seal.PublicKey();
            this.publicKey.load(this.context, publicKey);
        } else {
            throw new Error('FHE Module has not been initialized.');
        }
    }
    encryptData(data: number[]): CipherText {
        if (this.seal && this.context && this.publicKey) {
            ////////////////////////
            // Instances
            ////////////////////////

            // Create an Evaluator which will allow HE functions to execute
            const evaluator = this.seal.Evaluator(this.context);

            // Create a BatchEncoder (only BFV SchemeType)
            const encoder = this.seal.BatchEncoder(this.context);

            // Or a CKKSEncoder (only CKKS SchemeType)
            // const encoder = seal.CKKSEncoder(context)

            // Create an Encryptor to encrypt PlainTexts
            const encryptor = this.seal.Encryptor(this.context, this.publicKey);

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
                    const cipherTextD = this.seal.CipherText();

                    if (cipherTextA && cipherTextD) {
                        evaluator.add(cipherTextA, cipherTextA, cipherTextD);
                    }
                    return cipherTextA;
                } else {
                    throw new Error('Ciphertext could not be created.');
                }
            } else {
                throw new Error('Plaintext could not be created.');
            }
        } else {
            throw new Error('FHE Module has not been initialized.');
        }
    }
    decryptData(encryptedData: CipherText): Int32Array | Uint32Array {
        if (this.seal && this.context && this.privateKey) {
            const decryptor = this.seal.Decryptor(this.context, this.privateKey);

            // Create a BatchEncoder (only BFV SchemeType)
            const encoder = this.seal.BatchEncoder(this.context);

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
        } else {
            throw new Error('FHE Module has not been initialized');
        }
    }

    setKeyPair(keyPair: KeyPair) {
        if (this.seal && this.context) {
            this.publicKey = this.seal.PublicKey();
            this.publicKey.load(this.context, keyPair.publicKey);
            this.privateKey = this.seal.SecretKey();
            this.privateKey.load(this.context, keyPair.privateKey);
        } else {
            throw new Error('FHE Module has not been initialized.');
        }
    }

    public static getInstance(): FHEModule {
        if (!this.instance) {
            this.instance = new FHEModule();
        }

        return this.instance;
    }
}

export default FHEModule.getInstance();
