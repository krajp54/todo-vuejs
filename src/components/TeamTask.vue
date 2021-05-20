<template>
    <div>
        <b-row class="my-1 d-inline-md-flex align-items-center">
            <b-col sm="1">
                <b-form-checkbox
                    size="lg"
                    v-model="task.completed"
                    @change="changeState"
                >
                </b-form-checkbox
            ></b-col>
            <b-col cols="8">
                <b-form-input
                    ref="inputTask"
                    v-model="task.content"
                    :value="task.content"
                    :readonly="!isEnabled"
                    @dblclick="editTask"
                    @keypress="confirmEditTask"
                    :class="isCompleted"
                >
                </b-form-input>
            </b-col>
            <b-col>
                <b-button variant="dark" @click="assignTask"
                    >Assign Task</b-button
                >
            </b-col>
            <b-col sm="1">
                <b-form-datepicker
                    v-model="task.due_date"
                    :disabled="dueDateDisabled"
                    :min="minDateCalendar"
                    button-only
                    today-button
                    reset-button
                    close-button
                    locale="en"
                    dropleft
                    hide-header
                    @context="getFormattedDate"
                    :date-format-options="{
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        weekday: 'short',
                    }"
                    v-b-popover.hover.top="'Choose a due date'"
                    ref="dueDatePicker"
                ></b-form-datepicker>
            </b-col>
        </b-row>
        <b-row>
            <b-col></b-col>
            <b-col cols="9" class="d-lg-inline-flex">
                <p class="pl-1">
                    <b-badge
                        variant="light"
                        v-b-popover.hover.bottom="'Created date'"
                    >
                        <b-icon icon="calendar2-fill"></b-icon>
                        {{ createdDateFormatted }}</b-badge
                    >
                </p>
                <p class="pl-1" v-if="task.assigned_to != ''">
                    <b-badge
                        variant="dark"
                        v-b-popover.hover.bottom="'Assigned to'"
                    >
                        <b-icon icon="person-check-fill"></b-icon>
                        {{ nameMemberAssigned }}</b-badge
                    >
                </p>
                <p class="pl-1" v-if="task.due_date != ''">
                    <b-badge
                        variant="info"
                        v-b-popover.hover.bottom="'Due date'"
                        ><b-icon
                            v-if="this.task.completed"
                            icon="calendar2-check-fill"
                        ></b-icon>
                        <b-icon v-else icon="calendar2-minus-fill"></b-icon>
                        {{ dueDateFormatted }}</b-badge
                    >
                </p>
            </b-col>
            <b-col>
                <b-button
                    size="sm"
                    variant="danger"
                    v-b-popover.hover.top="'Delete task'"
                    @click="deleteConfirm"
                    ><b-icon icon="trash-fill"></b-icon
                ></b-button>
            </b-col>
            <b-col></b-col>
        </b-row>
        <b-row>
            <b-alert show v-if="error" variant="danger">{{ error }}</b-alert>
        </b-row>
    </div>
</template>

<script>
import { userCollection, taskCollection } from "@/firebase";
import { debounce } from "debounce";

export default {
    name: "TeamTask",
    props: {
        task: {
            type: Object,
            required: true,
        },
        team: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            state: "loading",
            isEnabled: false,
            isCompleted: "incompleted",
            dueDateDisabled: false,
            dueDateFormatted: "",
            modalConfirm: null,
            error: null,
            nameMemberAssigned: "",
            selectedMember: "",
            assignConfirm: null,
        };
    },
    mounted() {
        this.taskState();
        this.nameMember();
    },
    methods: {
        async updateTask() {
            try {
                await taskCollection.doc(this.task.id).set(this.task);
            } catch (err) {
                this.error = err.message;
            }
        },
        async changeState() {
            this.debounceUpdated();
            this.taskState();
        },
        taskState() {
            if (this.task.completed) {
                this.isCompleted = "completed";
                this.dueDateDisabled = true;
            } else {
                this.isCompleted = "incompleted";
                this.dueDateDisabled = false;
            }
        },
        editTask() {
            if (this.task.completed) return;
            this.isEnabled = true;
        },
        async confirmEditTask(event) {
            if (event.keyCode == 13) {
                this.debounceUpdated();
                this.isEnabled = false;
            }
        },
        async getFormattedDate(ctx) {
            this.debounceUpdated();
            this.dueDateFormatted = ctx.selectedFormatted;
        },
        debounceUpdated: debounce(function () {
            this.updateTask();
        }, 2000),
        deleteConfirm() {
            this.modalConfirm = null;
            this.$bvModal
                .msgBoxConfirm(
                    "Please confirm that you want to delete this task",
                    {
                        title: "Delete task",
                        size: "sm",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "Yes",
                        cancelTitle: "No",
                        hideHeaderClose: true,
                        centered: true,
                    }
                )
                .then((value) => {
                    this.modalConfirm = value;
                    if (this.modalConfirm) {
                        this.$emit("deleteTask");
                        this.modalConfirm = null;
                    }
                })
                .catch((err) => {
                    this.error = err.message;
                });
        },

        async assignTask() {
            this.assignConfirm = null;
            this.selectedMember = this.team.members[0].email;
            const h = this.$createElement;

            let members = [];
            this.team.members.forEach((member) => {
                members.push({
                    text: member.name,
                    value: member.email,
                });
            });
            members.push({
                text: "None",
                value: "unassigned",
            });

            const title = h("h2", { domProps: { innerHTML: "Assign task" } });
            const content = h("b-form", { ref: "assignForm" }, [
                h("p", "Please select one of the members of your team:"),
                h("b-form-radio-group", {
                    props: {
                        autofocus: true,
                        options: members,
                        stacked: true,
                    },
                    model: {
                        value: this.selectedMember,
                        callback: (value) => {
                            this.selectedMember = value;
                        },
                    },
                }),
            ]);

            await this.$bvModal
                .msgBoxConfirm([content], {
                    title: [title],
                    centered: true,
                    lazy: true,
                })
                .then((value) => {
                    this.assignConfirm = value;
                });

            if (this.assignConfirm) {
                if (this.selectedMember === "unassigned") {
                    this.task.assigned_to = "";
                } else {
                    const user = await userCollection
                        .where("email", "==", this.selectedMember)
                        .get();

                    if (!user.empty) {
                        user.forEach((u) => {
                            this.task.assigned_to = u.id;
                        });
                    }
                }

                this.nameMember();
                this.debounceUpdated();
            }

            this.selectedMember = "";
        },
        async nameMember() {
            try {
                const member = await userCollection
                    .doc(this.task.assigned_to)
                    .get();
                this.nameMemberAssigned = member.data().name;
            } catch (err) {
                this.nameMemberAssigned = "";
            }
        },
    },
    computed: {
        createdDateFormatted() {
            const tokens = this.task.created_date.split("-");
            let date = new Date(tokens[0], tokens[1], tokens[2]);
            let year = new Intl.DateTimeFormat("en", {
                year: "numeric",
            }).format(date);
            let month = new Intl.DateTimeFormat("en", {
                month: "short",
            }).format(date);
            let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                date
            );

            return `${month} ${day}, ${year}`;
        },
        minDateCalendar() {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        },
    },
};
</script>

<style scoped>
.badge {
    font-size: 1em;
}

.completed {
    background-color: #e9ecef;
    text-decoration: line-through;
}

.incompleted {
    background-color: #fff;
}
</style>
