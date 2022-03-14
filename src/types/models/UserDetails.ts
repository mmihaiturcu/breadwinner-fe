import { Role } from '../enums';

export interface UserDetails {
    id: number;
    email: string;
    role: Role;
    enabled2FA: boolean;
}
