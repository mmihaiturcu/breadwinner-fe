import { OperandTypes, Operations, Role } from 'src/types/enums';

export const CHUNK_SIZE = 1000;

export const OPERATIONS = [
    {
        name: Operations.ADD,
        label: 'Add',
        icon: 'mdi-plus',
        minOperands: 1,
        maxOperands: 2,
        resultTypes: {
            [OperandTypes.NUMBER]: {
                [OperandTypes.NUMBER]: OperandTypes.NUMBER,
                [OperandTypes.ARRAY]: OperandTypes.ARRAY,
                [OperandTypes.NONE]: null,
            },
            [OperandTypes.ARRAY]: {
                [OperandTypes.NUMBER]: OperandTypes.ARRAY,
                [OperandTypes.ARRAY]: OperandTypes.ARRAY,
                [OperandTypes.NONE]: OperandTypes.NUMBER,
            },
        },
    },
    {
        name: Operations.SUBTRACT,
        label: 'Subtract',
        icon: 'mdi-minus',
        minOperands: 2,
        maxOperands: 2,
        resultTypes: {
            [OperandTypes.NUMBER]: {
                [OperandTypes.NUMBER]: OperandTypes.NUMBER,
            },
            [OperandTypes.ARRAY]: {
                [OperandTypes.NUMBER]: OperandTypes.ARRAY,
                [OperandTypes.ARRAY]: OperandTypes.ARRAY,
            },
        },
    },
    {
        name: Operations.MULTIPLY,
        label: 'Multiply',
        icon: 'mdi-multiplication',
        minOperands: 2,
        maxOperands: 2,
    },
    {
        name: Operations.SQUARE,
        label: 'Square',
        icon: 'mdi-multiplication',
        minOperands: 1,
        maxOperands: 1,
        resultTypes: {
            [OperandTypes.NUMBER]: OperandTypes.NUMBER,
            [OperandTypes.ARRAY]: OperandTypes.ARRAY,
        },
    },
    {
        name: Operations.DIVIDE,
        label: 'Divide',
        icon: 'mdi-division',
        minOperands: 2,
        maxOperands: 2,
        resultTypes: {
            [OperandTypes.NUMBER]: {
                [OperandTypes.NUMBER]: OperandTypes.NUMBER,
            },
            [OperandTypes.ARRAY]: {
                [OperandTypes.NUMBER]: OperandTypes.ARRAY,
            },
        },
    },
    {
        name: Operations.SQUARE_ROOT,
        label: 'Square root',
        icon: 'mdi-square-root',
        minOperands: 1,
        maxOperands: 1,
        resultTypes: {
            [OperandTypes.NUMBER]: {
                [OperandTypes.NUMBER]: OperandTypes.NUMBER,
            },
        },
    },
];

export const COMPLEX_OPERATION_PRESETS = {
    standardDeviation: {
        label: 'Standard deviation',
        iconPath:
            'M990 1740 c-288 -17 -438 -81 -579 -244 -81 -94 -131 -183 -167 -301 -27 -86 -27 -361 0 -455 85 -305 334 -560 617 -631 69 -18 104 -21 218 -17 120 4 147 8 223 35 161 56 302 162 387 289 73 108 96 189 95 334 0 125 -17 198 -74 309 -62 124 -213 286 -351 378 l-72 48 342 3 342 2 -3 128 -3 127 -425 1 c-234 0 -481 -2 -550 -6z m223 -311 c112 -123 195 -271 239 -425 31 -107 32 -335 4 -434 -61 -208 -183 -346 -326 -367 -207 -31 -404 103 -525 358 -99 209 -112 497 -30 660 39 78 72 116 144 163 104 70 219 101 383 105 l56 1 55 -61z',
        operations: [
            {
                name: 'add',
                operands: [-1],
            },
            {
                name: 'divide',
                operands: [0, { index: -1, property: 'length' }],
            },
            {
                name: 'multiply',
                operands: [-1, 1],
            },
            {
                name: 'square',
                operands: [2],
            },
            {
                name: 'add',
                operands: [3],
            },
            {
                name: 'divide',
                operands: [4, { index: -1, property: 'length' }],
            },
            {
                name: 'squareRoot',
                operands: [5],
            },
        ],
    },
};

export const DEFAULT_ROUTES = {
    [Role.ADMIN]: '/main/dashboard',
    [Role.DATA_PROCESSOR]: '/main/api-keys',
    [Role.DATA_SUPPLIER]: '/main/payloads',
};
