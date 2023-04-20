<template>
  <v-container class="body-1" v-if="loaded">
    <!-- Name -->
    <v-row>
      <v-col class="text-left py-0" cols="4">
        <strong>Name</strong>
      </v-col>
      <v-col class="py-0" cols="8">
        {{ user.name }}
      </v-col>
    </v-row>
    <!-- Email -->
    <v-row>
      <v-col class="text-left py-0" cols="4">
        <strong>Email</strong>
      </v-col>
      <v-col class="py-0" cols="8">
        {{ user.email }}
      </v-col>
    </v-row>
    <v-row><v-col></v-col></v-row>
    <!-- Roles -->
    <v-row>
      <v-col class="text-left py-0" align-self="center" cols="4">
        <strong>Roles</strong>
      </v-col>
      <v-col class="py-0" cols="8">
        <v-select
          v-model="user.roleIds"
          :items="allRoles"
          item-text="role"
          item-value="id"
          multiple
          dense
        ></v-select>
      </v-col>
    </v-row>
    <!-- Instruments -->
    <v-row>
      <v-col class="text-left py-0" align-self="center" cols="4">
        <strong>Instruments</strong>
      </v-col>
      <v-col class="py-0" cols="8">
        <v-select
          v-model="user.instrumentIds"
          :items="allInstruments"
          item-text="instrument"
          item-value="id"
          multiple
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="mx-12">
      <v-btn @click="Save"> Save Changes </v-btn>
    </v-row>
  </v-container>
</template>
<script>
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import userDS from "@/services/UserDataService";
import userInstDS from "@/services/User_InstrumentDataService";
import roleDS from "@/services/RoleDataService";
import instrumentDS from "@/services/InstrumentDataService";

export default {
  name: "user-edit",
  data() {
    return {
      user: {},
      allInstruments: [],
      allRoles: [],

      loaded: false,
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    Save() {
      this.UpdateRoles();
      this.UpdateInstruments();
      this.$router.push({ name: "user-list" });
    },
    async UpdateRoles() {
      let promises = [];
      // Remove roles that the user no longer does
      let rolesToRemove = this.user.prevRoles.filter(
        (i) => !this.user.roleIds.includes(i)
      );
      for (const inst of rolesToRemove) {
        promises.push(
          userDS.removeRole(this.user.id, inst).then(() => {
            console.log(
              `${this.allRoles.find((i) => i.id == inst).role} removed from ${
                this.user.name
              }`
            );
          })
        );
      }
      // Add roles that the user now does
      let rolesToAdd = this.user.roleIds.filter(
        (i) => !this.user.prevRoles.includes(i)
      );
      for (const inst of rolesToAdd) {
        promises.push(
          userDS.addRole(this.user.id, inst).then(() => {
            console.log(
              `${this.allRoles.find((i) => i.id == inst).role} added to ${
                this.user.name
              }`
            );
          })
        );
      }
      // Await backend requests
      await Promise.all(promises)
        .then(() => {
          console.log("All roles updated successfully");
        })
        .catch((err) => {
          console.log(err);
        });
      // Refresh the cached list of roles
      this.user.prevRoles = this.user.roleIds;
    },
    async UpdateInstruments() {
      let promises = [];
      // Remove instruments that the user no longer plays
      let instToRemove = this.user.prevInstruments.filter(
        (i) => !this.user.instrumentIds.includes(i)
      );
      for (const inst of instToRemove) {
        promises.push(
          userInstDS.delete(this.user.id, inst).then(() => {
            console.log(
              `${
                this.allInstruments.find((i) => i.id == inst).instrument
              } removed from ${this.user.name}`
            );
          })
        );
      }
      // Add instruments that the user now plays
      let instToAdd = this.user.instrumentIds.filter(
        (i) => !this.user.prevInstruments.includes(i)
      );
      for (const inst of instToAdd) {
        promises.push(
          userInstDS.create({ userId: this.user.id, instrumentId: inst }).then(() => {
            console.log(
              `${
                this.allInstruments.find((i) => i.id == inst).instrument
              } added to ${this.user.name}`
            );
          })
        );
      }
      // Await backend requests
      await Promise.all(promises)
        .then(() => {
          console.log("All instruments updated successfully");
        })
        .catch((err) => {
          console.log(err);
        });
      // Refresh the cached list of instruments
      this.user.prevInstruments = this.user.instrumentIds;
    },
  },
  async mounted() {
    // Get the user's data
    let userPromise = userDS.get(this.$route.params.id).then((res) => {
      this.user = {
        id: res.data.id,
        name: `${res.data.fName} ${res.data.lName}`,
        email: res.data.email,
        roleIds: res.data.roles.map((r) => r.id),
        instrumentIds: res.data.user_instruments.map((i) => i.instrumentId),
      };
      this.user.prevRoles = this.user.roleIds;
      this.user.prevInstruments = this.user.instrumentIds;
      console.log(this.user);
      console.log(res.data);
    });
    // Get all roles
    let rolesPromise = roleDS.getAll().then((res) => {
      this.allRoles = res.data;
    });
    // Get all instruments
    let instrumentsPromise = instrumentDS.getAll().then((res) => {
      this.allInstruments = res.data;
    });
    // Mark page as loaded when all data is loaded
    await Promise.all([userPromise, rolesPromise, instrumentsPromise])
      .then(() => {
        this.loaded = true;
      })
      .catch((err) => {
        console.log(err);
      });
    // Wait for data; then mark page as loaded
  },
};
</script>
