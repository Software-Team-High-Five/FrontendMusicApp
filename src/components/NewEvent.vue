<template>
  <div>
    <v-container>
      <h1 class="mt-15 mb-4" style="color: #03003f">
        Create a New Performance
      </h1>

      <br /><!--<br /><br />-->
      <v-col class="col-md">
        <v-card style="padding: 20px">
          <!-- <br /> -->
          <v-row>
            <v-select
              label="Select a performance type"
              :items="eventType"
              v-model="event.type"
            ></v-select>
          </v-row>
          <div v-show="event.type">
            <!-- Event Name -->
            <v-row>
              <v-text-field
                v-model="event.name"
                label="Name"
                :rules="rules"
                hide-details="auto"
              ></v-text-field>
            </v-row>
            <br />
            <br />
            <!-- Event Date -->
            <v-row>
              <v-menu
                ref="dateMenu"
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="event.date"
                    label="Date"
                    :rules="rules"
                    hide-details="auto"
                    readonly
                    dense
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="event.date"
                  no-title
                  @input="dateMenu = false"
                  :allowed-dates="disablePastDates"
                ></v-date-picker>
              </v-menu>
            </v-row>

            <!-- Time Pickers -->
            <v-row justify="center">
              <!-- Start Time -->
              <v-col
                cols="11"
                sm="5"
                style="width: 50%; justify-content: center"
              >
                <vuetify-time-select v-model="event.startTime" :minuteGroups="[0, 10, 20, 30, 40, 50]">
                </vuetify-time-select>
              </v-col>
              <!-- End Time -->
              <v-col
                cols="11"
                sm="5"
                style="width: 50%; justify-content: center"
              >
              <vuetify-time-select v-model="event.endTime" :minuteGroups="[0, 10, 20, 30, 40, 50]">
                </vuetify-time-select>
              </v-col>
            </v-row>

            <!-- Open for Signup -->
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="event.openForSignup"
                  label="Open For Signup"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>

            <!-- Action Buttons -->
            <v-row>
              <!-- Cancel Button -->
              <v-col>
                <button
                  class="btn btn-danger"
                  @click="clearEvent()"
                  style="width: 100%; padding-left: 10px; margin-left: 10px"
                >
                  Cancel
                </button>
              </v-col>
              <!-- Create Button -->
              <v-col>
                <button
                  class="btn btn-success"
                  @click="createEvent()"
                  style="width: 100%; padding-right: 10px; margin-right: 10px"
                >
                  Create Event
                </button>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-container>
    <!-- Snack Bar -->
    <v-snackbar v-model="snackbar" :timeout="timeout" color="red accent-2">
      <v-icon dark left> mdi-alert-circle </v-icon>
      {{ this.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          <strong>Close</strong>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import eds from "../services/EventDataService";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import VuetifyTimeSelect from 'vuetify-time-select';


export default {
  components: {
    VuetifyTimeSelect
  },
  name: "new-event",
  data() {
    return {
      eventType: ["Recital Hearing", "Jury", "Audition"],
      event: {
        date: "",
        name: "",
        type: "",
        startTime: "",
        endTime: "",
        openForSignup: 0,
      },
      today: null,
      dateMenu: 0,
      timeMenu1: 0,
      timeMenu2: 0,
      snackbar: false,
      text: "Please fill out all fields.",
      timeout: 8000,
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 0) || "Cannot be empty",
      ],
      time: '20:30' // specified in HH:MM format
    };
  },
  methods: {
    disablePastDates(val) {
      return val >= this.today;
    },
    createEvent() {
      if (this.eventIncomplete()) {
        this.snackbar = true;
        return false;
      }
      this.event.startTime += ":00";
      this.event.endTime += ":00";
      eds
        .create({ ...this.event })
        .then((res) => {
          console.log(res.data);
          this.clearEvent();
          this.$router.push({ name: "all-events" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    clearEvent() {
      this.event = {
        date: "",
        type: "",
        name: "",
        startTime: "",
        endTime: "",
        openForSignup: 0,
      };
      this.dateMenu = 0;
      this.timeMenu1 = 0;
      this.timeMenu2 = 0;
    },
    eventIncomplete() {
      let incomplete = Object.values(this.event).some((e) => e !== 0 && !e);
      console.log(incomplete);
      return incomplete;
    },
  },
  computed: { ...mapStores(useUserStore) },
  mounted() {
    this.today = new Date().toISOString().substring(0, 10);
  },
};
</script>

<style></style>
