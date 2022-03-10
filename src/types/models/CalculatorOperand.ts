import { CipherText } from 'node-seal/implementation/cipher-text';
import { OperandTypes } from '../enums';

export interface CalculatorOperand {
    type: OperandTypes;
    data: CipherText;
}
