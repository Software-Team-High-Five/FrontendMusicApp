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
      <v-menu
        v-if="userStore.user != null"
        bottom
        min-width="200px"
        rounded
        offset-y
      >
        <template #activator="{ on, attrs }">
          <v-btn icon x-large v-bind="attrs" v-on="on">
            <v-avatar v-if="userStore != null" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">
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
                  userStore.isStudent ?
                    $router.push({ name: 'student-details' }) :
                    $router.push({ name: 'user-details' });
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
// import uds from "../src/services/UserDataService";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
// import { mapStores, mapActions } from "pinia";
import AuthServices from "@/services/authServices";
// import Utils from "@/config/utils.js";

export default {
  name: "app",
  data() {
    return {
      // user: {},
      title: "Music Performance Scheduling App",
      initials: "",
      name: "",
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    //...mapActions(useUserStore, ["setUser", "clearUser"]),

    resetMenu() {
      // ensures that their name gets set properly from store
      // this.user = useUserStore().user;

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
          // Utils.removeItem("user");
          // this.userStore.clearUser();
          // this.useUserStore().clearUser();
          this.userStore.clearUser();
          this.$router.push({ name: "login" });
          // this.$router.go();
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
    // this.userStore.clearUser();
    // // console.log(this.user);
    // // this.user = useUserStore().user;
    // await uds
    //   .getAll()
    //   .then((res) => {
    //     this.users = res.data;
    //     this.user = this.users.find((u) => u.id === 100); //David North Admin
    //     // this.user = this.users.find(u => u.id === 200); //Kyle Pullen Faculty
    //     // this.user = this.users.find(u => u.id === 300); //Jess Long Student
    //     // this.user = this.users.find(u => u.id === 400); //Chloe Sheasby Student & Faculty
    //     // this.user = this.users.find((u) => u.id === 500); //Miho Fischer Accompanist
    //     this.userStore.setUser(this.user);
    //     console.log(this.user);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  },
};
</script>
