<template>
    <div class="container">
        <b-jumbotron bg-variant="light" class="pt-4 pb-4">
            <template #header>To-Do Vue App</template>

            <template #lead>
                This is a simple To-Do App made in VueJS
            </template>

            <hr class="my-3" />

            <b-img
                center
                :src="require(`@/assets/project.png`)"
                thumbnail
                fluid
                alt="Home"
            ></b-img>
            <hr class="my-3" />

            <b-alert
                show
                variant="light"
                class="mt-2 d-flex justify-content-center"
                >Please
                <router-link class="pl-1 pr-1" to="/login">login</router-link>
                or
                <router-link class="pl-1 pr-1" to="/register"
                    >register</router-link
                >
                to use the app.
            </b-alert>
        </b-jumbotron>
    </div>
</template>

<script>
export default {
    name: "HomeView",
};
</script>

<style scoped>
h1 {
    font-size: 2.5rem;
}

img {
    width: 60%;
    height: auto;
}

.lead {
    font-size: 1rem;
}
</style>
