import { MessageSchema } from 'src/boot/i18n';
import { useI18n } from 'vue-i18n';

export function useGlobalI18n() {
    return useI18n<{ message: MessageSchema }>({
        useScope: 'global',
    });
}
