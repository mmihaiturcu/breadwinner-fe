import { OperandTypes } from '../enums';

export type ResultType = {
    [o in OperandTypes]: ResultType | OperandTypes | null;
};
