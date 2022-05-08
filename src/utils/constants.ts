import { OperandTypes, OperationType, Role } from 'src/types/enums';

export const CHUNK_SIZE = 1000;
export const CSRF_HEADER_NAME = 'CSRF-Token';

// Prices in $
export const PRICE_PER_CHUNK = 0.01;
export const PRICE_PER_OPERATION = 0.005;
export const MIN_PAYLOAD_PRICE = 0.5;

export const STRIPE_ICON_PATH =
    'M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z';

export const OPERATIONS = [
    {
        type: OperationType.ADD,
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
        type: OperationType.SUBTRACT,
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
        type: OperationType.MULTIPLY,
        label: 'Multiply',
        icon: 'mdi-multiplication',
        minOperands: 2,
        maxOperands: 2,
        requiresRelinKeys: true,
        resultTypes: {
            [OperandTypes.NUMBER]: {
                [OperandTypes.NUMBER]: OperandTypes.NUMBER,
                [OperandTypes.ARRAY]: OperandTypes.ARRAY,
            },
            [OperandTypes.ARRAY]: {
                [OperandTypes.NUMBER]: OperandTypes.ARRAY,
                [OperandTypes.ARRAY]: OperandTypes.ARRAY,
            },
        },
    },
    {
        type: OperationType.EXPONENTIATION,
        label: 'Exponentiation',
        icon: 'mdi-exponent',
        minOperands: 2,
        maxOperands: 2,
        requiresRelinKeys: true,
        resultTypes: {
            [OperandTypes.ARRAY]: {
                [OperandTypes.NUMBER]: OperandTypes.ARRAY,
            },
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
    [Role.DATA_PROCESSOR]: '/main/api-keys',
    [Role.DATA_SUPPLIER]: '/main/payloads',
};
