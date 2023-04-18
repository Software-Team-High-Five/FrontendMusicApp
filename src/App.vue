<template>
  <v-app>
    <v-app-bar flat app color="cyan lighten-5">
      <router-link style="text-decoration: none; color: inherit" to="/">
        <v-toolbar-title class="text-uppercase grey-text">
          <span>OC </span>
          <span class="font-weight-light">Music Department</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <router-link
        v-if="isLoggedIn()"
        style="text-decoration: none; color: inherit"
        class="mr-5"
        :to="{ name: 'all-events' }"
        >All Events</router-link
      >

      <router-link
        v-if="isLoggedIn()"
        v-show="userStore.isAdmin"
        style="text-decoration: none; color: inherit"
        class="mr-5"
        :to="{ name: 'new-event' }"
        >New Event</router-link
      >
      <router-link
        v-if="isLoggedIn()"
        v-show="userStore.isAdmin || userStore.isFaculty"
        style="text-decoration: none; color: inherit"
        class="mr-5"
        :to="{ name: 'user-list' }"
        >{{
          isLoggedIn() && userStore.isAdmin ? "Users" : "Students"
        }}</router-link
      >
      <router-link
        v-if="isLoggedIn()"
        v-show="userStore.isAdmin"
        style="text-decoration: none; color: inherit"
        class="mr-5"
        :to="{ name: 'composer-list' }"
        >Composers</router-link
      >
      <v-spacer></v-spacer>
      <v-menu v-if="isLoggedIn()" bottom min-width="275px" rounded offset-y>
        <template #activator="{ on, attrs }">
          <v-btn icon x-large v-bind="attrs" v-on="on">
            <v-avatar v-if="isLoggedIn()" color="#03003f">
              <span class="font-weight-bold" style="color: #ffffff">{{
                initials
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar color="#03003f" class="mt-2 mb-2">
                <span class="font-weight-bold" style="color: #ffffff">
                  {{ initials }}
                </span>
              </v-avatar>
              <h3>{{ userStore.name }}</h3>
              <p class="text-caption mt-1">
                {{ userStore.user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
                @click="
                  userStore.isStudent
                    ? $router.push({ name: 'student-details' })
                    : $router.push({ name: 'user-details' })
                "
              >
                My Details
              </v-btn>
              <br />
              <v-btn depressed rounded text @click="logout()"> Logout </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import AuthServices from "@/services/authServices";

export default {
  name: "app",
  data() {
    return {
      title: "Music Performance Scheduling App",
      initials: "",
      name: "",
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    resetMenu() {
      if (this.userStore.user != null) {
        this.initials =
          this.userStore.user.fName[0] + this.userStore.user.lName[0];
        this.name = this.userStore.user.fName + " " + this.userStore.user.lName;
      }
    },
    logout() {
      console.log(this.userStore.user);
      AuthServices.logoutUser(this.userStore.user)
        .then((response) => {
          console.log(response);
          this.userStore.clearUser();
          this.$router.push({ name: "login" });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    isLoggedIn() {
      return this.userStore.user ? true : false;
    },
  },
  async created() {
    this.resetMenu();
  },
};
</script>
