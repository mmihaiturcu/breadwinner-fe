import { InputField, MIMEType } from '..';

export interface InputFieldFile extends InputField {
    acceptedMIMETypes: Partial<Record<MIMEType, true>>;
    previewURL: string | null;
    value: File | null;
    description?: string;
}
