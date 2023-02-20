<template>
    <div>
        <br>
        <h1>All Events</h1>
        <br>
        <v-card>
            <v-col></v-col>
            <v-col>
                <v-row>
                    <h2>Upcoming Events</h2>
                </v-row>
                <br>
                <v-row
                    v-for="e in upcomingEvents"
                    :key="e.id"
                    @click="signUp(e.id)"
                >
                    <v-col>{{ e.name }}</v-col>
                    <v-col>{{ e.date }}</v-col>
                    <v-col>{{ e.type }}</v-col>
                    <v-col>{{ e.startTime }} - {{ e.endTime }}</v-col>
                </v-row>
            </v-col>
            <v-col ></v-col>
        </v-card>
        <br>
        <v-card>
            <v-col></v-col>
            <v-col>
                <v-row>
                    <h2>Registered Events</h2>
                </v-row>
                <br>
                <v-row
                    v-for="e in registeredEvents"
                    :key="e.id"
                    @click="editSignup(e.id)"
                >
                    <v-col>{{ e.name }}</v-col>
                    <v-col>{{ e.date }}</v-col>
                    <v-col>{{ e.type }}</v-col>
                    <v-col>{{ e.startTime }} - {{ e.endTime }}</v-col>
                </v-row>
            </v-col>
            <v-col ></v-col>
        </v-card>
        <br>
        <v-card>
            <v-col></v-col>
            <v-col>
                <v-row>
                    <h2>Past Events</h2>
                </v-row>
                <br>
                <v-row
                    v-for="e in myPastEvents"
                    :key="e.id"
                    @click="viewPerformance(e.id)"
                >
                    <v-col>{{ e.name }}</v-col>
                    <v-col>{{ e.date }}</v-col>
                    <v-col>{{ e.type }}</v-col>
                    <v-col>{{ e.startTime }} - {{ e.endTime }}</v-col>
                </v-row>
            </v-col>
            <v-col ></v-col>
        </v-card>
    </div>
</template>

<script>

import eds from '../services/EventDataService';
import pds from '../services/PerformanceDataService';
import sds from '../services/StudentDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default {
    name: 'all-events'
    ,data() {
        return {
            events: []
            ,userPerformances: []
            ,today: null
            ,cond: 0
            ,user: {
                role: 'student'
                ,id: 3
            }
            ,students: []
        }

    }
    ,methods: {
        fetch() {
            eds.getAll()
                .then(res => {
                    res.data.forEach(e => {
                        this.events.push(e);
                    });
                    console.log('all events: ', this.events);
                    console.log(this.today > this.events[0].date );
                })
                .catch(e => console.log(e));
            if(this.userStore.user.student){
                pds.getAllForStudent(this.userStore.user.id)
                .then(res => {
                    res.data.forEach(p => {
                        this.userPerformances.push(p);
                    })
                })
                .catch(e => console.log(e));
            } else {
                pds.getAllForInstructor(this.userStore.user.id)
                .then(res => {
                    res.data.forEach(p => { this.userPerformances.push(p) })
                })
                .catch(e => console.log(e));
                sds.instructorStudents(this.userStore.user.id)
                    .then(res => { res.data.forEach(s => this.students.push(s)) })
                    .catch(e => console.log(e));
            }

        }
        ,signUp(eid) {
            if(this.userStore.isAdmin){
                console.log('direct admin to edit the upcoming event');
            } else {
                this.$router.push({name: 'sign-up', params: {eventId: eid}});
            }
        }
        ,editSignup(eid){
            console.log('this is where the events will be edited from. eventId: ', eid);
        }
        ,viewPerformance(eid){
            if(this.userStore.user.student){
                const viewPerformance = this.userPerformances.find(p => p.eventId == eid);
                this.$router.push({ name: 'view-performance', params: {performanceId: viewPerformance.id}});
            } else {
                this.$router.push({ name: 'event-details', params: {eventId: eid}});
            }
        }
    }
    ,computed:{
        ...mapStores(useUserStore)
        ,myPastEvents() {
            return this.events.filter(e => 
                e.date < this.today
            );
           
        }
        ,upcomingEvents() {
            return this.events.filter(e => (e.date > this.today && !(this.userPerformances.find(p => p.eventId == e.id))));
        }
        ,registeredEvents() {
            return this.events.filter(e => e.date > this.today && (this.userPerformances.find(p => p.eventId == e.id)));
        }
    }
    ,mounted() {
        this.fetch();
        this.today = new Date().toISOString().substring(0, 10);
    }
}
</script>