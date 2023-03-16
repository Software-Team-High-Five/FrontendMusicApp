<template>
    <div>
        <h1 class="mt-15 ml-16 text-blue" style="color:#03003f">Students</h1>
        <br>

        <div v-show="userStore.isAdmin">
            <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center" >
            <v-row>
                <v-col>User ID</v-col>
                <v-col>First Name</v-col>
                <v-col>Last Name</v-col>
                <v-col>Role</v-col>
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
                <v-col>{{ u.role }}</v-col>
                
            </v-row>
        </v-card>
        </div>
    
        <div v-show="userStore.isFaculty">
            <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center" >
            <v-row>
                <v-col>Student ID</v-col>
                <v-col>First Name</v-col>
                <v-col>Last Name</v-col>
            </v-row>
            </v-card>
            <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center">
                <v-row
                    v-for="s in students"
                    :key="s.id"
                >
                    <v-col>{{ s.id }}</v-col>
                    <v-col>{{ s.user.fName }}</v-col>
                    <v-col>{{ s.user.lName }}</v-col>
                </v-row>
            </v-card>
        </div>
        
    </div>
</template>
<script>
import studentDS from '../services/StudentDataService'
import userDS from '../services/UserDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default{
    name: 'student-s',
    computed: {
        ...mapStores(useUserStore)
    },
    data(){
        return{
            students: [],
            student: {},
            users: [],
            user: {}
        } 
    },
    mounted(){
        if(this.userStore.isAdmin){
            userDS.getAll()
            .then(res =>{
                res.data.forEach(u => this.users.push(u))
                console.log(this.user)
            })
            .catch(e => console.log(e))
        }
        else{
            studentDS.getAll()
            .then(res =>{
                res.data.forEach(s => this.students.push(s))
                console.log(this.students)
            })
            .catch(e => console.log(e))
        }
        
    }
}
</script>