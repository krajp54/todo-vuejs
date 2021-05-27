<template>
    <div class="container">
        <b-tabs class="mt-2">
            <PersonalTab />
            <TeamsTab />
        </b-tabs>
    </div>
</template>

<script>
import PersonalTab from "@/components/PersonalTab";
import TeamsTab from "@/components/TeamsTab";

export default {
    name: "DashboardView",
    components: {
        PersonalTab,
        TeamsTab,
    },
};
</script>

<style></style>
