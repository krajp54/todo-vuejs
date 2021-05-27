<template>
    <b-form @submit.prevent="sendLogin">
        <b-form-group label="Email:" label-for="text-email">
            <b-form-input
                type="email"
                id="text-email"
                v-model="form.email"
                placeholder="example@example.com"
                required
            ></b-form-input
        ></b-form-group>

        <b-form-group label="Password:" label-for="text-password">
            <b-form-input
                type="password"
                id="text-password"
                v-model="form.password"
                required
            ></b-form-input>
        </b-form-group>

        <b-alert show v-if="form.error" variant="danger">{{
            form.error
        }}</b-alert>

        <b-button block pill type="submit" variant="primary">Login</b-button>

        <b-button block pill variant="secondary" @click="loginGoogle"
            >Login with Google</b-button
        >

        <b-button block pill variant="dark" @click="loginFacebook"
            >Login with Facebook</b-button
        >

        <b-alert show variant="dark" class="mt-2"
            >Need an account? Click here to
            <router-link to="/register">register</router-link></b-alert
        >
    </b-form>
</template>

<script>
import { auth, firebase, userCollection } from "@/firebase";

export default {
    name: "LoginForm",
    data() {
        return {
            form: {
                email: "",
                password: "",
                error: null,
            },
        };
    },
    methods: {
        async sendLogin() {
            this.form.error = null;
            try {
                await auth.signInWithEmailAndPassword(
                    this.form.email,
                    this.form.password
                );

                this.$router.replace({ name: "Dashboard" });
            } catch (err) {
                this.form.error = err.message;
            }
        },

        async loginGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();
            this.form.error = null;
            try {
                await auth.signInWithPopup(provider).then((user) => {
                    userCollection.doc(user.user.uid).set({
                        name: user.user.displayName,
                        email: user.user.email,
                    });
                });

                this.$router.replace({ name: "Dashboard" });
            } catch (err) {
                this.form.error = err.message;
            }
        },

        async loginFacebook() {
            const provider = new firebase.auth.FacebookAuthProvider();
            this.form.error = null;
            try {
                await auth.signInWithPopup(provider).then((user) => {
                    userCollection.doc(user.user.uid).set({
                        name: user.user.displayName,
                        email: user.user.email,
                    });
                });

                this.$router.replace({ name: "Dashboard" });
            } catch (err) {
                this.form.error = err.message;
            }
        },
    },
};
</script>

<style></style>
