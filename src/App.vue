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
        style="text-decoration: none; color: inherit"
        class="mr-5"
        :to="{ name: 'new-event' }"
        v-if="true"
        >New Event</router-link
      >
      <!--<router-link style="text-decoration: none; color: inherit; " class="mr-5" :to="{name: 'home-page'}" v-if="userStore.isFaculty || userStore.isAdmin">New Critique</router-link>-->
      <router-link
        style="text-decoration: none; color: inherit"
        class="mr-5"
        :to="{ name: 'home-page' }"
        >Students</router-link
      >
      <v-spacer></v-spacer>
      <router-link
        style="text-decoration: none; color: inherit"
        :to="{ name: 'student-details' }"
      >
        {{ userStore.name }}
        <v-btn icon>
          <v-icon> mdi-account </v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer color="cyan lighten-5" class="justify-center"
      >&copy;Stay Sticky</v-footer
    >
  </v-app>
</template>

<script>
import uds from "../src/services/UserDataService";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import AuthServices from "@/services/authServices";
// import Utils from "@/config/utils.js";

export default {
  name: "app",
  data() {
    return {
      user: {},
      title: "Musid Performance Scheduling App",
      initials: "",
      name: "",
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    resetMenu() {
      this.user = null;
      // ensures that their name gets set properly from store
      this.user = this.useUserStore.getUser();

      if (this.user != null) {
        this.initials = this.user.fName[0] + this.user.lName[0];
        this.name = this.user.fName + " " + this.user.lName;
      }
    },
    logout() {
      AuthServices.logoutUser(this.user)
        .then((response) => {
          console.log(response);
          // Utils.removeItem("user");
          useUserStore.clearUser();
          this.$router.push({ name: "login" });
          this.$router.go();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  async created() {
    this.resetMenu();
  },
  async mounted() {
    this.user = this.userStore.getUser();

    await uds
      .getAll()
      .then((res) => {
        this.users = res.data;
        // this.user = this.users.find(u => u.id === 100); //David North Admin
        // this.user = this.users.find(u => u.id === 200); //Kyle Pullen Faculty
        // this.user = this.users.find(u => u.id === 300); //Jess Long Student
        // this.user = this.users.find(u => u.id === 400); //Chloe Sheasby Student & Faculty
        this.user = this.users.find((u) => u.id === 500); //Miho Fischer Accompanist

        this.userStore.setUser(this.user);
        console.log(this.userStore);
      })
      .catch((e) => {
        console.log(e);
      });
  },
};
</script>
