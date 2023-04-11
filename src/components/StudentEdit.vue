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
        <v-row v-for="(instrument, index) in studentInstruments" :key="index" v-if="!instrument.delete">
            <v-col>
                <v-row>
                    <v-col class="text-left py-0" align-self="center" cols="4">
                        <strong>Instrument: </strong>
                    </v-col>
                    <v-col class="py-0" cols="8" justify-content="center">
                        <v-select
                            v-if="instrument.isNew"
                            v-model="instrument.instrumentId"
                            :items="allInstruments"
                            item-text="instrument"
                            item-value="id"
                            dense
                        ></v-select>    
                        <p style="margin-bottom: 0px;" v-if="!instrument.isNew">{{ instrument.instrumentName }}</p>
                    </v-col>
                </v-row>
            </v-col>
            <v-col>
                <v-row>
                    <v-col class="text-left py-0" align-self="center" cols="4">
                        <strong>Instructor: </strong>
                    </v-col>
                    <v-col class="py-0" cols="8">
                        <v-select
                            v-model="instrument.instructorId"
                            :items="allInstructors"
                            item-text="name"
                            item-value="id"
                            @change="instrument.instructorUpdated = true"
                            dense
                        ></v-select>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="1">
                <v-btn icon small class="mr-2" @click="removeInstrument(instrument)"><v-icon small>mdi-delete</v-icon></v-btn>
            </v-col>
        </v-row> 
        <v-row class="mx-12">
            <v-btn @click="addNewInstrument()">Add Instrument</v-btn>
        </v-row>
        <br><br>
        <v-row class="mx-12">
            <v-btn @click="Save">
                Save Changes
            </v-btn>
        </v-row>
    </v-container>
</template>
<script>
import Vue from 'vue';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';
import userDS from '@/services/UserDataService';
import instrumentDS from '@/services/InstrumentDataService';
import studentDS from '@/services/StudentDataService';
import user_instrumentDS from '@/services/User_InstrumentDataService';

export default {
    name: 'student-edit'
    ,data() {
        return {
            student: {}
            ,allInstructors: []
            ,allInstruments: []
            ,studentInstruments: []
            ,loaded: false
            ,newInstrument: {
                instrumentId: null
                ,instrumentName: ''
                ,instructorId: null
                ,instructorName: ''
                ,isNew: true
            }
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
                })
                .then((res) => {
                    console.log('Student updated', res);
                })
                .catch(e => {
                    console.log(e);
                });
            let instructorUpdates = this.studentInstruments.filter(i => !i.isNew && i.instructorUpdated);
            for(const update of instructorUpdates) {
                await user_instrumentDS.update({
                    userId: this.student.id
                    ,instrumentId: update.instrumentId
                    ,instructorId: update.instructorId || null
                })
                    .then(res => console.log(res))
                    .catch(e => console.log(e || 'unknown error updating'))
            }
            let deleteRecords = this.studentInstruments.filter(i => i.delete);
            for(const del of deleteRecords) {
                
                await user_instrumentDS.delete(this.student.id, del.instrumentId)
                    .then(res => console.log(res))
                    .catch(e => console.log(e || 'unknow deleting'))
            }
            let newRecords = this.studentInstruments.filter(i => i.isNew);

            for(const ad of newRecords){
                console.log('creating: ', ad);
                user_instrumentDS.create({
                    userId: this.student.id
                    ,instrumentId: ad.instrumentId
                    ,instructorId: ad.instructorId || null
                })
                    .then(res => console.log(res))
                    .catch(e => console.log(e || 'unknow creating'))
            }

            // if(this.userStore.isFaculty || this.userStore.isAdmin) await this.$router.push({name: 'user-list'})
        }
        ,removeInstrument(i) {
            // Vue.delete(this.studentInstruments, i);
            i.delete = true;
            Vue.set(this.studentInstruments)
        }
        ,resetNewInstrument() {
            this.newInstrument = {
                instrumentId: null
                ,instrumentName: ''
                ,instructorId: null
                ,instructorName: ''
            }
        }
        ,addNewInstrument() {
            this.studentInstruments.push({...this.newInstrument});
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
                    ,instructorIds: res.data.user_instruments.map(i => i.instructorId)
                    ,instrumentIds: res.data.user_instruments.map(i => i.instrumentId)
                };
                res.data.user_instruments.forEach(ui => {
                    this.studentInstruments.push({
                        instrumentName: ui.instrument.instrument
                        ,instructorName: ui.instructor ? `${ui.instructor.fName} ${ui.instructor.lName}` : 'No Instructor'
                        ,instructorId: ui.instructorId ?? 0
                        ,instrumentId: ui.instrument.id
                        ,instructorUpdated: false
                    });
                })
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
                this.allInstructors.push({id: 0, name: 'No Instructor'})
            })
            .catch(e => {
                console.log(e);
            });
        // Get all instrument data
        let instrumentsPromise = instrumentDS.getAll()
            .then(res => {
                let activeInstruments = this.studentInstruments.map(i => i.instrumentId);
                console.log(activeInstruments);
                this.allInstruments = res.data.filter(i => !activeInstruments.includes(i.id))
                // this.allInstruments = res.data.filter(i => !this.student.prevInstruments.includes(i.id));
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