<template>
    <div>
        <br><br><br>
        <h3 style="text-align: left">
            {{ this.performance.event.name }} &nbsp; {{ this.performance.event.type }} ({{ this.performance.event.date }})
        </h3>
        <br>
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