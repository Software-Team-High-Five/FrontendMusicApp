<template>
  <div id="app">
    <div>
      <router-view />
      <!-- <button @click="fetch()">fetch</button>
      <button @click="addUser()">add user</button>
      <button @click="addStudent()">add student</button>
      <button @click="updateUser()">update user</button>
      <button @click="updateStudent()">update student</button>
      <button @click="deleteUser()">delete user</button>
      <button @click="deleteStudent()">delete student</button> -->
    </div>
  </div>
</template>

<script>
import sds from '../src/services/StudentDataService' ;
import uds from '../src/services/UserDataService';

  export default {
    name: "app",
    data() {
      return {
        users: [],
        students: [],
        newUser: {
          id: 1,
          role: 'student',
          fname: 'student',
          lname: 'user',
          email: 'student@user.com'
        },
        newStudent: {
          id: 1,
          userId: 1,
          classification: 'senior',
          major: 'music',
          semester: 1,
          level: 10
        },
      }
    },
    methods: {
      fetch() {
        sds.getAll()
         .then((res) => {
          this.students = res.data;
         })
         .catch((e) => {
          console.log(e);
         })

        uds.getAll()
        .then((res) => {
        this.users = res.data;
        })
        .catch((e) => {
        console.log(e);
        })
      },
      addUser() {
        uds.create(this.newUser)
          .then(res => {
            console.log(res.data);
            this.fetch();
          })
          .catch(e => {
            console.log(e);
          })
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
          })
      },
      updateUser() {
        var data = {...this.newUser}
        data.fname = 'newStudent';
        uds.update(data.id, data)
          .then(res => {
            console.log(res.data);
            this.fetch();
          })
          .catch(e => { console.log(e); })
      },
      updateStudent() {
        var data = {...this.newStudent};
        data.major = 'update major';
        sds.update(data.id, data)
          .then(res => {
            console.log(res.data);
            this.fetch();
          })
          .catch(e => { console.log(e); })
      },
      deleteUser() {
        uds.delete(1)
          .then(res => {
            console.log(res.data);
            this.fetch();
          })
          .catch(e => { console.log(e) })
      },
      deleteStudent() {
        sds.delete(1)
          .then(res => {
            console.log(res.data);
            this.fetch();
          })
          .catch(e => { console.log(e) })
      }
    }
  };
</script>