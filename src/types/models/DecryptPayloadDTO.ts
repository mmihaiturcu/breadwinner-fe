import { OperandTypes, SchemeType } from '../enums';

export interface DecryptPayloadDTO {
    endResultType: OperandTypes;
    schemeType: SchemeType;
    chunks: {
        id: number;
        length: number;
    }[];
}
