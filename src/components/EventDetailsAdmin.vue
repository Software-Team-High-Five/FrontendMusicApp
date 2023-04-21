<template>
  <v-container class="body-1" v-if="loaded">
    <link
      rel="stylesheet"
      href="https://unpkg.com/vue-multiselect@2.1.6/dist/vue-multiselect.min.css"
    />
    <br />
    
    <!-- Event Details & Edit Button -->
    <v-row>
      <v-col>
        <h2>&nbsp; {{ event.name }} ({{ event.date }})</h2>
      </v-col>
      <v-col>
        <button
          class="btn btn-dark"
          style="float: right;"
          @click="openEditEvent"
        >
          Edit Event
        </button>
      </v-col>
    </v-row>
    <br />

    <!-- Faculty Table with availability -->
    <v-card>
      <v-card-title style="background-color:#f2f3f4">
        Availabilities for Faculty/Accompanists
        <v-btn class="ml-auto"
          v-show="(userStore.isFaculty || userStore.isAccompanist) && !availabilities.some(a => a.userId == userStore.user.id)"
          @click="$router.push({ name: 'sign-up', params: { eventId: event.id } })"
        >
          Mark My Availability
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="availabilityHeaders"
        :items="availabilities"
        no-data-text="No Faculty/Accompanists Available"
        @click:row="avail => clickAvailability(avail)"
      >
      </v-data-table>
    </v-card>
    <br />

    <!-- Student Table with signups/performances -->
    <v-card>
      <v-card-title style="background-color:#f2f3f4;">
        Student Performances
      </v-card-title>
      <v-data-table
        :headers="performanceHeaders"
        :items="filteredPerformances"
        no-data-text="No Students Signed Up"
        @click:row="perf => performanceDetails(perf)"
      ></v-data-table>
    </v-card>
    <br />

    <!-- Performance Details Dialog Box -->
    <v-dialog
      v-model="showPerformanceDetails"
      width="70%"
      v-if="performanceLoaded"
    >
      <v-card style="padding: 15px;">
        <v-card-title class="text-h5">
          <!-- Event Details -->
          {{ event.name }} ({{ event.date }})
        </v-card-title>

        <v-card-text class="body-1" style="color:black">
          <!-- Student Details -->
          <v-row>
            <v-col cols="2" class="text-right"><v-spacer /><strong>Instrument</strong></v-col>
            <v-col>{{ instrumentString(performance) }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="2" class="text-right"><strong>Level</strong></v-col>
            <v-col>{{ performance.student.level }}</v-col>
          </v-row>
          
          <!-- Performance Song Details -->
          <v-row>
            <h4><strong>Songs</strong></h4>
          </v-row>
          <v-row>
            <v-col><strong>Title</strong></v-col>
            <v-col><strong>Translation</strong></v-col>
            <v-col><strong>Composer</strong></v-col>
          </v-row>
          <v-row v-for="s in performance.songs" :key="s.id">
            <v-col>{{ s.title }}</v-col>
            <v-col>{{ s.translation || "No translation available" }}</v-col>
            <v-col>{{ getComposerFullName(s.composer) }}</v-col>
          </v-row>
          <br /><br />
          <!-- Feedbacks -->
          <v-row>
            <h4><strong>Feedback</strong></h4>
          </v-row>
          <!-- Existing Feedbacks -->
          <v-row v-for="f in performance.feedbacks" :key="f.id + 'f'" v-if="performance.feedbacks.length">
            <v-col class="col-sm">
              <strong>Judge:</strong> {{ f.judge.fName }} {{ f.judge.lName }}
            </v-col>
            <v-row>
              <v-textarea
                solo
                label="Label"
                outline="true"
                v-model="f.notes"
                :disabled="f.judgeId != userStore.user.id"
              ></v-textarea>
            </v-row>
          </v-row>
          <!-- New Feedback -->
          <v-row v-if="userStore.isFaculty && !judgeFeedback(performance)">
            <v-col class="col-xs">
              <strong>Judge:</strong> {{ userStore.name }}
            </v-col>
            <v-row>
              <v-col class="col-lg">Notes</v-col>
            </v-row>
            <v-row>
              <v-textarea
                solo
                outline="true"
                v-model="newNotes"
              ></v-textarea>
            </v-row>
          </v-row>
          <br /><br />
        </v-card-text>

        <!-- Action Buttons -->
        <v-row>
          <v-col style="display: flex;">
            <button 
              class="btn btn-dark"
              style="width: 98%"
              @click="showPerformanceDetails = false"
            >
              Close
            </button>
          </v-col>
          <v-col v-if="userStore.isFaculty">
            <button 
              class="btn btn-primary" 
              style="width: 98%;" 
              @click="saveCritique()"
            >
              {{ !judgeFeedback(performance) ? 'Add Critique' : 'Save'  }}
            </button>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- Edit Event Dialog Box -->
    <v-dialog v-model="showEditEvent" maxWidth="1400" persistent>
      <v-card>
        <v-card-title class="text-h4">
          Edit Event
        </v-card-title>
        <v-card-text>
          <!-- Event Time and Name -->
          <v-select
            label="Performance Type"
            :items="eventTypes"
            v-model="editEvent.type"
          ></v-select>
          <v-text-field
            label="Name"
            v-model="editEvent.name"
          ></v-text-field>
          <!-- Date Picker -->
          <v-menu
            ref="showEditEventDate"
            v-model="showEditEventDate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="editEvent.date"
                label="Date"
                readonly
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="editEvent.date"
              no-title
              @input="showEditEventDate = false"
            ></v-date-picker>
          </v-menu>
          <!-- Time Pickers -->
          <v-row>  
            <!-- Start Time -->
            <v-col>
              <label for="startTime">Start Time: &nbsp;</label>
              <input type="time" id="startTime" v-model="editEvent.startTime" />
            </v-col>
            <!-- End Time -->
            <v-col>
              <label for="endTime">End Time: &nbsp;</label>
              <input type="time" id="endTime" v-model="editEvent.endTime" />
            </v-col>
          </v-row>
          <!-- Open for Signup -->
          <v-checkbox
            v-model="editEvent.openForSignup"
            label="Open For Signup"
            hide-details
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <button
            class="btn btn-danger"
            style="width: 100%; padding-left: 10px; margin-left: 10px"
            @click="showEditEvent = false"
          >
            Cancel
          </button>
          <div class="mx-6"></div>
          <button
            class="btn btn-success"
            style="width: 100%; padding-right: 10px; margin-right: 10px"
            @click="updateEvent"
          >
            Save
          </button>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Filter Dialog Box -->
    <v-dialog title="Filters" v-model="showFilters">
      <v-card style="padding: 15px;">
        <v-container>
          <!-- Composer Filter -->
          <label>Select composers</label>
          <MultiSelect
            v-model="activeComposers"
            :options="composers"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Pick one or more"
          >
            <template slot="selection" slot-scope="{ composers, isOpen }">
              <span class="multiselect__single" v-if="composers" v-show="!isOpen">
                {{ activeComposers }}
              </span>
            </template>
          </MultiSelect>
          <br />

          <!-- Instrument Filter -->
          <label>Select instruments</label>
          <MultiSelect
            v-model="activeInstruments"
            :options="instruments"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Pick one or more"
          >
            <template slot="selection" slot-scope="{ instruments, isOpen }">
              <span class="multiselect__single" v-if="instruments" v-show="!isOpen">
                {{ activeInstruments }}
              </span>
            </template>
          </MultiSelect>
          <br />

          <!-- Accompanist Filter -->
          <label>Select accompanists</label>
          <MultiSelect
            v-model="activeAccompanists"
            :options="accompanists"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Pick one or more"
          >
            <template slot="selection" slot-scope="{ accompanists, isOpen }">
              <span class="multiselect__single" v-if="accompanists" v-show="!isOpen">
                {{ activeAccompanists }}
              </span>
            </template>
          </MultiSelect>
          <br />

          <!-- Level Filter -->
          <label>Level</label>
          <MultiSelect
            v-model="activeLevels"
            :options="levels"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="select one or more"
          >
            <template slot="selection" slot-scope="{ levels, isOpen }">
              <span class="multiselect__single" v-if="levels" v-show="!isOpen">
                {{ activeLevels }}
              </span>
            </template>
          </MultiSelect>
          <br />
          <br />

          <!-- Action Buttons -->
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
        </v-container>
      </v-card> 
    </v-dialog>
  </v-container>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import eventDS from "../services/EventDataService";
import instrumentDS from "../services/InstrumentDataService";
import availabilityDS from "../services/AvailabilityDataService";
import feedbackDS from "../services/FeebackDataService";
import MultiSelect from "vue-multiselect";

export default {
  name: "event-details-admin",
  data() {
    return {
      event: {},
      allInstruments: [],
      allPerformances: {},
      showPerformanceDetails: false,
      performance: {},
      searchString: "",
      showFilters: false,
      accompanists: [],
      composers: [],
      instruments: [],
      levels: [1, 2, 3, 4, 5, 6, 7, 8],
      activeComposers: [],
      activeInstruments: [],
      activeAccompanists: [],
      activeLevels: [],
      loaded: false,
      performanceLoaded: false,
      newNotes: '',

      showEditEvent: false,
      editEvent: {},
      eventTypes: ["Recital Hearing", "Jury", "Audition"],
      showEditEventDate: false,
      availabilityHeaders: [{text: "Name", value: "name"}, {text: "Available Times", value: "availability"}],
      availabilities: [],
      performanceHeaders: [
        {text: "Name", value: "studentName"},
        {text: "Songs", value: "songsString"},
        {text: "Instrument", value: "instrument"},
        {text: "Time", value: "time"},
        {text: "Level", value: "student.level"}
      ]
    };
  },
  components: {
    MultiSelect,
  },
  computed: {
    ...mapStores(useUserStore),
    filteredPerformances() {
      console.log(this.event.performances);
      if (this.searchString == "") {
        if (
          !this.activeAccompanists.length &&
          !this.activeComposers.length &&
          !this.activeInstruments.length &&
          !this.activeLevels.length
        ) {
          return this.event.performances;
        }
        return this.event.performances.filter(
          (p) =>
            this.activeAccompanists.includes(p.accompanist) ||
            this.activeInstruments.includes(p.instrument.instrument) ||
            p.songs.forEach((s) => {
              this.activeComposers.includes(
                this.getComposerFullName(s.composer)
              );
            }) ||
            this.activeLevels.includes(p.student.level) 
        );
      } else {
        const ss = this.searchString.toLowerCase();
        return this.event.performances.filter(
          (p) =>
            p.student.user.fName.toLowerCase().indexOf(ss) > -1 ||
            p.student.user.lName.toLowerCase().indexOf(ss) > -1 ||
            p.accompanist.toLowerCase().indexOf(ss) > -1 ||
            this.songsString(p.songs).toLowerCase().indexOf(ss) > -1 ||
            //filters
            this.activeAccompanists.includes(p.accompanist) ||
            this.activeInstruments.includes(p.instrument.instrument) ||
            p.songs.forEach((s) => {
              this.activeComposers.includes(
                this.getComposerFullName(s.composer)
              );
            }) ||
            this.activeLevels.includes(p.student.level)
        );
      }
    },
  },
  methods: {
    async fetch() {
      let eventPromise = eventDS.get(this.$route.params.eventId)
        .then((res) => {
          this.event = res.data;
          this.setFilters();
        });
      let instrumentPromise = instrumentDS.getAll()
        .then((res) => {
          this.allInstruments = res.data;
        });
      let availabilitiesPromise = availabilityDS.getForEvent(null, this.$route.params.eventId)
        .then((res) => {
          res.data.forEach((avail) => {
            let userAvail = this.availabilities.find((a) => a.userId === avail.userId);
            let time = `${this.convertTime(avail.startTime)} - ${this.convertTime(avail.endTime)}`;
            if (!userAvail)
              this.availabilities.push({
                userId: avail.userId,
                name: `${avail.user.fName} ${avail.user.lName}`,
                availability: time
              });
            else
              userAvail.availability += `, ${time}`;
          });
        });
      
      Promise.all([eventPromise, instrumentPromise, availabilitiesPromise])
        .then(() => {
          this.event.performances = this.event.performances.map((p) => { return {
            ...p,
            studentName: `${p.student.user.fName} ${p.student.user.lName}`,
            songsString: this.songsString(p.songs),
            instrument: this.instrumentString(p),
            time: `${this.convertTime(p.startTime)} - ${this.convertTime(p.endTime)}`
          }});
          this.loaded = true;
        })
        .catch((e) => console.log(e));
    },
    convertTime(militaryTime) {
      let [ hours, minutes ] = militaryTime.split(':');
      if (hours > 12)
        return `${parseInt(hours) - 12}:${minutes}PM`;
      else
        return `${parseInt(hours)}:${minutes}AM`;
    },
    openEditEvent() {
      this.editEvent = Object.assign({}, this.event);
      this.showEditEvent = true;
    },
    updateEvent() {
      eventDS.update(this.event.id, this.editEvent)
        .then(() => {
          this.event = this.editEvent;
          this.showEditEvent = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    clickAvailability(avail) {
      // this.$router.push({
      //   name: "sign-up-admin",
      //   params: {
      //     eventId: this.$route.params.eventId,
      //     userId: avail.userId
      //   }});
    },
    performanceDetails(p) {
      this.performance = p;
      this.showPerformanceDetails = true;
      this.performanceLoaded = true;
    },
    instrumentString(performance) {
      return this.allInstruments.find((i) => i.id == performance.instrumentId).instrument;
    },
    songsString(songs) {
      return songs.length === 0 ? "No Songs" : songs.map((s) => s.title).join(", ");
    },
    setFilters() {
      var a = new Set();
      this.event.performances.forEach((p) => {
        a.add(p.accompanist);
      });
      this.accompanists = Array.from(a);
      var c = new Set();
      this.event.performances.forEach((p) =>
        p.songs.forEach((s) => c.add(this.getComposerFullName(s.composer)))
      );
      this.composers = Array.from(c);
      var i = new Set();
      this.event.performances.forEach((p) => i.add(p.instrumentId));
      this.instruments = Array.from(i);
      console.log(this.instruments);
    },
    clearFilters() {
      this.activeAccompanists = [];
      this.activeInstruments = [];
      this.activeComposers = [];
      this.activeLevels = [];
      this.showFilters = false;
    },
    saveCritique() {
      if(this.newNotes.length){
        const newCritique = {
          notes: this.newNotes
          ,performanceId: this.performance.id
          ,judgeId: this.userStore.user.id
          ,userId: this.performance.student.id
        }
        feedbackDS.create(newCritique) 
          .then((res) => {
            console.log('new critique successfully made', res.data);
            this.showPerformanceDetails = false;
            this.performanceLoaded = false;
          })
          .catch((err) => {
            console.log(err || 'unknown error creating feedback')
          })
        return
      }
      for (let i = 0; i < this.performance.feedbacks.length; i++) {
        let tempCritique = {
          id: this.performance.feedbacks[i].id,
          notes: this.performance.feedbacks[i].notes,
          performanceId: this.performance.feedbacks[i].performanceId,
          judgeId: this.performance.feedbacks[i].judgeId,
          userId: this.performance.feedbacks[i].userId,
        };
        feedbackDS
          .update(tempCritique.id, tempCritique)
          .then((res) => {
            console.log(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      this.showPerformanceDetails = false;
      this.performanceLoaded = false;
    },
    getComposerFullName(c) {
      return c.fName + " " + c.mName + " " + c.lName;
    },
    judgeFeedback(performance) {
        return performance.feedbacks.find((f) => f.judgeId == this.userStore.user.id) ? true : false
    },
  },
  mounted() {
    this.fetch();
  },
};
</script>
