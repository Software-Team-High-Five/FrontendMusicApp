<template>
    <v-app>
        <v-app-bar flat app color="cyan lighten-5">
            <router-link style="text-decoration: none; color: inherit;" to="/">
                <v-toolbar-title class="text-uppercase grey-text">
                <span>OC </span>
                <span class="font-weight-light">Music Department</span>
                </v-toolbar-title>
            </router-link>            
            <v-spacer></v-spacer>
            <router-link style="text-decoration: none; color: inherit;" class="mr-5" :to="{name: 'new-event'}">New Event</router-link>
            <router-link style="text-decoration: none; color: inherit; " class="mr-5" :to="{name: 'critique-f'}">New Critique</router-link>
            <router-link style="text-decoration: none; color: inherit; " class="mr-5" :to="{name: 'home-page'}">Students</router-link>
            <v-spacer></v-spacer>
            <router-link style="text-decoration: none; color: inherit;" to="/">
                {{ userStore.name }}
                <v-btn icon>
                    <v-icon> mdi-account </v-icon>
                </v-btn> 
            </router-link>            
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>

        <v-footer color="cyan lighten-5" class="justify-center">&copy;Stay Sticky</v-footer>

    </v-app>
</template>

<script>
import uds from '../src/services/UserDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

  export default {
    name: "app",
    data() {
        return {
            users: [],
            user: {},
        };
    },
    computed: {
        ...mapStores(useUserStore),
    },
    methods: {  },
    mounted() {
        uds.getAll()
            .then(res => {
                this.users = res.data;
                this.user = this.users.find(u => u.id === 1);
                this.userStore.setUser(this.user);
                console.log(this.userStore);
            })
            .catch(e => {
                console.log(e);
            });
    },
};
</script>