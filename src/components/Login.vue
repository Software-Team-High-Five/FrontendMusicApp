<template>
  <div class="signup-buttons">
    <br /><br />
    <h1 class="text-uppercase grey-text text-center font-weight-medium">
      Music Performance System
    </h1>
    <h3 class="text-uppercase grey-text text-center font-weight-light">
      Please Sign In to Continue
    </h3>

    <v-row>
      <v-col style="display: grid">
        <div id="parent_id" style="grid-column: 2"></div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AuthServices from "@/services/authServices";
//import { pinia } from "@/main";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";

// import Utils from "@/config/utils.js";

export default {
  name: "LoginSignupSocial",
  data() {
    return {
      fName: "",
      lName: "",
      roleCounter: 0,
      user: {},
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  created() {},
  mounted() {
    this.loginWithGoogle();
  },
  methods: {
    async loginWithGoogle() {
      global.handleCredentialResponse = this.handleCredentialResponse;
      const client = process.env.VUE_APP_CLIENT_ID;
      console.log(client);
      global.google.accounts.id.initialize({
        client_id: client,
        cancel_on_tap_outside: false,
        auto_select: true,
        callback: global.handleCredentialResponse,
      });
      global.google.accounts.id.renderButton(
        document.getElementById("parent_id"),
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signup_with",
          width: 400,
        }
      );
    },
    async handleCredentialResponse(response) {
      let token = {
        credential: response.credential,
      };
      await AuthServices.loginUser(token)
        .then((response) => {
          console.log(this.userStore);
          this.user = response.data;
          this.userStore.setUser(this.user);
          // this.fName = this.user.fName;
          // this.lName = this.user.lName;
          this.$router.push({ name: "home-page" });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>
