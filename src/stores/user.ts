import { defineStore } from 'pinia';
import { Role } from 'src/types/enums';
import { User } from 'src/types/models';
import { UserCreateRequest, UserLoginRequest } from 'src/types/requests';
import { UserLoginResponse } from 'src/types/responses';

const storeID = 'user';

interface UserStoreState {
    user: User;
    isLoggedIn: boolean;
    currentActiveAuthenticationComponent: 'LoginForm' | 'RegisterForm';
    loginPayload: UserLoginRequest;
    registerPayload: UserCreateRequest;
    userDetails: UserLoginResponse;
}

const UserStoreState: UserStoreState = {
    user: {
        id: 0,
        email: '',
        role: Role.DATA_SUPPLIER,
    },
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
});

export type UserStore = ReturnType<typeof useUserStore>;
