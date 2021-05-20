<template>
    <div class="pt-2">
        <b-card
            class="pt-3 mb-2 container d-flex align-items-center justify-content-center"
            style="max-width: 40%"
        >
            <b-card-img
                v-if="userProfile.picture"
                top
                :src="userProfile.picture"
                :alt="userProfile.name"
                class="rounded-circle"
            ></b-card-img>
            <b-avatar v-else size="12rem"></b-avatar>

            <b-card-title class="pt-3">{{ userProfile.name }}</b-card-title>
            <b-card-text>{{ userProfile.email }}</b-card-text>
            <!-- <b-button>Edit Profile</b-button> -->
        </b-card>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "User",
    computed: {
        ...mapGetters("user", {
            userProfile: "userProfile",
        }),
    },
};
</script>

<style></style>
