import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = typeof messages['en-US'];

export default boot(({ app }) => {
    const i18n = createI18n<[MessageSchema], 'en-US'>({
        locale: 'en-US',
        messages,
    });

    // Set i18n instance on app
    app.use(i18n);
});
