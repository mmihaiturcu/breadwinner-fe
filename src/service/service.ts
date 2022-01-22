import { HTTPS_SERVER_URL } from '@/utils/constants';
import axios, { AxiosResponse } from 'axios';

export async function createAPIKey(): Promise<AxiosResponse<string>> {
    return axios.post(`${HTTPS_SERVER_URL}/apiKey/create`);
}
