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
                    <v-col>
                        {{ e.date }}
                    </v-col>
                    <v-col>
                        {{ e.type }}
                    </v-col>
                    <v-col>
                        {{ e.startTime }} - {{ e.endTime }}
                    </v-col>
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
                    <v-col>
                        {{ e.date }}
                    </v-col>
                    <v-col>
                        {{ e.type }}
                    </v-col>
                    <v-col>
                        {{ e.startTime }} - {{ e.endTime }}
                    </v-col>
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
                    <v-col>
                        {{ e.date }}
                    </v-col>
                    <v-col>
                        {{ e.type }}
                    </v-col>
                    <v-col>
                        {{ e.startTime }} - {{ e.endTime }}
                    </v-col>
                </v-row>
            </v-col>
            <v-col ></v-col>
        </v-card>
    </div>
</template>

<script>

import eds from '../services/EventDataService';
import pds from '../services/PerformanceDataService';

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
        }

    }
    ,methods: {
        fetch() {
            eds.getAll()
                .then(res => {
                    res.data.forEach(e => {
                        this.events.push(e);
                    });
                    console.log('events fetched successfully');
                })
                .catch(e => console.log(e));
            if(this.user.role == 'student'){
                pds.getAllForStudent(this.user.id)
                .then(res => {
                    res.data.forEach(p => {
                        this.userPerformances.push(p);
                    })
                })
                .catch(e => console.log(e));
            } else {
                pds.getAllForInstructor(this.user.id)
                .then(res => {
                    res.data.forEach(p => {
                        this.userPerformances.push(p);
                    })
                })
                .catch(e => console.log(e));
            }

        }
        ,signUp(eid) {
            this.$router.push({name: 'sign-up', params: {eventId: eid}});
        }
        ,editSignup(eid){
            console.log('this is where the events will be edited from. eventId: ', eid);
        }
        ,viewPerformance(eid){
            const viewPerformance = this.userPerformances.find(p => p.eventId == eid);
            this.$router.push({ name: 'view-performance', params: {performanceId: viewPerformance.id}});
        }
    }
    ,computed:{
        myPastEvents() {
            return this.events.filter(e => e.date < this.today);
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