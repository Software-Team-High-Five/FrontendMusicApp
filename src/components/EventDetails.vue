<template>
    <div>
        <link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.6/dist/vue-multiselect.min.css">
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
            <label>Select composers</label>
            <MultiSelect 
                v-model="activeComposers" 
                :options="composers" 
                :multiple="true" 
                :close-on-select="true" 
                :clear-on-select="false" 
                :preserve-search="true" 
                placeholder="Pick one or more">
                <template 
                    slot="selection" 
                    slot-scope="{ composers,  isOpen }"
                ><span class="multiselect__single" v-if="composers" v-show="!isOpen">{{ activeComposers }}</span></template>
            </MultiSelect>
            <br>
            <label>Select instruments</label>
            <MultiSelect 
                v-model="activeInstruments" 
                :options="instruments" 
                :multiple="true" 
                :close-on-select="true" 
                :clear-on-select="false" 
                :preserve-search="true" 
                placeholder="Pick one or more">
                <template 
                    slot="selection" 
                    slot-scope="{ instruments,  isOpen }"
                ><span class="multiselect__single" v-if="instruments" v-show="!isOpen">{{ activeInstruments }}</span></template>
            </MultiSelect>
            <br>
            <label>Select accompanists</label>
            <MultiSelect 
                v-model="activeAccompanists" 
                :options="accompanists" 
                :multiple="true" 
                :close-on-select="true" 
                :clear-on-select="false" 
                :preserve-search="true" 
                placeholder="Pick one or more">
                <template 
                    slot="selection" 
                    slot-scope="{ accompanists,  isOpen }"
                ><span class="multiselect__single" v-if="accompanists" v-show="!isOpen">{{ activeAccompanists }}</span></template>
            </MultiSelect>
            <br>
            <v-row>
                <v-col>
                    <button class="btn btn-danger" style="width: 100%" @click="clearFilters()">Cancel</button>
                </v-col>
                <v-col>
                    <button class="btn btn-dark" style="width: 100%" @click="showFilters = fasle">Apply</button>
                </v-col>
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
import MultiSelect from 'vue-multiselect'


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
            ,accompanists: []
            ,composers: []
            ,instruments: []
            ,activeComposers: []
            ,activeInstruments: []
            ,activeAccompanists: []
        }
    }
    ,components: {
        'Modal': VueModal
        ,MultiSelect
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
            var a = new Set()
            this.event.performances.forEach(p => {a.add(p.accompanist)});
            this.accompanists = Array.from(a);
            var c = new Set();
            this.event.performances.forEach(p => p.songs.forEach(s => c.add(s.composer.fName + ' ' + s.composer.lName)));
            this.composers = Array.from(c);
            var i = new Set();
            this.event.performances.forEach(p => i.add(p.instrument.instrument));
            this.instruments = Array.from(i);
        }
        ,clearFilters() {
            this.activeAccompanists = [];
            this.activeInstruments = [];
            this.activeComposers = [];
            this.showFilters = false;
        }
   
    }
    ,mounted() {
        this.getEventDetails();
    }
}
</script>