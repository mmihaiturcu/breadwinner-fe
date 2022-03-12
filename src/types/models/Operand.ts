import { OperandTypes } from '../enums';

export interface Operand {
    type: OperandTypes;
    field: string;
    plaintextValue?: number | string;
}
