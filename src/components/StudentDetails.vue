<template>
    <v-container>
        <v-row>
            <v-col class="text-right">
                <div class="body-1"><strong>Name</strong></div>
                <div class="body-1"><strong>Email</strong></div>
                <br>
                <div class="body-1"><strong>Major</strong></div>
                <div class="body-1"><strong>Classification</strong></div>
                <div class="body-1"><strong>Semester</strong></div>
                <div class="body-1"><strong>Level</strong></div>
                <div class="body-1"><strong>Instructor</strong></div>
                <div class="body-1"><strong>Instruments</strong></div>
            </v-col>
            <v-col>
                <div class="body-1">{{ userStore.name }}</div>
                <div class="body-1">{{ userStore.user.email }}</div>
                <br>
                <div class="body-1">{{ userStore.user.student.major }}</div>
                <div class="body-1">{{ userStore.user.student.classification }}</div>
                <div class="body-1">{{ userStore.user.student.semester }}</div>
                <div class="body-1">{{ userStore.user.student.level }}</div>
                <div class="body-1">{{ instructor }}</div>
                <div class="body-1" v-for="instrument in userStore.user.student.instruments" :key="instrument.id">
                    {{ instrument.instrument }}
                </div>
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
            instructor: '<loading>'
            ,prevRoute: null
        }
    }
    ,computed: {
        ...mapStores(useUserStore)
    }
    ,methods: {
    }
    ,mounted() {
        userDS.get(this.userStore.user.student.instructorId)
            .then(res => {
                this.instructor = `${res.data.fName} ${res.data.lName}`;
            })
            .catch(e => {
                console.log(e);
                this.instructor = 'Error: not found';
            });
        if(this.prevRoute.name == 'student-edit') {
            window.location.reload()
        }
        console.log(this.userStore);
    }
    ,beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.prevRoute = from;
        })
    }
}
</script>