import { Role } from '../enums';

export interface UserLoginResponse {
    id: number;

    email: string;

    role: Role;
}
