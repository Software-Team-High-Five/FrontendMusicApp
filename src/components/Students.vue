<template>
    <div>
        <h1 class="mt-15 ml-16 text-blue" style="color:#03003f" v-show="userStore.isFaculty">Students</h1>
        <h1 class="mt-15 ml-16 text-blue" style="color:#03003f" v-show="userStore.isAdmin">Users</h1>
        <br>

        <div v-show="userStore.isAdmin">
            <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center" >
            <v-row>
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
                <v-col>{{ u.fName }}</v-col>
                <v-col>{{ u.lName }}</v-col>
                <v-col>{{ u.roles.role }}</v-col>
                
            </v-row>
        </v-card>
        </div>
    
        <div v-show="userStore.isFaculty">
            <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center" >
            <v-row>
                <v-col>First Name</v-col>
                <v-col>Last Name</v-col>
                <v-col>Classification</v-col>
                <v-col></v-col>
            </v-row>
            </v-card>
            <v-card style="padding-left:30px; margin-left: 30px;" width="90%" class="center">
                <v-row
                    v-for="s in students"
                    :key="s.id"
                >
                    <v-col>{{ s.user.fName }}</v-col>
                    <v-col>{{ s.user.lName }}</v-col>
                    <v-col style="text-transform: capitalize;">{{ s.classification }}</v-col>
                    <v-col>
                        <v-btn :to="{name: 'student-edit', params: {id: s.id}}">
                            <v-icon >mdi-pencil</v-icon>
                        </v-btn>
                    </v-col>
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
            console.log(this.userStore.user.id)
            studentDS.instructorStudents(this.userStore.user.id)
            .then(res =>{
                res.data.forEach(s => this.students.push(s))
                console.log(this.students)
            })
            .catch(e => console.log(e))
        }
    }
}
</script>