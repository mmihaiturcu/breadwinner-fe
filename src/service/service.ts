import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import { APIKey, DecryptPayloadDTO, Payload, PayloadDTO, User } from 'src/types/models';
import {
    CheckConfirmationLinkValidRequest,
    CreateApiKeyRequest,
    UserCreateRequest,
    UserFinishRequest,
    UserLoginRequest,
} from 'src/types/requests';
import { UserLoginResponse } from 'src/types/responses';

export async function getCSRFToken(): Promise<AxiosResponse<string>> {
    return api.get('user/csrf', {
        withCredentials: true,
    });
}

export async function registerAccount(payload: UserCreateRequest): Promise<AxiosResponse<void>> {
    return api.post('user/create', payload, {
        preSession: true,
        withCredentials: true,
        withCsrf: true,
    });
}

export async function checkAccountConfirmationValid(payload: CheckConfirmationLinkValidRequest) {
    return api.post('confirmation/verify', payload, {
        preSession: true,
        withCredentials: true,
        withCsrf: true,
    });
}

export async function finishAccount(payload: UserFinishRequest): Promise<AxiosResponse<void>> {
    return api.post('user/finish', payload, {
        preSession: true,
        withCredentials: true,
        withCsrf: true,
    });
}

export async function getLoggedInSession(): Promise<AxiosResponse<UserLoginResponse | ''>> {
    return api.get('user/loggedInSession', {
        withCredentials: true,
    });
}

export async function loginUser(
    payload: UserLoginRequest
): Promise<AxiosResponse<UserLoginResponse>> {
    return api.post('user/login', payload, {
        preSession: true,
        withCredentials: true,
        withCsrf: true,
    });
}

export async function getApiKeysForUser(userId: User['id']): Promise<AxiosResponse<APIKey[]>> {
    return api.get(`user/${userId}/apiKeys`, {
        withCredentials: true,
    });
}

/**
 *
 * @param payload
 * @returns the full API Key (it is NOT stored on BE, user should copy it)
 */
export async function createAPIKey(payload: CreateApiKeyRequest): Promise<AxiosResponse<string>> {
    return api.post('apiKey/create', payload, {
        withCredentials: true,
        withCsrf: true,
    });
}

export async function deleteAPIKey(id: APIKey['id']): Promise<AxiosResponse<void>> {
    return api.delete(`apiKey/${id}`, {
        withCredentials: true,
        withCsrf: true,
    });
}

export async function getPayloadsForUser(userId: User['id']): Promise<AxiosResponse<Payload[]>> {
    return api.get(`user/${userId}/payloads`, {
        withCredentials: true,
    });
}

export async function createPayload(payload: PayloadDTO): Promise<AxiosResponse<void>> {
    return api.post('payload/createPayload', payload, {
        withCredentials: true,
        withCsrf: true,
    });
}

export async function getPayloadDecryptInfo(
    id: Payload['id']
): Promise<AxiosResponse<DecryptPayloadDTO>> {
    return api.get(`payload/${id}/decryptInfo`, {
        withCredentials: true,
    });
}

export async function getProcessedChunkOutput(id: number): Promise<AxiosResponse<string>> {
    return api.get(`chunk/${id}/output`, {
        withCredentials: true,
    });
}

export async function logout(): Promise<AxiosResponse<string>> {
    return api.post('user/logout', null, {
        withCredentials: true,
        withCsrf: true,
    });
}
