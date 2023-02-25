<template>
    <div>
        <h1 class="mt-15 ml-16 text-blue" style="color:#03003f">Students</h1>
        <br>
        <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center">
            <v-row>
                <v-col>Student ID</v-col>
                <v-col>First Name</v-col>
                <v-col>Last Name</v-col>
            </v-row>
        </v-card>
        <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center">
            <v-row
                v-for="u in users"
                :key="u.id"
            >
                <v-col>{{ u.id }}</v-col>
                <v-col>{{ u.fName }}</v-col>
                <v-col>{{ u.lName }}</v-col>
                
            </v-row>
        </v-card>
    </div>
</template>
<script>
import userDS from '../services/UserDataService'
//import studentDS from '../services/StudentDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default{
    name: 'student-s',
    computed: {
        ...mapStores(useUserStore),
    },
    data(){
        return{
            users: [],
            user: {}
        } 
    },
    mounted(){
        userDS.getAll()
        .then(res =>{
            res.data.filter(u => u.role == 'student').forEach(u => this.users.push(u))
            console.log(this.users)
        })
        .catch(e => console.log(e))
    }
}
</script>