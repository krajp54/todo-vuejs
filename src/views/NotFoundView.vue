<template>
    <div class="container">
        <b-jumbotron bg-variant="light" class="pt-4 pb-4">
            <template #header>404</template>

            <template #lead>
                We really tried to find what you're looking for :(
            </template>

            <b-img
                center
                :src="require(`@/assets/searching.svg`)"
                thumbnail
                fluid
                alt="Home"
                class="pt-2"
            ></b-img>
            <hr class="my-3" />

            <b-alert
                show
                variant="secondary"
                class="mt-2 d-flex justify-content-center"
                ><router-link to="/" class="alert-link"
                    >Home</router-link
                ></b-alert
            >
        </b-jumbotron>
    </div>
</template>

<script>
export default {
    name: "NotFoundView",
};
</script>

<style>
h1 {
    font-size: 2.5rem;
}

img {
    width: 35%;
    height: auto;
}

.lead {
    font-size: 1rem;
}
</style>
