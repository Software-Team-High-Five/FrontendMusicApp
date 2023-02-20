<template>
    <div>
        <br>
        <h2> &nbsp; {{ event.name }} ({{ event.date }})</h2>
        <br>
        <v-row>
            <v-col class="col-md-3 sticky-top">
                <h3>Performances</h3>
            </v-col>
            <v-col class="col-md-7 sticky-top" style="margin: 10px; padding: 10px;">
                <div class="input-group mb-3">
                    <input 
                        type="text"
                        class="form-control"
                        placeholder="Search by name, song, etc"
                        v-model="searchString" />
                    <button
                        class="btn btn-dark"
                        @click="searchString = ''"
                        style="margin-right: 10px; border-radius: 4px;"
                    >Clear Search</button>
                </div>
            </v-col>
            <v-col class="md-2 sticky top" style="margin: 10px; padding: 10px;  border-radius: 4px; width: 100%">
                <button class="btn btn-dark btn-outline" @click="showFilters=!showFilters">Filter</button>
            </v-col>
        </v-row>
        <br>
        <div class="col-md-15" style="border-radius: 5px; padding: 10px; margin: 10px;">
            <div class="card">
                <table class="table">
                    <thead class="" style="background-color: #f2f3f4;">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Songs</th>
                            <th scope="col">Instrument</th>
                            <th scope="col">Accompanist</th>
                            <th scope="col">Time</th>
                            <th scope="col">Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-group-item" v-for="p in filteredPerformances" :key="p.id" @click="performanceDetails(p)">
                            <td>{{ p.student.user.fName }} {{ p.student.user.lName }}</td>
                            <td>{{ songsString(p) }}</td>
                            <td>{{ p.instrument.instrument }}</td>
                            <td>{{ p.accompanist }}</td>
                            <td>{{ p.startTime }} - {{ p.endTime }}</td>
                            <td>{{ p.student.level }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <Modal v-model="showPerformanceDetails" title="Performance" v-show="performance">
            <v-row>
                <v-col>{{ user.fName }} {{ user.lName }}</v-col>
                <v-col>{{ instrument.instrument }}</v-col>
                <v-col>{{ event.date }}</v-col>
            </v-row>
            <br>
            SONGS
            <v-row
                v-for="song in songs"
                :key="song.id">
                <v-col>{{ song.title }}</v-col>
                <v-col>{{ song.translation || 'no transaltion available' }}</v-col>
                <v-col>{{ song.composer.fName }} {{ song.composer.lName }}</v-col>
            </v-row>
            <br>
            FEEDBACK
            <v-row
                v-for="feedback in performance.feedbacks"
                :key="feedback.id">
                <v-col>Judge: {{ feedback.judge.fName }} {{  feedback.judge.lName }}</v-col>
                <v-col>Notes: {{ feedback.notes }}</v-col>
            </v-row>
            <br>
        </Modal>
        <Modal title="Filters" v-model="showFilters">
            <v-select
                    label="Select a composer"
                    :items="composers"
                    v-model="activeComposer"
                ></v-select>
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
            ,student: {}
            ,user: {}
            ,instrument: {}
            ,songs: {}
            ,searchString: ''
            ,showFilters: false
            ,accompanists: new Set()
            ,composers: new Set()
            ,instruments: new Set()
            ,activeComposer: []
        }
    }
    ,components: {
        'Modal': VueModal
    }
    ,computed: { 
        ...mapStores(useUserStore)
        ,filteredPerformances() {
            if( this.searchString == ''){
                return this.event.performances
            } else {
                const ss = this.searchString.toLowerCase();
                return this.event.performances.filter(p => (
                    p.student.user.fName.toLowerCase().indexOf(ss) > -1 ||
                    p.student.user.lName.toLowerCase().indexOf(ss) > -1 ||
                    p.accompanist.toLowerCase().indexOf(ss) > -1 || 
                    this.songsString(p).toLowerCase().indexOf(ss) > -1

                ))
            }
        } 
    }
    ,methods: { 
        async getEventDetails() {
            await eds.get(this.$route.params.eventId)
                .then(res => {
                    this.event = {...res.data};
                    console.log(this.event)
                    this.event.performances.forEach(p => this.students.push(p.student));
                    this.setFilters();
                })
                .catch(e => console.log(e));
        }
        ,performanceDetails(p){
            this.performance = p;
            this.student = p.student;
            this.user = p.student.user;
            this.songs = p.songs;
            this.instrument = p.instrument;
            this.showPerformanceDetails = true;
        }   
        ,songsString(performance){
            var songs = ''
                if(performance.songs.length > 1 ){
                    performance.songs.forEach(s => {
                    songs += s.title + ', '
                });
                return songs;
            } else if(performance.songs.length == 1) {
                return performance.songs[0].title;
            } else {
                return 'No Songs'
            }
        }   
        ,setFilters() {
            this.event.performances.forEach(p => {this.accompanists.add(p.accompanist)});
            this.event.performances.forEach(p => p.songs.forEach(s => this.composers.add(s.composer.fName + ' ' + s.composer.lName)));
            this.event.performances.forEach(p => this.instruments.add(p.instrument.instrument));
        }
   
    }
    ,mounted() {
        this.getEventDetails();
    }
}
</script>