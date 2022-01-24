import emailValidator from 'email-validator';

export function useEmailValidation() {
    function validateEmail(value: string): boolean {
        return emailValidator.validate(value);
    }

    return {
        validateEmail,
    };
}
