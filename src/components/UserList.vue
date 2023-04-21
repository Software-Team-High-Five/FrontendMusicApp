<template>
    <div>
        <v-container>
            <div v-show="userStore.isAdmin">
                <v-card>
                    <v-card-title style="background-color:#f2f3f4">
                        <v-row>
                            <v-col>
                                <h1 class="ma-0 mt-2 pl-5" style="color:#03003f">Users</h1>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-data-table
                        :headers="userHeaders"
                        :items="users"
                        :search="search"
                        :hide-defaut-footer="true"
                        disable-pagination
                        class="elevation-1"
                        @click:row="user => $router.push({ name: 'user-edit', params: {id: user.id} })"
                    ></v-data-table>
                </v-card>
                <br>
            </div>

            <div v-show="userStore.isFaculty">
                <v-card>
                    <v-card-title style="background-color:#f2f3f4">
                        <v-row>
                            <v-col>
                                <h1 class="ma-0 mt-2 pl-5" style="color:#03003f">Students</h1>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-data-table
                        :headers="studentHeaders"
                        :items="students"
                        :search="search"
                        :hide-defaut-footer="true"
                        disable-pagination
                        class="elevation-1"
                        @click:row="student => $router.push({ name: 'student-edit', params: {id: student.id} })"
                    ></v-data-table>
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
        if(this.userStore.isAdmin) {
            userDS.getAll()
                .then(res => {
                    res.data.forEach(u => {
                        this.users.push({
                            id: u.id,
                            fName: u.fName,
                            lName: u.lName,
                            roles: u.roles.map(r => r.role).join(', '),
                            instruments: u.user_instruments.map(i => i.instrument.instrument).join(', ')
                        })
                    });
                    console.log(this.user)
                })
                .catch(e => console.log(e));
        }
        if(this.userStore.isFaculty) {
            studentDS.instructorStudents(this.userStore.user.id)
                .then(res =>{
                    console.log(res.data);
                    res.data.forEach(s => {
                        console.log(s);
                        this.students.push({
                            id: s.id,
                            fName: s.user.fName,
                            lName: s.user.lName,
                            classification: s.classification,
                            instruments: s.user.user_instruments.map(i => i.instrument.instrument).join(', ')
                        })
                    });
                    console.log(this.students);
                })
                .catch(e => console.log(e));
        }
    }
}
</script>