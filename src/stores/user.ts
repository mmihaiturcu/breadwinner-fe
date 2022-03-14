import { defineStore } from 'pinia';
import { getCSRFToken } from 'src/service/service';
import { Role } from 'src/types/enums';
import { UserDetails } from 'src/types/models';
import { UserCreateRequest, UserLoginRequest } from 'src/types/requests';

const storeID = 'user';

interface UserStoreState {
    isLoggedIn: boolean;
    currentActiveAuthenticationComponent: 'LoginForm' | 'RegisterForm';
    loginPayload: UserLoginRequest;
    registerPayload: UserCreateRequest;
    userDetails: UserDetails;
    csrfToken: string;
    showInput2FATokenModal: boolean;
    twoFAToken: string;
    currentEnable2FAStep: number;
    trialQRCodeDataURI: string;
    trial2FASecret: string;
    trial2FAToken: string;
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
        enabled2FA: false,
    },
    csrfToken: '',
    showInput2FATokenModal: false,
    twoFAToken: '',
    currentEnable2FAStep: 1,
    trialQRCodeDataURI: '',
    trial2FASecret: '',
    trial2FAToken: '',
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
