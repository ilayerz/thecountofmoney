import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Toaster from '@meforma/vue-toaster';

import { auth } from './firebase';

let app;
auth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App)
            .use(store)
            .use(router)
            .use(Toaster)
            .mount('#app');
    }
});