import { OperandTypes } from '../enums';

export interface OperandOption {
    label: string;
    value: string | number; // either 'data' or step results such as 0, 1, 2
    icon: string;
    type: OperandTypes;
    columnIndex?: number;
    isPlaintext?: boolean;
    isRaw?: boolean;
    plaintextValue?: number | string;
}
