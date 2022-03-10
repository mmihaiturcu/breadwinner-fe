import { CipherText } from 'node-seal/implementation/cipher-text';
import { Evaluator } from 'node-seal/implementation/evaluator';
import { GaloisKeys } from 'node-seal/implementation/galois-keys';
import { OperandTypes, Operations } from 'src/types/enums';
import { CalculatorOperand } from 'src/types/models';
import FHEModule from './FHEModule';

export default {
    [Operations.ADD]: (
        evaluator: Evaluator,
        galoisKeys: GaloisKeys,
        ...operands: CalculatorOperand[]
    ): CipherText => {
        if (operands.length === 1 && operands[0].type === OperandTypes.ARRAY) {
            // Sum vector elements
            const result = evaluator.sumElements(
                operands[0].data,
                galoisKeys,
                FHEModule.seal!.SchemeType.bfv
            )!;

            return result;
        } else if (
            operands.length === 2 &&
            operands.every((operand) => operand.type === OperandTypes.ARRAY)
        ) {
            const result = evaluator.add(operands[0].data, operands[1].data)!;

            return result;
        } else {
            throw new Error('Unsupported operand types.');
        }
    },
};
