import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import { APIKey, User } from 'src/types/models';
import {
    CheckConfirmationLinkValidRequest,
    CreateApiKeyRequest,
    UserCreateRequest,
    UserFinishRequest,
    UserLoginRequest,
} from 'src/types/requests';
import { UserLoginResponse } from 'src/types/responses';

export async function registerAccount(payload: UserCreateRequest): Promise<AxiosResponse<void>> {
    return api.post('user/create', payload);
}

export async function checkAccountConfirmationValid(payload: CheckConfirmationLinkValidRequest) {
    return api.post('confirmation/verify', payload);
}

export async function finishAccount(payload: UserFinishRequest): Promise<AxiosResponse<void>> {
    return api.post('user/finish', payload);
}

export async function loginUser(
    payload: UserLoginRequest
): Promise<AxiosResponse<UserLoginResponse>> {
    return api.post('user/login', payload);
}

export async function getApiKeysForUser(userId: User['id']): Promise<AxiosResponse<APIKey[]>> {
    return api.get(`user/${userId}/apiKeys`);
}

/**
 *
 * @param payload
 * @returns the full API Key (it is NOT stored on BE, user should copy it)
 */
export async function createAPIKey(payload: CreateApiKeyRequest): Promise<AxiosResponse<string>> {
    return api.post('apiKey/create', payload);
}
