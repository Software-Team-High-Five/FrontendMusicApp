<template>
  <div>
    <!-- <div
      class="col-md-15"
      style="border-radius: 5px; padding: 10px; margin: 10px"
    >
      <div class="card">
        <table class="table" style="margin-bottom: 0px">
          <thead style="background-color: #f2f3f4">
            <tr>
              <th colspan="4" style="border-bottom: none">
                <h4>Upcoming Events</h4>
              </th>
            </tr>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-group-item"
              v-for="e in upcomingEvents"
              :key="e.id"
              @click="signUp(e.id)"
              v-show="upcomingEvents.length"
            >
              <td>{{ e.name }}</td>
              <td>{{ e.type }}</td>
              <td>{{ e.date }}</td>
              <td>{{ e.startTime }} - {{ e.endTime }}</td>
            </tr>
            <tr v-show="!upcomingEvents.length">
              <td><strong>No Upcoming Events</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
    <h1 class="mt-15 ml-16 text-blue" style="color:#03003f">Notifications</h1>
    
      <v-container class="mt-15">
      <v-row class="align-center">
        <v-col class="pa-5">
          <!-- horizontal scroll not working -->
          <horizontal-scroll>
            <div class="card-button align-center" style="position:relative"
              v-for="e in upcomingEvents"
              :key="e.id"
              @click="signUp(e.id)"
              v-show="upcomingEvents.length"
            >
            <div>
              <h2 class="pa-5" style="color:#03003f">{{ e.name }}             </h2>
            </div>
            <div>
              <h2 class="pa-5" style="color:#03003f">{{ e.date }}             </h2>
            </div>
            <div class="align-end" style="position:absolute; bottom:20px; left:20px;">
              <v-btn color="#03003f" elevation="5" style="color:#ffffff" :to="{name: 'all-events'}">
                View                              
              </v-btn>
            </div>
        </div>
          </horizontal-scroll>

        </v-col>

      </v-row>
    </v-container>


    <h1 class="mt-15 ml-16 text-blue" style="color:#03003f">Options</h1>
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
import eds from "../services/EventDataService";
import pds from "../services/PerformanceDataService";
import sds from "../services/StudentDataService";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
// import "@kouts/vue-modal/dist/vue-modal.css";

export default {
  name: "home-page",
  components: {
   },
  data() { 
    return {
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
   },
   methods: {
        async fetch() {
            await eds.getAll()
                .then(res => {
                    res.data.forEach(e => {
                        this.events.push(e);
                    });
                })
                .catch(e => console.log(e));
            if(this.userStore.user.role == 'student'){
               await pds.getAllForStudent(this.userStore.user.id)
                .then(res => {
                    res.data.forEach(p => {
                        this.userPerformances.push(p);
                    })
                    console.log(this.userPerformances);
                })
                .catch(e => console.log(e));
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

        }
        ,signUp(eid) {
            if(this.userStore.isAdmin){
                console.log('direct admin to edit the upcoming event');
            } else {
                this.$router.push({name: 'sign-up', params: {eventId: eid}});
            }
        }
        ,editSignup(eid){
            this.$router.push({name: 'sign-up', params: { eventId: eid }, query: { 'editing': 1 }})
        }
        ,viewPerformance(eid){
            if(this.userStore.user.role == 'student'){
                const viewPerformance = this.userPerformances.find(p => p.eventId == eid);
                this.$router.push({ name: 'view-performance', params: {performanceId: viewPerformance.id}});
            } else {
                this.$router.push({ name: 'event-details', params: {eventId: eid}});
            }
        }
        ,generalFilter(event) {
            if(this.searchString == ''){
                if(!this.activeTypes.length){
                    return true;
                }
                if(this.activeTypes.includes(event.type)){
                    return true
                }
            } else {
                if(event.name.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || this.activeTypes.includes(event.type)){
                    return true;
                }
                return false;
            }
            return false;
        }
        ,clearFilters() {
            this.activeTypes = [];
        }
    },
  computed: {
        ...mapStores(useUserStore),
        myPastEvents() {
        return this.events.filter(
            (e) =>
            e.date < this.today &&
            this.userPerformances.find((p) => p.eventId == e.id) &&
            this.generalFilter(e)
        );
        },
        upcomingEvents() {
        return this.events.filter(
            (e) =>
            e.date > this.today &&
            !this.userPerformances.find((p) => p.eventId == e.id) &&
            this.generalFilter(e)
        );
        },
        registeredEvents() {
        return this.events.filter(
            (e) =>
            e.date > this.today &&
            this.generalFilter(e) &&
            this.userPerformances.find((p) => p.eventId == e.id)
        );
        },
        todaysEvents() {
        return this.events.filter(
            (e) =>
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
    },
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