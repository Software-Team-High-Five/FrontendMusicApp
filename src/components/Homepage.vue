<template>
  <div>
    <v-container>
      <div v-if="recentlyAddedEvents.length">
          <h1 class="mt-15 mb-4" style="color:#03003f">Notifications</h1>
          
          <v-slide-group show-arrows class="ml-n4">
            <v-slide-item class="card-button align-center ml-4 mr-4" style="position:relative"
                v-for="e in recentlyAddedEvents"
                :key="e.id"
                @click="signUp(e.id)"
                v-show="recentlyAddedEvents.length"
              >
                <v-card max-width="500">
                  <v-card-title class="text-h4 font-weight-medium" style="color:#03003f">{{ e.name }}</v-card-title>
                  <v-card-subtitle style="color:#03003f">{{ e.date }}</v-card-subtitle>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#03003f" elevation="5" style="color:#ffffff" :to="{name: 'sign-up', params: {eventId: e.id}}">
                        View
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-slide-item>
          </v-slide-group>
      </div>

    <h1 class="mt-15 mb-4" style="color:#03003f">Actions</h1>
    <v-slide-group show-arrows class="ml-n4">
      <v-slide-item class="card-button align-center ml-4 mr-4" style="position:relative">
        <v-card max-width="350">
          <v-card-title  class="text-h4 font-weight-medium" style="color:#03003f">View all Events</v-card-title>
            <v-card-subtitle style="color:#03003f">View all Registered, Unregistered, and Past Events.</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#03003f" elevation="5" style="color:#ffffff" :to="{name: 'all-events'}">
                Events                               
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-slide-item>
      <v-slide-item v-show="userStore.isAdmin" class="card-button align-center ml-4 mr-4" style="position:relative">
        <v-card max-width="350">
          <v-card-title class="text-h4 font-weight-medium" style="color:#03003f">Create a New Event</v-card-title>
            <v-card-subtitle style="color:#03003f">Select a time and date for a new Recital Hearing, Jury, or Audition.</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="#03003f" elevation="5" style="color:#ffffff" :to="{name: 'all-events'}">
                New Event                                
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-slide-item>
      <v-slide-item class="card-button align-center ml-4 mr-4" style="position:relative">
        <v-card max-width="350">
          <v-card-title class="text-h4 font-weight-medium" style="color:#03003f">Manage Users</v-card-title>
            <v-card-subtitle style="color:#03003f">Manage any faculty, student, or accompanist information.</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#03003f" elevation="5" style="color:#ffffff" :to="{name: 'all-events'}">
                Users                               
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-slide-item>
      <!-- only show students -->
      <v-slide-item class="card-button align-center ml-4 mr-4" style="position:relative" v-show="userStore.isStudent">
        <v-card max-width="350">
            <v-card-title class="text-h4 font-weight-medium" style="color:#03003f">Sign up for an event</v-card-title>
            <v-card-subtitle style="color:#03003f">Sign up or submit avaliable time for a jury or recital hearing.</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#03003f" elevation="5" style="color:#ffffff"                 
              :to="{name: 'all-events', query: {'upcoming': 1}}"
              >
                Sign Up                               
                          </v-btn>
            </v-card-actions>
          </v-card>
      </v-slide-item>
    </v-slide-group>
    </v-container>
  </div>
</template>

<script>
import eds from "../services/EventDataService";
import pds from "../services/PerformanceDataService";
import sds from "../services/StudentDataService";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
//import "@kouts/vue-modal/dist/vue-modal.css";

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
                    console.log(this.events);
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
        )
        },
        recentlyAddedEvents() {
            var todayDate = new Date()
            var day = 60 * 60 * 24 * 1000;

            var yesterdayDate = new Date(todayDate.getTime() - day);
            var yesterday = yesterdayDate.toISOString().substring(0, 10);
            // this.events.forEach(e => {
            //     console.log(e.createdAt);
            // })

            return this.events.filter(
                (e) =>
                e.createdAt.substring(0, 10) <= this.today && e.createdAt.substring(0, 10) >= yesterday &&
                !this.userPerformances.find((p) => p.eventId == e.id) &&
                this.generalFilter(e)
            );
        }
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
  max-width: 350px;
  
}
</style>