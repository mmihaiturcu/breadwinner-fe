import { OperandTypes } from '../enums';

export interface CalculatorOperand {
    type: OperandTypes;
    data: string;
}
