import { auth } from "@/firebase";
import router from "@/router";

const state = {
    userProfile: {},
    loggedIn: false,
};

const getters = {
    userProfile: ({ userProfile }) => userProfile,
    loggedIn: ({ loggedIn }) => loggedIn,
};

const mutations = {
    USER_DETAILS(state, userProfile) {
        state.loggedIn = true;
        state.userProfile = {
            id: userProfile.uid,
            name: userProfile.displayName,
            email: userProfile.email,
            picture: userProfile.photoURL,
        };
    },
    LOGOUT(state) {
        state.loggedIn = false;
        state.userProfile = {};
    },
};

const actions = {
    async exitApp() {
        try {
            await auth.signOut().then(() => router.push("/login"));
        } catch (err) {
            console.log(err);
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
