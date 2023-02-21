<template>
    <div>
        <h1 class="mt-15 ml-16 text-blue" style="color:#03003f">Students</h1>
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
    </div>
</template>
<script>
import studentDS from '../services/StudentDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default{
    name: 'student-s',
    computed: {
        ...mapStores(useUserStore),
    },
    data(){
        return{
            students: [],
            student: {}
        } 
    },
    mounted(){
        studentDS.getAll()
        .then(res =>{
            res.data.forEach(s => this.students.push(s))
            console.log(this.students)
        })
        .catch(e => console.log(e))
    }
}
</script>