import { Operations } from 'breadwinner';
import { ResultType } from './ResultType';

export interface Operation {
    name: Operations;
    label: string;
    icon: string;
    minOperands: number;
    maxOperands: number;
    resultTypes: ResultType;
    requiresRelinKeys?: boolean;
}
