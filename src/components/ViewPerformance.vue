<template>
    <div>
        <br>
        <h2> &nbsp; {{ performance.event.name}} ({{ performance.event.date }})</h2>
        <p>{{ performance.event.type }}</p>
        <p>{{ performance.instrument.instrument }}</p>
        <br>
        <v-col class="col-md-15">
            <v-row>
                <h3>Songs</h3>
            </v-row>
            <v-row class="col-md-15">
                <v-col><strong>Title</strong></v-col>
                <v-col><strong>Translation</strong></v-col>
                <v-col><strong>Composer</strong></v-col>
            </v-row>
            <v-row 
                class="col-md-15" 
                v-for="song in performance.songs" 
                :key="song.id">
                <v-col>{{ song.title }}</v-col>
                <v-col>{{ song.translation || 'No Traslation Available' }}</v-col>
                <v-col>{{ song.composer.fName }} {{ song.composer.mName }} {{ song.composer.lName }}</v-col>
            </v-row>
            <br><br>
            <v-row>
                <h3>Feedback</h3>
            </v-row>
            <v-row
                v-for="feedback in performance.feedbacks"
                :key="feedback.id">
                <v-row>{{ feedback.judge.fName }} {{ feedback.judge.lName }}</v-row>
                <v-row><v-text-area readonly v-model="feedback.notes"></v-text-area></v-row>
            </v-row>
        </v-col>
    </div>
</template>

<script>
import pds from '../services/PerformanceDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default {
    name: 'view-perofrmance'
    ,components: { }
    ,data() {
        return {
            performance: {}
            ,viewDetails: false
        }
    }
    ,methods: {
        async getPerformacnce(){
            await pds.get(this.$route.params.performanceId)
                .then(res => {
                    this.performance = res.data;
                    console.log(this.performance);
                })
        }
    }
    ,computed: { ...mapStores(useUserStore) }
    ,mounted() {
        this.getPerformacnce();
    }
}
</script>