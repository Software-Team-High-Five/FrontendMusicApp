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
            <router-link style="text-decoration: none; color: inherit; " class="mr-5" :to="{name: 'home-page'}">New Critique</router-link>
            <router-link style="text-decoration: none; color: inherit; " class="mr-5" :to="{name: 'home-page'}">Students</router-link>
            <v-spacer></v-spacer>
            <router-link style="text-decoration: none; color: inherit;" to="/">
                <v-toolbar-btn icon> 
                <v-icon> mdi-account </v-icon> 
            </v-toolbar-btn> 
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

  export default {
    name: "app",
    data() {
        return {
            users: [],
            user: {},
        };
    },
    methods: {  },
    mounted() {
        uds.getAll()
            .then(res => {
            this.users = res.data;
            this.user = this.users.find(u => u.id == 2);
        })
            .catch(e => {
            console.log(e);
        });
    },
};
</script>