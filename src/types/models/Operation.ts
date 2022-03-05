import { Operations } from '../enums';
import { ResultType } from './ResultType';

export interface Operation {
    name: Operations;
    label: string;
    icon: string;
    minOperands: number;
    maxOperands: number;
    resultTypes: ResultType;
}
