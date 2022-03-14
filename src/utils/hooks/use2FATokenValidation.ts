export function use2FATokenValidation() {
    const validate2FAToken = (value: string) =>
        /^[0-9]{6}$/.test(value) || 'The token must be 6 digits long.';

    return {
        validate2FAToken,
    };
}
