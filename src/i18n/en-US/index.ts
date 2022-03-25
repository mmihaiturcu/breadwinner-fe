export default {
    login: {
        accountNotFound: 'No user matching the supplied credentials was found.',
    },
    register: {
        success:
            'Success! Please follow the instructions in the email sent to you in order to set a password.',
        invalidEmail: 'The supplied email address is invalid.',
        userAlreadyExists: 'A user with the specified email address already exists.',
    },
    confirm: {
        noUserFound: 'No user matching the specified confirmation was found.',
        success: 'Your password has been set successfully. Please use your credentials to log in.',
        invalidLink: 'The confirmation link is invalid.',
        expiredLink: 'The confirmation link is expired. Please create a new account.',
        alreadyUsedLink: 'The confirmation link has already been used.',
        atLeastANumber: 'The password must contain at least a number.',
        atLeastAnUppercase: 'The password must contain at least an uppercase letter.',
        atLeastASymbol: 'The password must contain at least a symbol.',
        passwordBetweenMinAndMax: 'The password must be between 8 and 20 characters long.',
        passwordsIdentical: 'The passwords must be identical.',
    },
    navigation: {
        apiKeys: 'API Keys',
        payloads: 'Payloads',
        dataProcessingTest: 'Data processing test',
        twoFactorAuthentication: 'Two factor authentication',
        payments: 'Payments',
        logout: 'Log out',
    },
    apiKeys: {
        createdTitle: "It's dangerous to go alone, take this!",
        createdMessage:
            'Please make sure to place the API key somewhere safe, it will not be viewable after closing this dialog window.',
        createdYourKeyIs: 'Your API key is: ',
        copied: 'API key copied to clipboard',
        notFound: 'No API key matching the supplied ID was found.',
        deletedSuccessfully: 'The API key has been successfully deleted.',
    },
    payload: {
        keysCreatedTitle: 'Your key pair',
        keysCreatedMessage:
            'In order to be able to decrypt the results of the payloads that you have created, you will need to provide this key pair.',
        keysCreatedDisclaimerTitle: 'Warning',
        keysCreatedDisclaimer:
            'Make sure to save and safeguard this keypair, you will not be able to retrieve it after closing this dialog window.',
        downloadKeyPair: 'Download key pair',
    },
};
