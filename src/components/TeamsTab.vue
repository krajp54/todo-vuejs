<template>
    <b-tab title="Teams" active>
        <b-jumbotron bg-variant="light" class="pt-4 pb-4">
            <template #header>Team Dashboard</template>

            <template #lead
                >Here you can see all the tasks of the teams you belong
                to</template
            >

            <b-container fluid v-if="!isTeamsEmpty">
                <b-form-group
                    label="Select one of your teams:"
                    label-for="select-team"
                    label-cols="4"
                >
                    <b-form-select v-model="actualTeam">
                        <b-form-select-option
                            id="select-team"
                            v-for="team in userTeams"
                            :key="team.id"
                            :value="team.id"
                            >{{ team.name }}</b-form-select-option
                        >
                    </b-form-select>
                </b-form-group>
                <b-container fluid class="d-flex justify-content-center">
                    <b-row>
                        <b-col>
                            <b-button
                                class="mb-2"
                                pill
                                variant="primary"
                                v-b-modal="'new-team'"
                                >New Team</b-button
                            >
                        </b-col>
                        <b-col>
                            <b-button
                                class="mb-2"
                                pill
                                variant="info"
                                v-b-modal="'join-team'"
                                >Join Team</b-button
                            >
                        </b-col>
                        <b-col>
                            <b-button
                                class="mb-2"
                                pill
                                variant="dark"
                                @click="teamInfo"
                                >Team Info</b-button
                            >
                        </b-col>
                        <b-col>
                            <b-button
                                class="mb-2"
                                pill
                                variant="success"
                                @click="teamMembers"
                                >Team Members</b-button
                            >
                        </b-col>
                        <b-col v-if="isTeamLeader">
                            <b-button
                                class="mb-2"
                                pill
                                variant="danger"
                                @click="deleteTeam"
                                >Delete team</b-button
                            >
                        </b-col>
                    </b-row>
                </b-container>
            </b-container>

            <b-img
                v-if="isTasksEmpty"
                center
                fluid
                :src="require(`@/assets/collaboration.svg`)"
                alt="Teams"
                class="pb-4"
            ></b-img>

            <b-container fluid v-else class="pb-2">
                <TeamTask
                    v-for="task in teamTasks"
                    v-bind:key="task.id"
                    v-bind:task="task"
                    v-bind:team="actualTeamInfo"
                    @deleteTask="deleteTask(task)"
                >
                </TeamTask>
            </b-container>

            <b-alert show variant="dark" v-if="isTeamsEmpty"
                >Looks like you don't belong to any team, you can
                <b-link v-b-modal="'new-team'">create</b-link> one or
                <b-link v-b-modal="'join-team'">join</b-link> an existing
                one.</b-alert
            >

            <b-container fluid v-else>
                <b-form ref="newTask" @submit.prevent="addTask">
                    <b-form-group
                        label="Enter a new task:"
                        label-for="new-team-task"
                        invalid-feedback="You need to add some text"
                    >
                        <b-form-input
                            type="text"
                            id="new-team-task"
                            v-model="newTask"
                            :state="taskValidation"
                            required
                        ></b-form-input>
                    </b-form-group>
                </b-form>
                <b-alert show v-if="taskError" variant="danger">{{
                    taskError
                }}</b-alert>
            </b-container>

            <b-modal
                id="new-team"
                title="Create a new team"
                @show="resetCreateModal"
                @hidden="resetCreateModal"
                @ok="confirmCreateModal"
            >
                <b-form ref="newForm" @submit.prevent="createTeam">
                    <b-form-group
                        label="Enter the name for the new team:"
                        label-for="team-name"
                        invalid-feedback="Team Name is required"
                    >
                        <b-form-input
                            id="team-name"
                            v-model="newTeam.name"
                            :state="formState"
                            required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        label="Enter the description for the new team:"
                        label-for="team-description"
                        invalid-feedback="Team Description is required"
                    >
                        <b-form-input
                            id="team-description"
                            v-model="newTeam.description"
                            :state="formState"
                            required
                        ></b-form-input>
                    </b-form-group>
                </b-form>
                <b-alert show v-if="modalError" variant="danger">{{
                    modalError
                }}</b-alert>
            </b-modal>

            <b-modal
                id="join-team"
                title="Join a Team"
                @show="resetJoinModal"
                @hidden="resetJoinModal"
                @ok="confirmJoinModal"
            >
                <b-form ref="joinForm" @submit.prevent="joinTeam">
                    <b-form-group
                        label="Enter the team code:"
                        label-for="team-code"
                        invalid-feedback="Team Code is required"
                    >
                        <b-form-input
                            id="team-code"
                            v-model="newTeam.code"
                            :state="formState"
                            required
                        ></b-form-input>
                    </b-form-group>
                </b-form>
                <b-alert show v-if="modalError" variant="danger">{{
                    modalError
                }}</b-alert>
            </b-modal>
        </b-jumbotron>
    </b-tab>
