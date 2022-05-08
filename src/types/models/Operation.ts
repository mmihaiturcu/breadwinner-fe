import { OperationType } from 'breadwinner';
import { ResultType } from './ResultType';

export interface Operation {
    type: OperationType;
    label: string;
    icon: string;
    minOperands: number;
    maxOperands: number;
    resultTypes: ResultType;
    requiresRelinKeys?: boolean;
}
