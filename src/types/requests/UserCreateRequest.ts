import { Role } from '../enums';

export interface UserCreateRequest {
    email: string;

    userRole: Role.DATA_SUPPLIER | Role.DATA_PROCESSOR;
}
