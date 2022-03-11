import { DefinedOperation } from '.';

export interface PayloadTab {
    name: string;
    label: string;
    state: {
        selectedRows: unknown[][];
        operations: DefinedOperation[];
    };
}
