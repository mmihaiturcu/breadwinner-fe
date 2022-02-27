import { Operations } from '../enums';

export interface Operation {
    name: Operations;
    label: string;
    icon: string;
    minOperands: number;
    maxOperands: number;
}
