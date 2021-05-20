import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import router from "./router";
import store from "./store";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import { auth } from "@/firebase";
import { firestorePlugin } from "vuefire";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(firestorePlugin);

let app;

/*
 * Nos aseguramos que las peticiones de Firebase sean ejecutadas
 * antes de que la aplicacion sea ejecutada para evitar conflictos
 * debido al delay ocasionado
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        store.commit(`user/USER_DETAILS`, user);
    } else {
        store.commit(`user/LOGOUT`);
    }

    if (!app) {
        new Vue({
            router,
            store,
            render: (h) => h(App),
        }).$mount("#app");
    }
});
