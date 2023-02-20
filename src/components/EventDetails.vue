<template>
    <div>
        <br>
        <h2> &nbsp; {{ event.name }} ({{ event.date }})</h2>
        <br>
        <v-card>
            <v-col></v-col>
            <v-col>
                <v-row>
                    <h3>Performances</h3>
                </v-row>
                <br>
                <v-row>
                    <v-col>Name </v-col>
                    <v-col>Songs </v-col>
                    <v-col>Instrument</v-col>
                    <v-col>Accompanist</v-col>
                    <v-col>Time</v-col>
                </v-row>
                <v-row
                    v-for="p in filteredPerformances"
                    :key="p.id"
                    @click="performanceDetails(p)"
                >
                    <v-col>{{ p.student.user.fName }} {{ p.student.user.lName }}</v-col>
                    <v-col>{{ songsString(p) }}</v-col>
                    <v-col>{{ p.instrument.instrument }}</v-col>
                    <v-col>{{ p.accompanist }}</v-col>
                    <v-col>{{ p.startTime }} - {{ p.endTime }}</v-col>
                </v-row>
            </v-col>
        </v-card>
        <Modal v-model="showPerformanceDetails" title="Performance">
            <v-row>
                {{ performance.student.user.fName }} {{ performance.student.user.lName }}
            </v-row>
        </Modal>
    </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';
import eds from '../services/EventDataService';
import VueModal from '@kouts/vue-modal';
import '@kouts/vue-modal/dist/vue-modal.css'; 

export default {
    name: 'event-details'
    ,data() {
        return {
            event: {}
            ,students: []
            ,showPerformanceDetails: false
            ,performance: {}
        }
    }
    ,components: {
        'Modal': VueModal
    }
    ,computed: { 
        ...mapStores(useUserStore)
        ,filteredPerformances() {
            return this.event.performances
        }

        
    }
    ,methods: { 
        async getEventDetails() {
            await eds.get(this.$route.params.eventId)
                .then(res => {
                    this.event = {...res.data};
                    console.log(this.event)
                    this.event.performances.forEach(p => this.students.push(p.student));
                    console.log('students', this.students);
                })
                .catch(e => console.log(e));
        }
        ,performanceDetails(p){
            this.showPerformanceDetails = true;
            console.log(p);
            this.performance = {...p}
        }   
        ,songsString(performance){
            var songs = ''
            performance.songs.forEach(s => {
                songs += s.title + ', '
            });
            return songs;
        }        
    }
    ,mounted() {
        console.log('in event details')
        this.getEventDetails();
    }
}
</script>