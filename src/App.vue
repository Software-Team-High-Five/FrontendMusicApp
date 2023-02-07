<template>
  <v-app>
    <data-app>
      <v-app-bar App>
        <v-toolbar-title class="title">
          <div>Performance</div>    
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link :to="{ name: 'newEvent'}">Create Event</router-link>
        <div>
          <!-- <button @click="fetch()">fetch</button>
          <button @click="addUser()">add user</button>
          <button @click="addStudent()">add student</button>
          <button @click="updateUser()">update user</button>
          <button @click="updateStudent()">update student</button>
          <button @click="deleteUser()">delete user</button>
          <button @click="deleteStudent()">delete student</button> -->
          <!-- <button @click="addAdmin()" v-show="!user">Add Admin</button>
          <button @click="createRecital()" v-show="user.role == 'admin'">Create Recital</button>
          <button @click="setAdmin()" v-show="user.role != 'admin'">set admin</button>
          <button @click="setFaculty()" v-show="user.role != 'faculty'">set faculty</button>
          <button @click="getPerformances()">getPerformances</button> -->
        </div>
      </v-app-bar>
    </data-app>
  </v-app>
</template>

<script>
import sds from '../src/services/StudentDataService' ;
import uds from '../src/services/UserDataService';
import eds from '../src/services/EventDataService';
import { RouterLink } from 'vue-router';

  export default {
    name: "app",
    data() {
        return {
            users: [],
            user: {},
            students: [],
            recital: {
                date: "02-28-2023",
                type: "Recital Hearing",
                startTime: "00:00:00",
                endTime: "00:00:00",
                openForSignup: 1
            },
            performances: []
        };
    },
    methods: {
        fetch() {
            sds.getAll()
                .then((res) => {
                this.students = res.data;
            })
                .catch((e) => {
                console.log(e);
            });
            uds.getAll()
                .then((res) => {
                this.users = res.data;
            })
                .catch((e) => {
                console.log(e);
            });
        },
        addUser() {
            uds.create(this.newUser)
                .then(res => {
                console.log(res.data);
                this.fetch();
            })
                .catch(e => {
                console.log(e);
            });
        },
        addStudent() {
            console.log(this.newStudent);
            sds.create(this.newStudent)
                .then(res => {
                console.log(res.data);
                this.fetch();
            })
                .catch(e => {
                console.log(e);
            });
        },
        updateUser() {
            var data = { ...this.newUser };
            data.fname = "newStudent";
            uds.update(data.id, data)
                .then(res => {
                console.log(res.data);
                this.fetch();
            })
                .catch(e => { console.log(e); });
        },
        updateStudent() {
            var data = { ...this.newStudent };
            data.major = "update major";
            sds.update(data.id, data)
                .then(res => {
                console.log(res.data);
                this.fetch();
            })
                .catch(e => { console.log(e); });
        },
        deleteUser() {
            uds.delete(1)
                .then(res => {
                console.log(res.data);
                this.fetch();
            })
                .catch(e => { console.log(e); });
        },
        deleteStudent() {
            sds.delete(1)
                .then(res => {
                console.log(res.data);
                this.fetch();
            })
                .catch(e => { console.log(e); });
        },
        addAdmin() {
            const userData = {
                role: "admin",
                fName: "Admin",
                lName: "Admin",
                email: "admin@admin.com"
            };
            uds.create(userData)
                .then(res => {
                console.log(res.data);
                this.user = res.data;
            })
                .catch(e => {
                console.log(e);
            });
        },
        createRecital() {
            eds.create(this.recital)
                .then(res => {
                console.log(res.data);
            })
                .catch(e => {
                console.log(e);
            });
        },
        addFaculty() {
            uds.create({
                role: "faculty",
                fName: "Faculty",
                lName: "Faculty",
                email: "faculty@faculty.com"
            })
                .then(res => {
                console.log(res.data);
                this.users.push(res.data);
            })
                .catch(e => {
                console.log(e);
            });
        },
        setAdmin() {
            this.user = this.users.find(u => u.id == 2);
        },
        setFaculty() {
            this.user = this.users.find(u => u.id == 3);
        },
        getPerformances() {
            eds.getActive()
                .then(res => {
                console.log(res.data);
                this.performances.push(res.data);
            })
                .catch(e => {
                console.log(e);
            });
        }
    },
    mounted() {
        uds.getAll()
            .then(res => {
            this.users = res.data;
            console.log(this.users);
        })
            .catch(e => {
            console.log(e);
        });
    },
    components: { RouterLink }
};
</script>