<template>
    <v-container class="body-1" v-if="loaded">
        <!-- Name -->
        <v-row>
            <v-col class="text-left py-0" cols="4">
                <strong>Name</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                {{ student.name }}
            </v-col>
        </v-row>
        <!-- Email -->
        <v-row>
            <v-col class="text-left py-0" cols="4">
                <strong>Email</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                {{ student.email }}
            </v-col>
        </v-row>
        <v-row><v-col></v-col></v-row>
        <!-- Major -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Major</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="student.major"
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
        <!-- Classification -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Classification</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="student.classification"
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
        <!-- Semester -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Semester</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="student.semester"
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
        <!-- Level -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Level</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="student.level"
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
        <!-- Instructor -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Instructor</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-select
                    v-model="student.instructorId"
                    :items="allInstructors"
                    item-text="name"
                    item-value="id"
                    dense
                ></v-select>
            </v-col>
        </v-row>
        <!-- Instruments -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Instruments</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-select
                    v-model="student.instrumentIds"
                    :items="allInstruments"
                    item-text="instrument"
                    item-value="id"
                    multiple
                    dense
                ></v-select>
            </v-col>
        </v-row>
        <v-row class="mx-12">
            <v-btn @click="Save">
                Save Changes
            </v-btn>
        </v-row>
    </v-container>
</template>
<script>
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';
import userDS from '@/services/UserDataService';
import instrumentDS from '@/services/InstrumentDataService';
import studentDS from '@/services/StudentDataService';

export default {
    name: 'student-edit'
    ,data() {
        return {
            student: {}
            ,allInstructors: []
            ,allInstruments: []

            ,loaded: false
        };
    }
    ,computed: {
        ...mapStores(useUserStore)
    }
    ,methods: {
        async Save() {
            // Update general student data
            await studentDS.update(this.student.id,
                {
                    major: this.student.major
                    ,classification: this.student.classification
                    ,semester: this.student.semester
                    ,level: this.student.level
                    ,instructorId: this.student.instructorId
                })
                .then(() => {
                    console.log('Student updated');
                })
                .catch(e => {
                    console.log(e);
                });
            // Remove instruments that the student no longer plays
            let instToRemove = this.student.prevInstruments.filter(i => !this.student.instrumentIds.includes(i));
            for (const inst of instToRemove) {
                await userDS.removeInstrument(this.student.id, inst)
                    .then(() => {
                        console.log(`${this.allInstruments.find(i => i.id == inst).instrument} removed from ${this.student.name}`);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
            // Add instruments that the student now plays
            let instToAdd = this.student.instrumentIds.filter(i => !this.student.prevInstruments.includes(i));
            for (const inst of instToAdd) {
                await userDS.addInstrument(this.student.id, inst)
                    .then(() => {
                        console.log(`${this.allInstruments.find(i => i.id == inst).instrument} added to ${this.student.name}`);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
            // Refresh the cached list of instruments
            this.student.prevInstruments = this.student.instrumentIds;

            if(this.userStore.isFaculty || this.userStore.isAdmin) await this.$router.push({name: 'user-list'})
        }
    }
    ,async mounted() {
        // Get the student's data
        let studentPromise = userDS.get(this.$route.params.id)
            .then(res => {
                this.student = {
                    id: res.data.id
                    ,name: `${res.data.fName} ${res.data.lName}`
                    ,email: res.data.email
                    ,major: res.data.student.major
                    ,classification: res.data.student.classification
                    ,semester: res.data.student.semester
                    ,level: res.data.student.level
                    ,instructorId: res.data.student.instructorId
                    ,instrumentIds: res.data.instruments.map(i => i.id)
                };
                this.student.prevInstruments = this.student.instrumentIds;
                console.log(this.student)
            })
            .catch(e => {
                console.log(e);
            });
        // Get all instructors data
        let instructorsPromise = userDS.getAll()
            .then(res => {
                this.allInstructors = res.data.filter(u => u.roles.find(r => r.role == 'faculty'))
                    .map(u => { return { id: u.id, name: `${u.fName} ${u.lName}` } });
            })
            .catch(e => {
                console.log(e);
            });
        // Get all instrument data
        let instrumentsPromise = instrumentDS.getAll()
            .then(res => {
                this.allInstruments = res.data;
            })
            .catch(e => {
                console.log(e);
            });
        // Wait for data; then mark page as loaded
        await studentPromise;
        await instructorsPromise;
        await instrumentsPromise;
        this.loaded = true;
    }
}
</script>