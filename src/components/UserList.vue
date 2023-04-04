<template>
    <div>
        <v-container>
            <h1 class="mt-15 text-blue" style="color:#03003f" v-show="userStore.isFaculty">Students</h1>
            <h1 class="mt-15 text-blue" style="color:#03003f" v-show="userStore.isAdmin">Users</h1>
            <br>
            <div v-show="userStore.isAdmin">
            
            <v-card>
                <v-card-title>
                    <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="userHeaders"
                :items="users"
                :search="search"
                :hide-defaut-footer="true"
                disable-pagination
                class="elevation-1"
                >
                <template v-slot:[`item.actions`]="{item}">
                    <v-btn icon small class="mr-2" :to="{name: 'user-edit', params: {id: item.id}}"><v-icon small>mdi-pencil</v-icon></v-btn>
                </template>
            </v-data-table>
            </v-card>
            
            </div>
            <div v-show="userStore.isFaculty">
            
                <v-card>
                <v-card-title>
                    <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="studentHeaders"
                :items="students"
                :search="search"
                :hide-defaut-footer="true"
                disable-pagination
                class="elevation-1"
                >
                    <template v-slot:[`item.actions`]="{item}">
                        <v-btn icon small class="mr-2" :to="{name: 'student-edit', params: {id: item.id}}"><v-icon small>mdi-pencil</v-icon></v-btn>
                    </template>
                </v-data-table>
            </v-card>
            </div>
            
        </v-container>
    </div>
</template>
<script>
import studentDS from '../services/StudentDataService'
import userDS from '../services/UserDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default{
    name: 'user-list',
    computed: {
        ...mapStores(useUserStore)
    },
    data(){
        return{
            userHeaders:[
                {
                    text: 'First Name',
                    value: 'fName',
                    sortable: 'true'
                },
                {
                    text: 'Last Name',
                    value: 'lName',
                    sortable: 'true'
                },
                {
                    text: 'Roles',
                    value: 'roles',
                    sortable: 'false'
                },
                {
                    text: 'Instruments',
                    value: 'instruments',
                    sortable: 'false'
                },
                { 
                    text: "", 
                    value: "actions", 
                    sortable: false 
                }
            ],
            studentHeaders:[
            {
                    text: 'First Name',
                    value: 'fName',
                    sortable: 'true'
                },
                {
                    text: 'Last Name',
                    value: 'lName',
                    sortable: 'true'
                },
                {
                    text: 'Classification',
                    value: 'classification',
                    sortable: 'false'
                },
                {
                    text: 'Instruments',
                    value: 'instruments',
                    sortable: 'false'
                },
                { 
                    text: "", 
                    value: "actions", 
                    sortable: false 
                }
            ],
            search:'',
            students: [],
            student: {},
            users: [],
            usersCopy: [],
            user: {},
            nameFilter: ""
        } 
    },
    methods:{
        searchByName(){
            if(this.nameFilter == ''){
                return this.users
            }
            else{
                this.usersCopy = this.users;
                return this.users.filter(u => u.lName.toLowerCase().indexOf(this.nameFilter.toLowerCase()) > -1)
            }
            
        }
    },
    mounted(){
        if(this.userStore.isAdmin){
            userDS.getAll()
            .then(res =>{
                res.data.forEach(u => {
                    this.users.push({
                        id: u.id,
                        fName: u.fName,
                        lName: u.lName,
                        roles: u.roles.map(r => r.role).join(', '),
                        instruments: u.instruments.map(i => i.instrument).join(', ')
                    })
                }
                 
                )
                console.log(this.user)
            })
            .catch(e => console.log(e))
        }
        else{
            console.log(this.userStore.user.id)
            studentDS.instructorStudents(this.userStore.user.id)
            .then(res =>{
                res.data.forEach(s => {
                    this.students.push({
                        id: s.id,
                        fName: s.user.fName,
                        lName: s.user.lName,
                        classification: s.classification,
                        instruments: s.user.instruments.map(i => i.instrument).join(', ')
                    })
                })
            })
            .catch(e => console.log(e))
        }
    }
}
</script>