<template>
    <b-form @submit.prevent="sendRegister">
        <b-form-group label="Name:" label-for="text-name">
            <b-form-input
                type="text"
                id="text-name"
                v-model="form.name"
                placeholder="Please enter your name"
                :state="nameValidation"
                required
            ></b-form-input>
            <b-form-invalid-feedback :state="nameValidation">
                Please enter a valid name.
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Email:" label-for="text-email">
            <b-form-input
                type="email"
                id="text-email"
                v-model="form.email"
                placeholder="example@example.com"
                :state="emailValidation"
                required
            ></b-form-input>
            <b-form-invalid-feedback :state="emailValidation">
                Please enter a valid email.
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Password:" label-for="text-password">
            <b-form-input
                type="password"
                id="text-password"
                v-model="form.password"
                :state="passwordValidation"
                required
            ></b-form-input>
            <b-form-invalid-feedback :state="passwordValidation">
                Your password must be 8-20 characters long.
            </b-form-invalid-feedback>
        </b-form-group>

        <b-alert v-if="form.error" show variant="danger">{{
            form.error
        }}</b-alert>

        <b-button block pill type="submit" variant="primary">Register</b-button>
    </b-form>
</template>

<script>
import { auth, userCollection } from "@/firebase";
import store from "@/store";

export default {
    name: "RegisterForm",
    data() {
        return {
            form: {
                name: "",
                email: "",
                password: "",
                error: null,
            },
        };
    },
    methods: {
        async sendRegister() {
            this.form.error = null;
            try {
                const user = await auth.createUserWithEmailAndPassword(
                    this.form.email,
                    this.form.password
                );

                await user.user
                    .updateProfile({
                        displayName: this.form.name,
                    })
                    .then(() => {
                        userCollection.doc(user.user.uid).set({
                            name: this.form.name,
                            email: user.user.email,
                        });

                        store.state.user.userProfile = {
                            name: user.user.displayName,
                            email: user.user.email,
                            picture: user.user.photoURL,
                        };
                    });

                this.$router.replace({ name: "Dashboard" });
            } catch (err) {
                this.form.error = err.message;
            }
        },
    },
    computed: {
        nameValidation() {
            if (this.form.name === "") return null;
            return /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/i.test(this.form.name);
        },
        emailValidation() {
            if (this.form.email === "") return null;
            return /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/i.test(
                this.form.email
            );
        },
        passwordValidation() {
            if (this.form.password === "") return null;
            let characters = this.form.password.length;
            return characters >= 8 && characters <= 20 ? true : false;
        },
    },
};
</script>

<style></style>
