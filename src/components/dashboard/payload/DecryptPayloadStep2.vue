<template>
    <q-form class="column items-center" @submit="decryptPayload">
        <q-btn type="submit" color="primary" icon="mdi-lock-open-check" label="Decrypt payload" />
    </q-form>
</template>

<script lang="ts">
import { FHEModule } from 'breadwinner';
import saveAs from 'file-saver';
import { storeToRefs } from 'pinia';
import { getPayloadDecryptInfo, getProcessedChunkOutput } from 'src/service/service';
import { usePayloadStore, useUserStore } from 'src/stores';
import { OperandTypes } from 'src/types/enums';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep1',
    setup() {
        const payloadStore = usePayloadStore();
        const userStore = useUserStore();
        const { uploadedKeyPairFile, keyPair, payloadToDecryptId } = storeToRefs(payloadStore);
        const { userDetails } = storeToRefs(userStore);

        return {
            uploadedKeyPairFile,
            keyPair,
            payloadToDecryptId,
            payloadStore,
            userDetails,
        };
    },
    methods: {
        downloadDecryptedData(data: Array<unknown> | number) {
            const file = new File(
                [JSON.stringify({ result: data })],
                `payload_${this.payloadToDecryptId}_result.json`,
                {
                    type: 'application/json',
                }
            );
            saveAs(file);
        },
        async decryptPayload() {
            if (this.uploadedKeyPairFile) {
                // Fetch some info about payload in order to complete the processing
                const response = await getPayloadDecryptInfo(
                    this.userDetails.roleSpecificId,
                    this.payloadToDecryptId
                );
                const payloadDecryptInfo = response.data;
                // In the case of an array type end result, we should only concatenate the resulting arrays from each chunk that was processed.
                // In the case of a number type result, we must sum all the numbers and divide by the number of chunks.

                this.keyPair = JSON.parse(await this.uploadedKeyPairFile.text());
                await FHEModule.initFHEContext();
                FHEModule.setKeyPair(this.keyPair);

                let plainTextResult = null as null | number | Array<number>;

                console.log('End result type is', payloadDecryptInfo.endResultType);

                switch (payloadDecryptInfo.endResultType) {
                    case OperandTypes.ARRAY: {
                        console.log('End result type is an array');
                        plainTextResult = [];

                        for (const chunk of payloadDecryptInfo.chunks) {
                            const response = await getProcessedChunkOutput(chunk.id);
                            const cipherTextArray = FHEModule.seal!.CipherText();
                            cipherTextArray.load(FHEModule.context!, response.data);
                            console.log(FHEModule.decryptData(cipherTextArray));
                            const decryptedArray = FHEModule.decryptData(cipherTextArray).slice(
                                0,
                                chunk.length
                            );

                            cipherTextArray.delete();

                            console.log('Partial array', decryptedArray);
                            plainTextResult.push(...decryptedArray);
                        }
                        break;
                    }
                    case OperandTypes.NUMBER: {
                        console.log('End result type is a number');
                        plainTextResult = 0;

                        for (const chunk of payloadDecryptInfo.chunks) {
                            const response = await getProcessedChunkOutput(chunk.id);
                            const cipherTextArray = FHEModule.seal!.CipherText();
                            cipherTextArray.load(FHEModule.context!, response.data);
                            const decryptedArray = FHEModule.decryptData(cipherTextArray);
                            const decryptedNumber = decryptedArray[0];

                            cipherTextArray.delete();

                            plainTextResult += decryptedNumber;
                        }
                        break;
                    }
                }

                console.log('final result', plainTextResult);
                FHEModule.deallocate();

                if (plainTextResult) {
                    this.$q.notify({
                        type: 'positive',
                        message:
                            'Your processing result has been successfully decrypted. Thank you for using Breadwinner!',
                    });
                    this.downloadDecryptedData(plainTextResult);
                } else {
                    this.$q.notify({
                        type: 'negative',
                        message: 'An error has occurred during the decryption process.',
                    });
                }

                this.payloadStore.$patch({
                    showDecryptPayloadModal: false,
                    currentPayloadDecryptionStep: 1,
                    uploadedKeyPairFile: null,
                });
            }
        },
    },
});
</script>
