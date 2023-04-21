<template>
  <div>
    <v-container>
      <!-- Header, Search, & Filter -->
      <v-row class="mt-15">
        <v-col class="col-md-3 sticky" v-if="!isUpcoming">
          <h1 style="color:#03003f">&nbsp; All Events</h1>
        </v-col>
        <v-col class="col-md-7 sticky" style="margin: 10px; padding: 10px">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Search by name"
              v-model="searchString"
            />
            <button
              class="btn btn-dark"
              @click="searchString = ''"
              style="margin-right: 10px; border-radius: 4px"
            >
              Clear Search
            </button>
          </div>
        </v-col>
        <v-col
          class="md-2 sticky"
          style="margin: 10px; padding: 10px; border-radius: 4px; width: 100%"
        >
          <button
            class="btn btn-dark btn-outline" v-if="!userStore.isStudent"
            @click="showFilters = !showFilters"
          >
            Filter
          </button>
        </v-col>
      </v-row>
      <br />
      
      <!-- Todays Events-->
      <div v-if="!userStore.isStudent">
        <v-card>
          <v-card-title style="background-color:#f2f3f4">
            Todays Events for Critiques
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="todaysEvents"
            disable-pagination
            hide-default-footer
            no-data-text="No Events Scheduled For Today"
            @click:row="e => viewPerformance(e.id)"
          >
          </v-data-table>
        </v-card>
        <br />
      </div>
      
      <!-- Future Events (unregistered) -->
      <v-card>
        <v-card-title style="background-color:#f2f3f4">
          Future Events
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="FutureEvents"
          disable-pagination
          hide-default-footer
          no-data-text="No Future Events Available"
          @click:row="e => goFutureEvent(e)"
        >
        </v-data-table>
      </v-card>
      <br />
      
      <!-- Non-admin Tables -->
      <div v-show="userStore.isFaculty || userStore.isAccompanist || userStore.isStudent">
        <!-- My Upcoming Events -->
        <v-card>
          <v-card-title style="background-color:#f2f3f4">
            My Upcoming Events
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="myUpcomingEvents"
            disable-pagination
            hide-default-footer
            no-data-text="You Have No Upcoming Events"
            @click:row="e => goMyUpcomingEvent(e)"
          >
          </v-data-table>
        </v-card>
        <br />

        <!-- My Past Events -->
        <v-card>
          <v-card-title style="background-color:#f2f3f4">
            My Past Events
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="myPastEvents"
            disable-pagination
            hide-default-footer
            no-data-text="You Have No Past Events"
            @click:row="e => goMyPastEvent(e)"
          >
          </v-data-table>
        </v-card>
        <br />
      </div>
      
      <!-- All Past Events -->
      <v-card v-if="userStore.isAdmin">
        <v-card-title style="background-color:#f2f3f4">
          All Past Events
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="allPastEvents"
          no-data-text="No Past Events Available"
          @click:row="e => goAllPast(e)"
        >
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Filter Popup -->
    <v-dialog 
      title="Filters" 
      v-model="showFilters"
      max-width="500px"
      >
      <v-card min-height="220px">
        <v-card-title>Filters</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col class="text-left py-0" align-self="center" cols="4">
                    <label><strong>Event Type</strong></label>
                </v-col>
            </v-row>
            <v-row>
                <v-select
                  v-model="activeTypes"
                  :items="eventTypes"
                  placeholder="Pick one or more"
                  outlined
                  multiple
                  chips
                  dense
                  hide-details
                  >
                </v-select>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <button
            class="btn btn-danger" 
            @click="clearFilters()"
            style="width: 49%"
          >Clear Filters</button>
          <v-spacer></v-spacer>
          <button
            class="btn btn-dark"
            @click="showFilters = false"
            style="width: 49%"
          >Apply</button>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import eds from "../services/EventDataService";
import pds from "../services/PerformanceDataService";
import sds from "../services/StudentDataService";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";

