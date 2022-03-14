import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import { APIKey, DecryptPayloadDTO, Payload, PayloadDTO, UserDetails } from 'src/types/models';
import {
    CheckConfirmationLinkValidRequest,
    CreateApiKeyRequest,
    Enable2FARequest,
    UserCreateRequest,
    UserFinishRequest,
    UserLoginRequest,
} from 'src/types/requests';
import { GetTrialQRCodeResponse, UserLoginResponse } from 'src/types/responses';

export async function getCSRFToken(): Promise<AxiosResponse<string>> {
    return api.get('user/csrf', {
        withCredentials: true,
    });
}

export async function registerAccount(payload: UserCreateRequest): Promise<AxiosResponse<void>> {
    return api.post('user/create', payload, {
        refreshCSRFToken: true,
        withCredentials: true,
        withCsrf: true,
    });
}

export async function checkAccountConfirmationValid(payload: CheckConfirmationLinkValidRequest) {
    return api.post('confirmation/verify', payload, {
        refreshCSRFToken: true,
        withCredentials: true,
        withCsrf: true,
    });
}

export async function finishAccount(payload: UserFinishRequest): Promise<AxiosResponse<void>> {
    return api.post('user/finish', payload, {
        refreshCSRFToken: true,
        withCredentials: true,
        withCsrf: true,
    });
}

export async function getSession(): Promise<AxiosResponse<UserLoginResponse | ''>> {
    return api.get('user/session', {
        withCredentials: true,
    });
}

export async function loginUser(
    payload: UserLoginRequest
): Promise<AxiosResponse<UserLoginResponse>> {
    return api.post('user/login', payload, {
        refreshCSRFToken: true,
        withCredentials: true,
        withCsrf: true,
    });
}

export async function getApiKeysForUser(): Promise<AxiosResponse<APIKey[]>> {
    return api.get('user/apiKeys', {
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

export async function getPayloadsForUser(): Promise<AxiosResponse<Payload[]>> {
    return api.get('user/payloads', {
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
    userId: UserDetails['id'],
    id: Payload['id']
): Promise<AxiosResponse<DecryptPayloadDTO>> {
    return api.get(`payload/${userId}/${id}/decryptInfo`, {
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

export async function getTrialQRCodeSecret(): Promise<AxiosResponse<GetTrialQRCodeResponse>> {
    return api.post('user/getTrialQRCodeSecret', null, {
        withCredentials: true,
        withCsrf: true,
    });
}

export async function enable2FA(payload: Enable2FARequest): Promise<AxiosResponse<void>> {
    return api.post('user/enable2FA', payload, {
        withCredentials: true,
        withCsrf: true,
    });
}

export async function disable2FA(): Promise<AxiosResponse<void>> {
    return api.delete('user/disable2FA', {
        withCredentials: true,
        withCsrf: true,
    });
}

export async function validate2FAToken(payload: { token: string }): Promise<AxiosResponse<void>> {
    return api.post('user/validate2FAToken', payload, {
        withCredentials: true,
        withCsrf: true,
    });
}
