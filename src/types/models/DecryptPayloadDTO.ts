import { OperandTypes } from '../enums';

export interface DecryptPayloadDTO {
    endResultType: OperandTypes;
    chunks: {
        id: number;
        length: number;
    }[];
}
