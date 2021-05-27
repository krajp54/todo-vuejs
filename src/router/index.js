import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

import { auth } from "@/firebase";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView,
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
        component: LoginView,
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
        component: RegisterView,
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
        component: () => import("@/views/DashboardView"),
    },
    {
        path: "/user",
        name: "User",
        meta: { requiresAuth: true },
        component: () => import("@/views/UserView"),
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
