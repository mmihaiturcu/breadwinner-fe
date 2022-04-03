import { Role } from '../enums';

export interface UserLoginResponse {
    id: string;
    roleSpecificId: string;
    email: string;
    role: Role;
    csrfToken: string;
    shouldValidate2FA: boolean;
    enabled2FA: boolean;
}
