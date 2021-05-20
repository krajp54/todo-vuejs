<template>
    <b-tab title="Personal" active>
        <b-jumbotron bg-variant="light" class="pt-4 pb-4">
            <template #header>Personal Dashboard</template>

            <template #lead
                >Here you can see all your personal tasks and the tasks assigned
                to you within your teams.</template
            >

            <b-img
                v-if="isTasksEmpty"
                center
                fluid
                :src="require(`@/assets/personal.svg`)"
                alt="Personal"
                class="pb-4 pt-4"
            ></b-img>

            <b-container fluid v-else class="pb-2">
                <TaskItem
                    v-for="task in allTasks"
                    v-bind:key="task.id"
                    v-bind:task="task"
                    v-bind:userProfile="userProfile"
                    @deleteTask="deleteTask(task)"
                ></TaskItem>
            </b-container>

            <b-container fluid>
                <b-form ref="newTask" @submit.prevent="addTask">
                    <b-form-group
                        label="Enter a new task:"
                        label-for="new-task"
                        invalid-feedback="You need to add some text"
                    >
                        <b-form-input
                            type="text"
                            id="new-task"
                            v-model="newTask"
                            :state="taskValidation"
                            required
                        ></b-form-input>
                    </b-form-group>
                </b-form>
            </b-container>
            <b-alert show v-if="error" variant="danger">{{ error }}</b-alert>
        </b-jumbotron>
    </b-tab>
</template>

<script>
import { mapGetters } from "vuex";
import { taskCollection } from "@/firebase";
import TaskItem from "@/components/TaskItem";

export default {
    name: "PersonalTab",
    components: {
        TaskItem,
    },
    data() {
        return {
            newTask: null,
            allTasks: [],
            error: null,
        };
    },
    firestore() {
        return {
            allTasks: taskCollection
                .where("assigned_to", "==", this.userProfile.id)
                .orderBy("created_date"),
        };
    },
    methods: {
        async addTask() {
            try {
                taskCollection.add({
                    owner_id: this.userProfile.id,
                    content: this.newTask,
                    created_date: this.currentDate,
                    due_date: "",
                    tag: "Personal",
                    assigned_to: this.userProfile.id,
                    completed: false,
                });

                this.$refs.newTask.reset();
                this.newTask = null;
            } catch (err) {
                this.error = err.message;
            }
        },
        async deleteTask(task) {
            try {
                taskCollection.doc(task.id).delete();
            } catch (err) {
                this.error = err.message;
            }
        },
    },
    computed: {
        ...mapGetters("user", {
            userProfile: "userProfile",
        }),
        taskValidation() {
            if (this.newTask === null) return null;
            return !(this.newTask === "");
        },
        isTasksEmpty() {
            return this.allTasks.length === 0;
        },
        currentDate() {
            const today = new Date();
            return (
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate()
            );
        },
    },
};
</script>

<style scoped>
h1 {
    font-size: 2.5rem;
}

img {
    width: 40%;
    height: auto;
}

.lead {
    font-size: 1rem;
}
</style>
