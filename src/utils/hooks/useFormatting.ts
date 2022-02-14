import { date } from 'quasar';

export function useFormatting() {
    function formatDateSimple(value: Date): string {
        return date.formatDate(value, 'DD/MM/YYYY');
    }

    return {
        formatDateSimple,
    };
}
