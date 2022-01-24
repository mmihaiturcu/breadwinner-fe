import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import {
    CheckConfirmationLinkValidRequest,
    UserCreateRequest,
    UserFinishRequest,
    UserLoginRequest,
} from 'src/types/requests';
import { UserLoginResponse } from 'src/types/responses';

export async function createAPIKey(): Promise<AxiosResponse<string>> {
    return api.post('apiKey/create');
}

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
