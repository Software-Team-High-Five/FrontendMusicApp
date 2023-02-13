<template>
    <v-app>
        <v-app-bar app>
            <v-toolbar-title class="title">
                <div>Performance</div>    
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="user != null">
                <v-btn 
                    exact
                    :to="{ name: 'new-event' }"
                    text> 
                    create event
                </v-btn>
                <v-btn
                    exact
                    :to="{ name: 'event-s' }"
                    text
                >student events
                </v-btn>
            </v-toolbar-items>
        </v-app-bar>
        <v-main>
            <router-view />
        </v-main>
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