import { Header, DefinedOperation } from '.';

export interface PayloadTab {
    name: string;
    state: {
        selectedRows: unknown[][];
        selectedHeader: null | Header;
        operations: DefinedOperation[];
    };
}
