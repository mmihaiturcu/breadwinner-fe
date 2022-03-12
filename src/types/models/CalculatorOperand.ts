import { CipherText } from 'node-seal/implementation/cipher-text';
import { PlainText } from 'node-seal/implementation/plain-text';
import { OperandTypes } from '../enums';

export interface CalculatorOperand {
    type: OperandTypes;
    data: CipherText | PlainText;
}
