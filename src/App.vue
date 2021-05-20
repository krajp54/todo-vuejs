<template>
    <div>
        <NavBar
            :exitApp="exitApp"
            :loggedIn="loggedIn"
            :userProfile="userProfile"
        />
        <router-view />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NavBar from "@/components/NavBar";

export default {
    name: "App",
    components: {
        NavBar,
    },
    computed: {
        ...mapGetters("user", {
            userProfile: "userProfile",
            loggedIn: "loggedIn",
        }),
    },
    methods: {
        ...mapActions("user", {
            exitApp: "exitApp",
        }),
    },
};
</script>

<style></style>
