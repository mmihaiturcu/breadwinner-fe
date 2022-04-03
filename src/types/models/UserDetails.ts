import { Role } from '../enums';

export interface UserDetails {
    id: string;
    roleSpecificId: string;
    email: string;
    role: Role;
    enabled2FA: boolean;
}
