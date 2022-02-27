import { Header } from '.';

export interface Dataset {
    headers: Header[];
    data: Array<Array<unknown>>;
}
