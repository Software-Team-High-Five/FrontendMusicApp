<template>
    <v-container>
        <v-row>
            <v-col>
                <h3>Name</h3>
                <h5>Email</h5>
                <br>
                <h5>Major</h5>
                <h5>Classification</h5>
                <h5>Semester</h5>
                <h5>Level</h5>
                <h5>Instructor</h5>
            </v-col>
            <v-col>
                <div class="body-1"></div>
                <div class="body-1">{{ userStore.name }}</div>
                <div class="body-1">{{ userStore.user.email }}</div>
                <br>
                <div class="body-1">{{ userStore.user.student.major }}</div>
                <div class="body-1">{{ userStore.user.student.classification }}</div>
                <div class="body-1">{{ userStore.user.student.semester }}</div>
                <div class="body-1">{{ userStore.user.student.level }}</div>
                <div class="body-1">{{ instructor }}</div>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';
import userDS from '@/services/UserDataService';

export default {
    name: 'student-details'
    ,data() {
        return {
            instructor: ''
        };
    }
    ,computed: {
        ...mapStores(useUserStore)
    }
    ,methods: {
    }
    ,mounted() {
        userDS.get(this.userStore.user.student.instructorId)
            .then(res => {
                this.instructor = `${res.data.fName} ${res.data.lName}`
            })
            .catch(e => {
                console.log(e);
            });
    }
}
</script>