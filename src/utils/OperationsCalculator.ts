import { Evaluator } from 'node-seal/implementation/evaluator';
import { OperandTypes, Operations } from 'src/types/enums';
import { CalculatorOperand } from 'src/types/models';
import FHEModule from './FHEModule';

export default {
    [Operations.ADD]: (evaluator: Evaluator, ...operands: CalculatorOperand[]): string => {
        const keyGenerator = FHEModule.seal?.KeyGenerator(FHEModule.context!);
        const galoisKeys = keyGenerator?.createGaloisKeys();
        console.log('Operands', operands, operands.length === 2);
        if (operands.length === 1 && ArrayBuffer.isView(operands[0])) {
            // Sum vector elements
            const reconstructedArray = FHEModule.seal!.CipherText();
            reconstructedArray.load(FHEModule.context!, operands[0].data);
            if (galoisKeys) {
                const result = evaluator.sumElements(
                    reconstructedArray,
                    galoisKeys,
                    FHEModule.seal?.SchemeType.bfv
                )!;

                return result.save();
            } else {
                throw new Error('Galois keys not available.');
            }
        } else if (
            operands.length === 2 &&
            operands.every((operand) => operand.type === OperandTypes.ARRAY)
        ) {
            // Sum vector elements
            const reconstructedArray1 = FHEModule.seal!.CipherText();
            reconstructedArray1.load(FHEModule.context!, operands[0].data);
            const reconstructedArray2 = FHEModule.seal!.CipherText();
            reconstructedArray2.load(FHEModule.context!, operands[1].data);

            const result = evaluator.add(reconstructedArray1, reconstructedArray2)!;

            return result.save();
        } else {
            throw new Error('Unsupported operand types.');
        }
    },
};
