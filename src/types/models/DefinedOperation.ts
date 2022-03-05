import { OperandOption, Operation } from '.';
import { OperandTypes } from '../enums';

export interface DefinedOperation {
    operationObject: Operation;
    operands: OperandOption[]; // specify which results to send as parameters to the operation function itself. -1 is the actual initial data (array of values for instance)
    resultType: OperandTypes; // what kind of result the operation will have (useful when chaining several operations)
}
