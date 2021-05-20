<template>
    <div>
        <b-navbar toggleable="md" type="dark" variant="dark">
            <b-container>
                <b-navbar-brand href="/">To-Do</b-navbar-brand>
                <b-navbar-toggle
                    target="nav_collapse"
                    class="ml-auto"
                ></b-navbar-toggle>

                <b-collapse is-nav id="nav_collapse" v-if="!loggedIn">
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item to="/" exact>Home</b-nav-item>
                        <b-nav-item to="/login">Login</b-nav-item>
                        <b-nav-item to="/register">Register</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>

                <b-collapse is-nav id="nav_collapse" v-else>
                    <b-navbar-nav class="ml-auto">
                        <b-avatar :src="userProfile.picture"></b-avatar>
                        <b-nav-item to="/user">
                            {{
                                userProfile.name || userProfile.email
                            }}</b-nav-item
                        >
                        <b-nav-item to="/dashboard">Dashboard</b-nav-item>
                        <b-nav-item @click="exitApp">Logout</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: "NavBar",
    props: {
        exitApp: {
            type: Function,
            required: true,
        },
        loggedIn: {
            type: Boolean,
            required: true,
            default: false,
        },
        userProfile: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style></style>
