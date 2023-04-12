<template>
  <v-container class="body-1" v-if="loaded">
    <link
      rel="stylesheet"
      href="https://unpkg.com/vue-multiselect@2.1.6/dist/vue-multiselect.min.css"
    />
    <br />
    
    <!-- Event Name & Date -->
    <h2>&nbsp; {{ event.name }} ({{ event.date }})</h2>
    <br />

    <!-- Search and Filter -->
    <v-row>
      <v-col class="col-md-3">
        <h3>&nbsp; Performances</h3>
      </v-col>
      <!-- Search Bar -->
      <v-col class="col-md-7" style="margin: 10px; padding: 10px">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search by name, song, etc"
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
      <!-- Filter Popup Button -->
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

    <!-- Performance List -->
    <div
      class="col-md-15"
      style="border-radius: 5px; padding: 10px; margin: 10px"
    >
      <div class="card">
        <table class="table" style="margin-bottom: 0px">
          <!-- Table Headers -->
          <thead style="background-color: #f2f3f4">
            <tr>
              <th>Name</th>
              <th>Songs</th>
              <th>Instrument</th>
              <!-- <th>Accompanist</th> -->
              <th>Time</th>
              <th>Level</th>
              <th></th>
            </tr>
          </thead>
          <!-- Table Rows -->
          <tbody>
            <tr
              class="table-group-item"
              v-for="p in filteredPerformances"
              :key="p.id"
              @click="performanceDetails(p)"
            >
              <td>{{ p.student.user.fName }} {{ p.student.user.lName }}</td>
              <td>{{ songsString(p) }}</td>
              <td>{{ instrumentString(p) }}</td>
              <!-- <td>{{ p.accompanist ?? 'no Accompanist'}}</td> -->
              <td>{{ p.startTime }} - {{ p.endTime }}</td>
              <td>{{ p.student.level }}</td>
              <td>
                <button
                  class="btn btn-dark"
                  @click="performanceDetails(p)"
                  style="margin-right: 10px; border-radius: 4px"
                >
                  Critique
                  <!--Replace with pen icon later-->
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br />

    <!-- Performance Details Dialog Box -->
    <v-dialog
      v-model="showPerformanceDetails"
      :title="user.fName + ' ' + user.lName + '\n (' + event.date + ')'"
      width="70%"
      v-if="performanceLoaded"
    >
      <v-card style="padding: 15px;">
        <!-- Event Details -->
        <v-row>
          <v-col><strong>Event</strong></v-col>
          <v-col><strong>Instrument</strong></v-col>
          <v-col><strong>Level</strong></v-col>
        </v-row>
        <v-row>
          <v-col>{{ event.name }}</v-col>
          <v-col>{{ instrumentString(performance) }}</v-col>
          <v-col>{{ performance.student.level }}</v-col>
        </v-row>
        <br /><br />

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
        <v-row v-if="!judgeFeedback(performance)">
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
          <v-col>
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

    <!-- Filter Dialog Box -->
    <v-dialog title="Filters" v-model="showFilters">
      <v-container>
        <v-card style="padding: 15px;">
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
        </v-card> 
      </v-container>
    </v-dialog>
  </v-container>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import eds from "../services/EventDataService";
import ids from "../services/InstrumentDataService";
import feedbackDataService from "../services/FeebackDataService";
import MultiSelect from "vue-multiselect";

export default {
  name: "event-details-admin",
  data() {
    return {
      event: {},
      allInstruments: [],
      allPerformances: {},
      students: [],
      showPerformanceDetails: false,
      performance: {},
      student: {},
      user: {},
      instrument: {},
      songs: {},
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
      showMyStudents: false,
      loaded: false,
      performanceLoaded: false,
      newNotes: ''
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
            this.songsString(p).toLowerCase().indexOf(ss) > -1 ||
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
      let eventPromise = eds.get(this.$route.params.eventId)
        .then((res) => {
          this.event = { ...res.data };
          this.event.performances.forEach((p) => this.students.push(p.student));
          this.setFilters();
        });
      let instPromise = ids.getAll()
        .then((res) => {
          this.allInstruments = res.data;
        });
      Promise.all([eventPromise, instPromise])
        .then(() => {
          this.loaded = true;
        })
        .catch((e) => console.log(error));
    },
    performanceDetails(p) {
      this.performance = p;
      this.showPerformanceDetails = true;
      this.performanceLoaded = true;
    },
    instrumentString(performance) {
      return this.allInstruments.find((i) => i.id == performance.instrumentId).instrument;
    },
    songsString(performance) {
      var songs = "";
      if (performance.songs.length > 1) {
        performance.songs.forEach((s) => {
          songs += s.title + ", ";
        });
        return songs;
      } else if (performance.songs.length == 1) {
        return performance.songs[0].title;
      } else {
        return "No Songs";
      }
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
        feedbackDataService.create(newCritique) 
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
        feedbackDataService
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
    // async getAllPerformances() {
    //   if (this.userStore.user.role == "student") {
    //     await pds
    //       .getAllForStudent()
    //       .then((res) => {
    //           res.data.forEach((p) => this.allPerformances.push(p));
    //       })
    //       .catch((e) => console.log(e));
    //   } else {
    //       await pds.getAllForInstructor().then((res) => {
    //       res.data.forEach((p) => this.allPerformances.push(p));
    //       });
    //   }
    // },
    judgeFeedback(performance) {
        return performance.feedbacks.find((f) => f.judgeId == this.userStore.user.id) ? true : false
    },
  },
  mounted() {
    this.fetch();
  },
};
</script>
