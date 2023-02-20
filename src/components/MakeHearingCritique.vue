<!-- This is the Events page sample code-->
<template>
    <div>
        <br><br><br>
        <h3 style="text-align: left">
            My Performances
        </h3>
        <br>
        <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center">
            <v-row
                v-for="p in filteredPerformances"
                :key="p.id"
                @click="performanceDetails(p)"
            >
                <v-col>{{ p.event.type }}</v-col>
                <v-col>{{ p.event.date }}</v-col>
                <v-col>{{ p.accompanist }}</v-col>
            </v-row>
        </v-card>

        <Modal v-model="viewDetails" title="Performance">
            <div class="form-group justify-content-evenly"><br>
                <v-row
                    v-for="f in performance.feedbacks"
                    :key="f.id"
                >
                    <textarea v-model="f.notes"></textarea>
                </v-row>
            </div>
        </Modal>
    </div>
</template>

<script>
import pds from '../services/PerformanceDataService';
import VueModal from '@kouts/vue-modal';
import '@kouts/vue-modal/dist/vue-modal.css'; 

export default {
    name: 'event-s'
    ,components: {
        'Modal' : VueModal
    }
    ,data() {
        return {
            performances: []
            ,performance: {}
            ,viewDetails: false
        }
    }
    ,methods: {
        performanceDetails(p) {
            this.performance = p;
            this.viewDetails = true;
            console.log(this.performance.feedbacks[0].notes);
        }
    }
    ,computed: {
        filteredPerformances() {
            return this.performances;
        }
    }
    ,mounted() {
        pds.getAllForStudent(1)
            .then(res => {
                res.data.forEach(p => this.performances.push(p));
                console.log(this.performances);
            })
            .catch(e => console.log(e))
    }
}
</script>