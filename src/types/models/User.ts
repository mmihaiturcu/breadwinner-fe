import { Role } from '../enums';

export interface User {
    id: number;

    email: string;

    role: Role;
}
