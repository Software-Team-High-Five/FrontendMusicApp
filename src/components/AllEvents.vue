<template>
  <div>
    <link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.6/dist/vue-multiselect.min.css" />
    <br />
    <v-row>
      <v-col class="col-md-3 sticky-top" v-if="!isUpcoming">
        <h3>&nbsp; All Events</h3>
      </v-col>
      <v-col class="col-md-7 sticky-top" style="margin: 10px; padding: 10px">
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
        class="md-2 sticky top"
        style="margin: 10px; padding: 10px; border-radius: 4px; width: 100%"
      >
        <button
          class="btn btn-dark btn-outline"
          @click="showFilters = !showFilters"
        >
          Filter
        </button>
      </v-col>
    </v-row>
    <br />
    <!-- Todays Events-->
    <div
      class="col-md-15"
      style="border-radius: 5px; padding: 10px; margin: 10px"
      v-show="!isUpcoming && todaysEvents.length"
    >
      <div class="card">
        <table class="table" style="margin-bottom: 0px">
          <thead style="background-color: #f2f3f4">
            <tr>
              <th colspan="4" style="border-bottom: none">
                <h4>Todays Events For Critiques</h4>
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
              v-for="e in todaysEvents"
              :key="e.id"
              @click="viewPerformance(e.id)"
            >
              <td>{{ e.name }}</td>
              <td>{{ e.type }}</td>
              <td>{{ e.date }}</td>
              <td>{{ e.startTime }} - {{ e.endTime }}</td>
            </tr>
            <tr v-show="!myPastEvents.length">
              <td><strong>No Events Today</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br />
    <div
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
    </div>
    <br />
    <div
      class="col-md-15"
      style="border-radius: 5px; padding: 10px; margin: 10px"
      v-show="!isUpcoming"
    >
      <div class="card">
        <table class="table" style="margin-bottom: 0px">
          <thead style="background-color: #f2f3f4">
            <tr>
              <th colspan="4" style="border-bottom: none">
                <h4>Registered Events</h4>
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
            <!--<tr
              class="table-group-item"
              v-for="e in registeredEvents"
              :key="e.id"
              @click="editSignup(e.id)"
              v-show="!isUpcoming"
            > -->
            <tr
              class="table-group-item"
              v-for="e in registeredEvents"
              :key="e.id"
              @click="viewPerformance(e.id)"
              v-show="!isUpcoming"
            >
              <td>{{ e.name }}</td>
              <td>{{ e.type }}</td>
              <td>{{ e.date }}</td>
              <td>{{ e.startTime }} - {{ e.endTime }}</td>
            </tr>
            <tr v-show="!registeredEvents.length">
              <td><strong>No Registered Events</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br />
    <div
      class="col-md-15"
      style="border-radius: 5px; padding: 10px; margin: 10px"
      v-show="!isUpcoming"
    >
      <div class="card">
        <table class="table" style="margin-bottom: 0px">
          <thead style="background-color: #f2f3f4">
            <tr>
              <th colspan="4" style="border-bottom: none">
                <h4>My Past Events</h4>
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
              v-for="e in myPastEvents"
              :key="e.id"
              @click="viewPerformance(e.id)"
              v-show="myPastEvents.length"
            >
              <td>{{ e.name }}</td>
              <td>{{ e.type }}</td>
              <td>{{ e.date }}</td>
              <td>{{ e.startTime }} - {{ e.endTime }}</td>
            </tr>
            <tr v-show="!myPastEvents.length">
              <td><strong>No Past Events</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal title="Filters" v-model="showFilters">
      <label>Event Type</label><br />
      <MultiSelect
        v-model="activeTypes"
        :options="eventTypes"
        :multiple="true"
        :close-on-select="true"
        :clear-on-select="false"
        :preserve-search="true"
        placeholder="Pick one or more"
      >
        <template slot="selection" slot-scope="{ eventTypes, isOpen }"
          ><span
            class="multiselect__single"
            v-if="eventTypes"
            v-show="!isOpen"
            >{{ activeTypes }}</span
          ></template
        >
      </MultiSelect>
      <br /><br />
      <v-row>
        <v-col>
          <button
            class="btn btn-danger"
            style="width: 100%"
            @click="clearFilters()"
          >
            Clear Filters
          </button>
        </v-col>
        <v-col>
          <button
            class="btn btn-dark"
            style="width: 100%"
            @click="showFilters = false"
          >
            Apply
          </button>
        </v-col>
      </v-row>
    </Modal>
  </div>
</template>

<script>
import eds from "../services/EventDataService";
import pds from "../services/PerformanceDataService";
import sds from "../services/StudentDataService";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import VueModal from "@kouts/vue-modal";
import "@kouts/vue-modal/dist/vue-modal.css";
import MultiSelect from "vue-multiselect";

export default {
  name: "all-events",
  components: {
    Modal: VueModal,
    MultiSelect,
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
  }
    ,methods: {
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
    }
};
</script>
