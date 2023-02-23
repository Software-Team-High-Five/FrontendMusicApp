<template>
  <div>
    <link
      rel="stylesheet"
      href="https://unpkg.com/vue-multiselect@2.1.6/dist/vue-multiselect.min.css"
    />
    <br />
    <h2>&nbsp; {{ event.name }} ({{ event.date }})</h2>
    <br />
    <v-row>
      <v-col class="col-md-3 sticky-top">
        <h3>&nbsp; Performances</h3>
      </v-col>
      <v-col class="col-md-7 sticky-top" style="margin: 10px; padding: 10px">
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
    <div
      class="col-md-15"
      style="border-radius: 5px; padding: 10px; margin: 10px"
    >
      <div class="card">
        <table class="table" style="margin-bottom: 0px">
          <thead style="background-color: #f2f3f4">
            <tr>
              <th>Name</th>
              <th>Songs</th>
              <th>Instrument</th>
              <th>Accompanist</th>
              <th>Time</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-group-item"
              v-for="p in filteredPerformances"
              :key="p.id"
              @click="performanceDetails(p)"
            >
              <td>{{ p.student.user.fName }} {{ p.student.user.lName }}</td>
              <td>{{ songsString(p) }}</td>
              <td>{{ p.instrument.instrument }}</td>
              <td>{{ p.accompanist }}</td>
              <td>{{ p.startTime }} - {{ p.endTime }}</td>
              <td>{{ p.student.level }}</td>
              <td>
                <button
                  class="btn btn-dark"
                  @click="performanceDetails(p)"
                  style="margin-right: 10px; border-radius: 4px"
                >
                  Critique
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br />
    <div
      class="col-md-15"
      style="border-radius: 5px; padding: 10px; margin: 10px"
      v-show="showAllPerformances"
    >
      <div class="card">
        <table class="table" style="margin-bottom: 0px">
          <thead style="background-color: #f2f3f4">
            <tr colspan="6">
              <th>All Performances</th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Event</th>
              <th>Songs</th>
              <th>Instrument</th>
              <th>Accompanist</th>
              <th>Time</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-group-item"
              v-for="perform in allPerformances"
              :key="perform.id"
              @click="performanceDetails(perform)"
            >
              <td>
                {{ perform.student.user.fName }}
                {{ perform.student.user.lName }}
              </td>
              <td>{{ perform.event.name }} ({{ perform.event.date }})</td>
              <td>{{ songsString(perform) }}</td>
              <td>{{ perform.instrument.instrument }}</td>
              <td>{{ perform.accompanist }}</td>
              <td>{{ perform.startTime }} - {{ perform.endTime }}</td>
              <td>{{ perform.student.level }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal
      v-model="showPerformanceDetails"
      :title="user.fName + ' ' + user.lName + '\n (' + event.date + ')'"
      width="70%"
    >
      <v-row>
        <v-col><strong>Event</strong></v-col>
        <v-col><strong>Instrument</strong></v-col>
        <v-col><strong>Level</strong></v-col>
      </v-row>
      <v-row>
        <v-col>{{ event.name }}</v-col>
        <v-col>{{ instrument.instrument }}</v-col>
        <v-col>{{ student.level }}</v-col>
      </v-row>
      <br /><br />
      <v-row
        ><h4><strong>Songs</strong></h4></v-row
      >
      <v-row>
        <v-col><strong>Title</strong></v-col>
        <v-col><strong>Translation</strong></v-col>
        <v-col><strong>Composer</strong></v-col>
      </v-row>
      <v-row v-for="s in songs" :key="s.id">
        <v-col>{{ s.title }}</v-col>
        <v-col>{{ s.translation || "No translation available" }}</v-col>
        <v-col>{{ getComposerFullName(s.composer) }}</v-col>
      </v-row>
      <br /><br />
      <v-row
        ><h4><strong>Feedback</strong></h4></v-row
      >
      <v-row>
        <v-col class="col-xs"><strong>Judge</strong></v-col>
        <v-col class="col-lg"><strong>Notes</strong></v-col>
      </v-row>
      <v-row v-for="f in performance.feedbacks" :key="f.id">
        <v-col class="col-sm">{{ f.judge.fName }} {{ f.judge.lName }}</v-col>
        <!-- <v-col class="col-lg">{{ f.notes }}</v-col>-->
        <v-col class="col-lg">
          <textarea
            solo
            label="Label"
            outline="true"
            v-model="f.notes"
          ></textarea>
        </v-col>
      </v-row>
      <br /><br />
      <v-row>
        <!--<button class="btn btn-dark" @click="showPerformanceDetails = false">-->
        <button class="btn btn-dark" @click="saveCritique()">Close</button>
      </v-row>
    </Modal>
    <Modal title="Filters" v-model="showFilters">
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
        <template slot="selection" slot-scope="{ composers, isOpen }"
          ><span
            class="multiselect__single"
            v-if="composers"
            v-show="!isOpen"
            >{{ activeComposers }}</span
          ></template
        >
      </MultiSelect>
      <br />
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
        <template slot="selection" slot-scope="{ instruments, isOpen }"
          ><span
            class="multiselect__single"
            v-if="instruments"
            v-show="!isOpen"
            >{{ activeInstruments }}</span
          ></template
        >
      </MultiSelect>
      <br />
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
        <template slot="selection" slot-scope="{ accompanists, isOpen }"
          ><span
            class="multiselect__single"
            v-if="accompanists"
            v-show="!isOpen"
            >{{ activeAccompanists }}</span
          ></template
        >
      </MultiSelect>
      <br />
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
        <template slot="selection" slot-scope="{ levels, isOpen }"
          ><span class="multiselect__single" v-if="levels" v-show="!isOpen">{{
            activeLevels
          }}</span></template
        >
      </MultiSelect>
      <br />
      <v-row class="col-md-15">
        <v-col>
          <v-checkbox
            v-model="showAllPerformances"
            label="Show All Performances"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
      <br />
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
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import eds from "../services/EventDataService";
import pds from "../services/PerformanceDataService";
import VueModal from "@kouts/vue-modal";
import "@kouts/vue-modal/dist/vue-modal.css";
import MultiSelect from "vue-multiselect";

export default {
  name: "event-details",
  data() {
    return {
      event: {},
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
      showAllPerformances: false,
    };
  },
  components: {
    Modal: VueModal,
    MultiSelect,
  },
  computed: {
    ...mapStores(useUserStore),
    filteredPerformances() {
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
    async getEventDetails() {
      await eds
        .get(this.$route.params.eventId)
        .then((res) => {
          this.event = { ...res.data };
          this.event.performances.forEach((p) => this.students.push(p.student));
          this.setFilters();
        })
        .catch((e) => console.log(e));
    },
    performanceDetails(p) {
      this.performance = p;
      this.student = p.student;
      this.user = p.student.user;
      this.songs = p.songs;
      this.instrument = p.instrument;
      this.showPerformanceDetails = true;
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
      this.event.performances.forEach((p) => i.add(p.instrument.instrument));
      this.instruments = Array.from(i);
    },
    clearFilters() {
      this.activeAccompanists = [];
      this.activeInstruments = [];
      this.activeComposers = [];
      this.activeLevels = [];
      this.showFilters = false;
    },
    saveCritique() {
      //   pds
      //     .update({this.event.performance.id, this.event.performance})           // .update({ ...this.event})
      //     .then((res) => {
      //       console.log(res.data);
      //     })
      //     .catch((e) => {
      //       console.log(e);
      //     });
      for (let i = 0; i < this.performance.feedbacks.length; i++) {
        let tempCritique = {
          id: this.performance.feedbacks[i].id,
          notes: this.performance.feedbacks[i].notes,
          performanceId: this.performance.feedbacks[i].performanceId,
          judgeId: this.performance.feedbacks[i].judgeId,
          userId: this.performance.feedbacks[i].userId,
        };
        pds
          .update(tempCritique.id, tempCritique)
          .then((res) => {
            console.log(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      this.showPerformanceDetails = false;
    },
    getComposerFullName(c) {
      return c.fName + " " + c.mName + " " + c.lName;
    },
    async getAllPerformances() {
      if (this.userStore.user.role == "student") {
        await pds
          .getAllForStudent()
          .then((res) => {
            res.data.forEach((p) => this.allPerformances.push(p));
          })
          .catch((e) => console.log(e));
      } else {
        await pds.getAllForInstructor().then((res) => {
          res.data.forEach((p) => this.allPerformances.push(p));
        });
      }
    },
  },
  mounted() {
    this.getEventDetails();
    this.getAllPerformances();
  },
};
</script>
