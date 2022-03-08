import { defineStore } from 'pinia';
import { getCSRFToken } from 'src/service/service';
import { Role } from 'src/types/enums';
import { UserCreateRequest, UserLoginRequest } from 'src/types/requests';
import { UserLoginResponse } from 'src/types/responses';

const storeID = 'user';

interface UserStoreState {
    isLoggedIn: boolean;
    currentActiveAuthenticationComponent: 'LoginForm' | 'RegisterForm';
    loginPayload: UserLoginRequest;
    registerPayload: UserCreateRequest;
    userDetails: Omit<UserLoginResponse, 'csrfToken'>;
    csrfToken: string;
}

const UserStoreState: UserStoreState = {
    isLoggedIn: false,
    currentActiveAuthenticationComponent: 'LoginForm',
    loginPayload: {
        email: '',
        password: '',
    },
    registerPayload: {
        email: '',
        userRole: Role.DATA_SUPPLIER,
    },
    userDetails: {
        id: 0,
        email: '',
        role: Role.DATA_SUPPLIER,
    },
    csrfToken: '',
};

export { UserStoreState };

export const useUserStore = defineStore({
    id: storeID,
    state: (): UserStoreState =>
        JSON.parse(
            typeof window !== 'undefined'
                ? localStorage.getItem(storeID) ?? JSON.stringify(UserStoreState)
                : JSON.stringify(UserStoreState)
        ) as UserStoreState,
    actions: {
        async regenerateSession() {
            const response = await getCSRFToken();
            this.csrfToken = response.data;
        },
    },
});

export type UserStore = ReturnType<typeof useUserStore>;
