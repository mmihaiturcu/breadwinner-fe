import { createApp } from 'vue';
import App from './App.vue';
import VueSvgInlinePlugin from 'vue-svg-inline-plugin';
const app = createApp(App);

app.use(VueSvgInlinePlugin);

app.mount('#app');
