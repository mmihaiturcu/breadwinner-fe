import { User } from '../models';

export interface CreateApiKeyRequest {
    userId: User['id'];
    hostname: string;
}
