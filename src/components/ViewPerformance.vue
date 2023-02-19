<template>
    <div>
        <br><br><br>
        <h3 style="text-align: left">
            &nbsp; {{ this.performance.event.type }} ({{ this.performance.event.date }})
        </h3>
        <br>
    </div>
</template>

<script>
import pds from '../services/PerformanceDataService';

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
    ,computed: { }
    ,mounted() {
        this.getPerformacnce();
    }
}
</script>