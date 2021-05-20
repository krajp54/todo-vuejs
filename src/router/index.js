import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

import { auth } from "@/firebase";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        beforeEnter: (to, from, next) => {
            const isAuthenticated = auth.currentUser;
            if (isAuthenticated) {
                next("/dashboard");
            } else {
                next();
            }
        },
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        beforeEnter: (to, from, next) => {
            const isAuthenticated = auth.currentUser;
            if (isAuthenticated) {
                next(false);
            } else {
                next();
            }
        },
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        beforeEnter: (to, from, next) => {
            const isAuthenticated = auth.currentUser;
            if (isAuthenticated) {
                next(false);
            } else {
                next();
            }
        },
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        meta: { requiresAuth: true },
        component: () => import("@/views/Dashboard"),
    },
    {
        path: "/user",
        name: "User",
        meta: { requiresAuth: true },
        component: () => import("@/views/User"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = auth.currentUser;

    if (requiresAuth && !isAuthenticated) {
        next("/login");
    } else {
        next();
    }
});

export default router;
