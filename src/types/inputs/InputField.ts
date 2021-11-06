import { InputType } from '..';

export interface InputField {
    id?: string | string[];
    type: InputType;
    label: string | string[];
    handler: (...args: unknown[]) => void;
    validator: () => boolean;
    customProps?: Record<string, unknown>;
    visible?: boolean;
    defaultValue?: string;
    showCondition?: boolean;
}
