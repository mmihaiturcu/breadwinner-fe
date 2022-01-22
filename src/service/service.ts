import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';

export async function createAPIKey(): Promise<AxiosResponse<string>> {
    return api.post('apiKey/create');
}