</template>

<script>
import { mapGetters } from "vuex";
import {
    firebase,
    userCollection,
    teamCollection,
    taskCollection,
} from "@/firebase";
import TeamTask from "@/components/TeamTask";

export default {
    name: "TeamsTab",
    components: {
        TeamTask,
    },
    data() {
        return {
            newTeam: {
                name: "",
                code: "",
                description: "",
            },
            formState: null,
            userTeams: [],
            teamTasks: [],
            newTask: null,
            actualTeam: "",
            modalError: null,
            deleteConfirm: null,
            taskError: null,
        };
    },
    mounted() {
        this.$bind(
            "userTeams",
            teamCollection
                .where(
                    "members",
                    "array-contains",
                    userCollection.doc(this.userProfile.id)
                )
                .orderBy("name")
        )
            .then((teams) => {
                if (teams.length != 0) this.actualTeam = teams[0].id;
            })
            .catch((err) => {
                console.log(err.message);
            });
    },
    watch: {
        actualTeam: {
            inmediate: true,
            handler(actualTeam) {
                this.$bind(
                    "teamTasks",
                    taskCollection
                        .where("owner_id", "==", actualTeam)
                        .orderBy("created_date")
                );
            },
        },
    },
    methods: {
        checkCreateForm() {
            const valid = this.$refs.newForm.checkValidity();
            this.formState = valid;
            return valid;
        },
        resetCreateModal() {
            this.newTeam.name = "";
            this.newTeam.description = "";
            this.formState = null;
            this.modalError = null;
        },
        confirmCreateModal(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.createTeam();
        },
        createTeam() {
            if (!this.checkCreateForm()) return;

            try {
                teamCollection
                    .add({
                        name: this.newTeam.name,
                        token: this.createRandomToken(),
                        leader_id: userCollection.doc(this.userProfile.id),
                        description: this.newTeam.description,
                        created_date: this.currentDate,
                        members: [userCollection.doc(this.userProfile.id)],
                    })
                    .then((team) => {
                        this.actualTeam = team.id;
                        this.$nextTick(() => {
                            this.$bvModal.hide("new-team");
                        });
                    });
            } catch (err) {
                this.modalError = err.message;
            }
        },
        createRandomToken() {
            return Math.random().toString(36).slice(6);
        },

        checkJoinForm() {
            const valid = this.$refs.joinForm.checkValidity();
            this.formState = valid;
            return valid;
        },
        resetJoinModal() {
            this.newTeam.code = "";
            this.formState = null;
            this.modalError = null;
        },
        async confirmJoinModal(bvModalEvt) {
            bvModalEvt.preventDefault();
            await this.joinTeam();
        },
        async joinTeam() {
            if (!this.checkJoinForm()) return;

            try {
                await teamCollection
                    .where("token", "==", this.newTeam.code)
                    .get()
                    .then((team) => {
                        if (team.size == 0 || team >= 2) {
                            this.modalError = "The team doesn't exists";
                            this.formState = false;
                        } else {
                            team.forEach((doc) => {
                                teamCollection.doc(doc.id).update({
                                    members:
                                        firebase.firestore.FieldValue.arrayUnion(
                                            userCollection.doc(
                                                this.userProfile.id
                                            )
                                        ),
                                });

                                this.actualTeam = doc.id;
                            });

                            this.$nextTick(() => {
                                this.$bvModal.hide("join-team");
                            });
                        }
                    });
            } catch (err) {
                this.modalError = err.message;
            }
        },

        teamInfo() {
            const h = this.$createElement;
            const title = h("h2", { domProps: { innerHTML: "Team Info" } });
            const message = h("div", [
                h("p", [h("strong", "Name: "), this.actualTeamInfo.name]),
                h("p", [
                    h("strong", "Leader: "),
                    this.actualTeamInfo.leader_id.name,
                ]),
                h("p", [
                    h("strong", "Description: "),
                    this.actualTeamInfo.description,
                ]),
                h("p", [h("strong", "Code: "), this.actualTeamInfo.token]),
                h("p", [
                    h("strong", "Creation date: "),
                    this.customFormatDate(this.actualTeamInfo.created_date),
                ]),
            ]);

            this.$bvModal.msgBoxOk([message], {
                title: [title],
                centered: true,
            });
        },

        teamMembers() {
            const h = this.$createElement;

            let members = [];
            this.actualTeamInfo.members.forEach((member) => {
                if (this.actualTeamInfo.leader_id.name === member.name)
                    members.push([
                        h("li", [
                            h("p", [
                                member.name + " ",
                                h("b-badge", " Leader"),
                            ]),
                        ]),
                    ]);
                else members.push(h("li", member.name));
            });

            const title = h("h2", { domProps: { innerHTML: "Team Members" } });
            const message = h("ul", members);

            this.$bvModal.msgBoxOk([message], {
                title: [title],
                centered: true,
            });
        },

        async deleteTeam() {
            this.deleteConfirm = null;
            await this.$bvModal
                .msgBoxConfirm(
                    "Please confirm that you want to delete this team with all its tasks",
                    {
                        title: "Delete team",
                        size: "md",
                        buttonSize: "md",
                        okVariant: "danger",
                        okTitle: "YES",
                        cancelTitle: "No",
                        hideHeaderClose: true,
                        centered: true,
                    }
                )
                .then((value) => {
                    this.deleteConfirm = value;
                });

            if (this.deleteConfirm) {
                try {
                    const tasks = await taskCollection
                        .where("owner_id", "==", this.actualTeam)
                        .get();

                    if (!tasks.empty) {
                        tasks.forEach((task) => {
                            taskCollection.doc(task.id).delete();
                        });
                    }

                    teamCollection.doc(this.actualTeam).delete();
                } catch (err) {
                    alert(err.message);
                }
            }
        },

        async addTask() {
            try {
                taskCollection.add({
                    owner_id: this.actualTeam,
                    content: this.newTask,
                    created_date: this.currentDate,
                    due_date: "",
                    tag: this.actualTeamInfo.name,
                    assigned_to: "",
                    completed: false,
                });

                this.$refs.newTask.reset();
                this.newTask = null;
            } catch (err) {
                this.taskError = err.message;
            }
        },
        async deleteTask(task) {
            try {
                taskCollection.doc(task.id).delete();
            } catch (err) {
                this.taskError = err.message;
            }
        },

        customFormatDate(date) {
            const tokens = date.split("-");
            let formatDate = new Date(tokens[0], tokens[1], tokens[2]);
            let year = new Intl.DateTimeFormat("en", {
                year: "numeric",
            }).format(formatDate);
            let month = new Intl.DateTimeFormat("en", {
                month: "short",
            }).format(formatDate);
            let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                formatDate
            );

            return `${month} ${day}, ${year}`;
        },
    },
    computed: {
        ...mapGetters("user", {
            userProfile: "userProfile",
        }),
        isTasksEmpty() {
            return this.teamTasks.length === 0;
        },
        isTeamsEmpty() {
            return this.userTeams.length === 0;
        },
        isTeamLeader() {
            if (this.actualTeamInfo === null) return false;

            try {
                return (
                    this.actualTeamInfo.leader_id.email ===
                    this.userProfile.email
                );
            } catch (err) {
                return false;
            }
        },
        actualTeamInfo() {
            if (this.userTeams.length == 0) return null;

            let teamIndex = this.userTeams.findIndex((team) => {
                if (team.id === this.actualTeam) return true;
            });

            return this.userTeams[teamIndex];
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
        taskValidation() {
            if (this.newTask === null) return null;
            return !(this.newTask === "");
        },
    },
};
</script>

<style scoped>
h1 {
    font-size: 2.5rem;
}

img {
    width: 50%;
    height: auto;
}

.lead {
    font-size: 1rem;
}
</style>
