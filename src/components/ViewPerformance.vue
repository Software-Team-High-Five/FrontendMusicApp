<template>
    <div class="pl-10">
        <br>
        <h2>{{ performance.event.name}} ({{ performance.event.date }})</h2>
        <p>{{ performance.event.type }}  -  {{ performance.instrument.instrument }}</p>
        <br>
            <h3>Songs</h3>
            <v-row class="px-3">
                <v-col><strong>Title</strong></v-col>
                <v-col><strong>Composer</strong></v-col>
                <v-col><strong>Translation</strong></v-col>
            </v-row>
            <v-row class="px-3" 
                v-for="song in performance.songs" 
                :key="song.id">
                <v-col>{{ song.title }}</v-col>
                <v-col>{{ song.composer.fName }} {{ song.composer.mName }} {{ song.composer.lName }}</v-col>
                <v-col>{{ song.translation || 'No Traslation Available' }}</v-col>
            </v-row>
            <br><br>

            <h3>Feedback</h3>
            <v-col 
                v-for="feedback in performance.feedbacks"
                :key="feedback.id">
                <v-row class="w-100"><strong>{{ feedback.judge.fName }} {{ feedback.judge.lName }}</strong></v-row>
                <v-row class="w-100 pt-4" ><v-text-area readonly v-model="feedback.notes">feedback notes go here</v-text-area></v-row>
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
<!-- <style>
div {  
  border: 2px solid blue;  
}  
</style> -->