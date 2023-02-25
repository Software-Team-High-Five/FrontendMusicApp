<template>
  <div>
    <h1 class="mt-15 ml-16 text-blue" style="color:#03003f">OC Music Department</h1>
    <v-container class="mt-15">
      <v-row class="align-center">
        <v-col class="pa-5">
          <div class="card-button align-center" style="position:relative">
            <div>
              <h2 class="pa-5" style="color:#03003f">
                View all events
              </h2>
            </div>
            <div class="align-end" style="position:absolute; bottom:20px; left:20px;">
              <v-btn color="#03003f"
                elevation="5"
                style="color:#ffffff"
                :to="{name: 'all-events'}"
                >
                Events                              
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col class="pa-5" v-show="userStore.isAdmin">
          <div class="card-button align-center" style="position:relative">
            <div>
              <h2 class="pa-5" style="color:#03003f">
                Create a new event
              </h2>
            </div>
            <div class="align-end" style="position:absolute; bottom:20px; left:20px">
              <v-btn color="#03003f"
                elevation="5"
                style="color:#ffffff"
                :to="{name: 'new-event'}"
                >
                Create                              
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col class="pa-5">
          <div class="card-button align-center" style="position:relative">
            <div>
              <h2 class="pa-5" style="color:#03003f">
                Sign up for an event
              </h2>
            </div>
            <div class="align-end" style="position:absolute; bottom:20px; left:20px">
              <v-btn color="#03003f"
                elevation="5"
                style="color:#ffffff"
                :to="{name: 'all-events', query: {'upcoming': 1}}"
                >
                Sign up                              
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default {
  name: "home-page",
  components: { },
  data() { return { } },
  methods: {  },
  computed: {  ...mapStores(useUserStore)  },
  mounted() {  },
};
</script>

<style scoped>
.card-button{
  border-radius: 4px;
  border-style: solid;
  border-color:#070243;
  min-height: 300px;
  max-width: 350px;
  
}
</style>
