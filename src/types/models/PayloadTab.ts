import { DefinedOperation } from '.';

export interface PayloadTab {
    name: string;
    label: string;
    state: {
        operations: DefinedOperation[];
    };
}
