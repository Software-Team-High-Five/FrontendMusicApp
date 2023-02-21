<template>
    <div>
        <br>
        <h2> &nbsp; {{ this.performance.event.name}} ({{ this.performance.event.date }})</h2>
        <br>
        <v-col class="col-md-15">
            <v-row>
                
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