export default {
  name: "all-events",
  data() {
    return {
      headers: [{ text:"Name", value:"name"},{ text:"Type", value:"type"},{ text:"Date", value:"date"},{ text:"Time", value:"timeRange"}],
      events: [],
      userPerformances: [],
      today: null,
      user: {
        role: "student",
        id: 3,
      },
      students: [],
      searchString: "",
      isUpcoming: false,
      showFilters: false,
      eventTypes: ["Recital Hearing", "Jury", "Audition"],
      activeTypes: [],
    };
  }
  ,methods: {
    async fetch() {
      // Get all events
      await eds.getAll()
        .then(res => {
          res.data.forEach(e => {
            e.timeRange = `${e.startTime} - ${e.endTime}`;
            this.events.push(e);
          });
          console.log(this.events);
        })
        .catch(e => console.log(e));
      
      // Get all events for a student
      if(this.userStore.isStudent){
        await pds.getAllForStudent(this.userStore.user.id)
          .then(res => {
            res.data.forEach(p => {
              this.userPerformances.push(p);
            })
            console.log(this.userPerformances);
          })
          .catch(e => console.log(e));
      // Get all events for an instructor
      } else {
        await pds.getAllForInstructor(this.userStore.user.id)
          .then(res => {
            res.data.forEach(p => { this.userPerformances.push(p) })
          })
          .catch(e => console.log(e));
        await sds.instructorStudents(this.userStore.user.id)
          .then(res => { res.data.forEach(s => this.students.push(s)) })
          .catch(e => console.log(e));
      }

    },
    goFutureEvent(event) {
      if (this.userStore.isAdmin)
        this.$router.push({ name: 'event-details-admin', params: { eventId: event.id }});
      else
        this.$router.push({ name: 'sign-up', params: { eventId: event.id } })
    },
    goMyUpcomingEvent(event) {
      if (this.userStore.isStudent || !event.openForSignup)
        this.$router.push({ name: 'sign-up', params: { eventId: event.id }, query: { 'editing': 1 }});
      else
        this.$router.push({ name: 'event-details', params: { eventId: event.id }});
    },
    goMyPastEvent(event) {
      if (this.userStore.isStudent)
        this.$router.push({ name: 'view-performance', params: {
          performanceId: this.userPerformances.find(p => p.eventId === event.id).id }});
      else
        this.$router.push({ name: 'event-details', params: { eventId: event.id }});
    },
    goAllPast(event) {
      this.$router.push({ name: 'event-details-admin', params: { eventId: event.id }});
    },
    generalFilter(event) {
      // Filter by search string
      if(this.searchString.length > 0 && event.name.toLowerCase().indexOf(this.searchString.toLowerCase()) == -1)
        return false;
      // Filter by selected event types
      return this.activeTypes.length == 0 || this.activeTypes.includes(event.type);
    },
    clearFilters() {
      this.activeTypes = [];
    }
  },
  computed: {
    ...mapStores(useUserStore),
    FutureEvents() {
      return this.events.filter((e) =>
        e.date > this.today &&
        !this.userPerformances.some((p) => p.eventId == e.id) &&
        !e.availabilities.some(a => a.userId == this.userStore.user.id) &&
        (!this.userStore.isStudent || e.openForSignup) &&
        this.generalFilter(e)            
      );
    },
    myUpcomingEvents() {
      return this.events.filter((e) =>
        e.date > this.today &&
        this.generalFilter(e) &&
        (this.userPerformances.find((p) => p.eventId == e.id) || (e.availabilities.find(a => a.userId == this.userStore.user.id)))
      );
    },
    myPastEvents() {
      return this.events.filter((e) =>
        e.date < this.today &&
        this.userPerformances.find((p) => p.eventId == e.id) &&
        this.generalFilter(e)
      );
    },
    allPastEvents() {
      return this.events.filter((e) =>
        e.date < this.today &&
        this.generalFilter(e)
      );
    },
    todaysEvents() {
      return this.events.filter((e) =>
        e.date == this.today &&
        !this.userPerformances.find((p) => p.eventId == e.id) &&
        this.generalFilter(e)
      );
    },
  },
  mounted() {
    this.fetch();
    this.today = new Date().toISOString().substring(0, 10);
    if (this.$route.query.upcoming) {
      this.isUpcoming = 1;
    }
  }
};
</script>

<style scoped>
.table th{
  width: 25%
}
</style>