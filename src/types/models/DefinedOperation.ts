import { Operand, Operation } from '.';

export interface DefinedOperation {
    operationObject: Operation;
    operands: Operand[]; // specify which results to send as parameters to the operation function itself. -1 is the actual initial data (array of values for instance)
}
