<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center">Sign Up Page</h1>
      </v-col>
    </v-row>
    <div v-if="loaded">
      <div v-if="!error">
        <v-row :align="'center'">
          <v-col style="width: min-content">
            <h4 class="text-right">Event Details</h4>
          </v-col>
          <v-col style="width: min-content">
            <div>
              <span class="font-weight-medium">Type:</span> {{ event.type }}
            </div>
            <div>
              <span class="font-weight-medium">Date:</span> {{ event.date }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- Select a time slot -->
            <h4 class="text-center">Select a time slot</h4>
            <v-card>
              <v-calendar
                type="day"
                v-model="event.date"
                :events="timeSlots"
                interval-minutes="5"
                :first-interval="calAtts.fIndex"
                :interval-count="calAtts.iCount"
                :short-intervals="false"
                @click:event="selectTimeSlot"
                :event-color="getEventColor"
                hide-header
                style="max-height: 600px"
              >
                <template v-slot:event="{ event, eventParsed }">
                  <div class="pl-1 text-center">
                    <strong>{{ event.name }}</strong
                    ><br />
                    {{ timeRange(eventParsed.start, eventParsed.end) }}
                  </div>
                </template>
              </v-calendar>
            </v-card>
            <v-row
              v-if="!userStore.isStudent"
              :align="'center'"
              style="padding-top: 15px"
            >
              <button class="btn btn-dark" @click="facultySubmit">
                Submit
              </button>
            </v-row>
          </v-col>
          <v-col v-if="userStore.isStudent">
            <br />
            <v-container>
              <!-- Add an accompanist to the performance -->
              <v-row>
                <v-col>
                  <v-select
                    :disabled="noAccompanist"
                    v-model="selectedAccompanist"
                    :items="accompanists"
                    item-text="fullName"
                    item-value="id"
                    label="Accompanist"
                  ></v-select>
                </v-col>
                <v-col cols="1">
                  <v-checkbox
                    v-model="noAccompanist"
                    label="None"
                    hide-details
                  ></v-checkbox>
                </v-col>
              </v-row>
              <!-- Select the instrument -->
              <v-row>
                <v-select
                  label="Instrument"
                  v-model="selectedInstrumentId"
                  :items="instruments"
                  item-text="instrument"
                  item-value="id"
                ></v-select>
              </v-row>
              <!-- Add songs to the performance -->
              <v-row>
                <v-card>
                  <v-data-table
                    :headers="songHeaders"
                    :items="allSongs"
                    show-select
                    v-model="selectedSongs"
                  >
                    <template v-slot:top>
                      <v-btn @click="selectSongsFromCurSem">
                        Select songs from current semester
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card>
              </v-row>
              <!-- Submit -->
              <v-row>
                <v-btn @click="studentSubmit"> Submit </v-btn>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
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

      <!-- Error while Loading -->
      <v-row v-else>
        <v-col class="text-center">
          <div class="text-h5">
            <strong>Error:</strong> Unable to load data for event with an id of
            {{ $route.params.eventId }}
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- Not Loaded -->
    <v-row v-else>
      <v-col class="text-center">
        <v-progress-circular indeterminate size="150" width="10">
          loading
        </v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import eventDS from "../services/EventDataService";
import songDS from "../services/SongDataService";
import PerformanceDS from "../services/PerformanceDataService";
import AvailabilityDS from "../services/AvailabilityDataService";
import UserDS from "../services/UserDataService";
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";

export default {
  name: "sign-up",
  data() {
    return {
      loaded: false,
      error: false,
      event: null,
      timeSlots: [],
      // calendar settings
      calAtts: {},
      selectedTime: null,
      instruments: [],
      selectedInstrumentId: null,
      selectedAccompanist: null,
      noAccompanist: false,
      songHeaders: [
        { text: "Title", value: "title" },
        { text: "Composer", value: "composer" },
      ],
      allSongs: [],
      selectedSongs: [],
      takenTimes: [],
      accompanists: [],
      availabilities: {},
      person1TimeSlots: [],
      person2TimeSlots: [],
      snackbar: false,
      text: "Please fill out all fields",
      timeout: 8000,
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  watch: {
    // these watch for changes in both data attributes and update the available time slots based on them
    selectedAccompanist(newAccompanist, oldAccompanist) {
      if (newAccompanist != oldAccompanist) {
        delete this.availabilities[oldAccompanist];
        this.processAvailability();
      }
      this.getEventAvailability(newAccompanist);
    },
    noAccompanist(newVal) {
      if (newVal) {
        delete this.availabilities[this.selectedAccompanist];
        this.processAvailability();
      } else {
        this.getEventAvailability(this.selectedAccompanist);
      }
    },
  },
  methods: {
    // Initialization Methods
    async initializeData() {
      // Get event data
      await eventDS
        .get(this.$route.params.eventId)
        .then((res) => {
          this.event = res.data;

          // Set calendar size
          let temp = this.event.startTime.split(":");
          let start = {
            hours: temp[0],
            minutes: temp[1],
          };
          temp = this.event.endTime.split(":");
          let end = {
            hours: temp[0],
            minutes: temp[1],
          };
          this.calAtts.fIndex = start.hours * 12 + start.minutes / 5;
          this.calAtts.iCount =
            end.hours * 12 + end.minutes / 5 - this.calAtts.fIndex;

          // Generate calendar time slots
          let startI = this.calAtts.fIndex;
          let count = 1;
          while (startI < this.calAtts.iCount + this.calAtts.fIndex) {
            this.timeSlots.push({
              name: `Time slot ${count}`,
              start: `${this.event.date}T${Math.floor(startI / 12)
                .toString()
                .padStart(2, "0")}:${((startI % 12) * 5)
                .toString()
                .padStart(2, "0")}`,
              end: `${this.event.date}T${Math.floor((startI + 1) / 12)
                .toString()
                .padStart(2, "0")}:${(((startI + 1) % 12) * 5)
                .toString()
                .padStart(2, "0")}`,
              // ,instructorAvailabile: false
              // ,accompanistAvailable: false
              // ,available: (this.instructorAvailabile && this.accompanistAvailable) || (this.instructorAvailabile && Object.keys(this.availabilities).length == 1)  //whether the timeslot is open or not
              available: true,
            });
            startI++;
            count++;
          }
        })
        .catch((e) => {
          console.log(e);
          this.error = true;
        });

      // Get user instrument list
      this.userStore.user.instruments.forEach((i) => {
        this.instruments.push(i);
      });

      // Get user song list
      if (this.userStore.isStudent) {
        await songDS
          .getAll()
          .then((res) => {
            this.allSongs = res.data
              .filter(
                (song) => song.studentId === this.userStore.user.student.id
              )
              .map((song) => {
                return {
                  id: song.id,
                  title: song.title,
                  composer: [
                    song.composer.fName,
                    song.composer.mName,
                    song.composer.lName,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  // ,semester: song.semester
                };
              });
          })
          .catch((e) => {
            console.log(e);
          });
      }

      //get accompanists
      await UserDS.getAccompanists()
        .then((res) => {
          this.accompanists = res.data;
          this.accompanists.forEach((a) => {
            a.fullName = a.fName + " " + a.lName;
          });
        })
        .catch((e) => console.log(e || "unknown error"));

      // get signup times that have already been taken for students only
      if (this.userStore.isStudent) {
        await PerformanceDS.getTakenTimes(this.$route.params.eventId)
          .then((res) => {
            res.data.forEach((p) => {
              this.takenTimes.push(p);
              this.takenTimes.forEach((t) => {
                var takenTime = this.timeSlots.find(
                  (ts) =>
                    ts.start.slice(-5) == t.startTime.substr(0, 5) &&
                    t.endTime.substr(0, 5) == ts.end.slice(-5)
                );
                takenTime.available = false;
              });
            });
          })
          .catch((e) => console.log(e));
      } else {
        this.takenTimes = this.takenTimes.map((t) => (t.available = true));
      }

      //get instructor availability
      if (this.userStore.isStudent) {
        this.getEventAvailability(this.userStore.user.student.instructorId);
      }

      //set up for edit
      if (this.$route.query.editing && this.userStore.isStudent) {
        await PerformanceDS.editPerformance(
          this.userStore.user.student.id,
          this.$route.params.eventId
        ).then((res) => {
          this.accompanist = res.data.accompanist
            ? res.data.accompanist
            : "none";
          this.studentId = res.data.studentId;
          this.instructorId = res.data.instructorId;
          this.selectedInstrumentId = res.data.instrument.id;
          this.selectedTime = this.timeSlots.find(
            (ts) =>
              ts.start.slice(-5) == res.data.startTime.substr(0, 5) &&
              ts.end.slice(-5) == res.data.endTime.substr(0, 5)
          );
          this.selectedTime.available = true;
          this.updateId = res.data.id;
          console.log(res.data);
          res.data.songs.forEach((s) => this.selectedSongs.push(s));
        });
      }
      this.loaded = true;
    },

    // Other Methods
    getEventColor(event) {
      if (this.selectedTime && this.selectedTime.name === event.name)
        return "secondary";
      if (!event.available) return "grey";
      return "primary";
    },

    // will be used for both faculty and accompanists, uid will be the user id of either an instructor or an accompanist
    async getEventAvailability(uid) {
      await AvailabilityDS.getForEvent(uid, this.event.id).then((res) => {
        res.data.forEach((a) => {
          if (!this.availabilities[a.userId]) {
            this.availabilities[a.userId] = [{ ...a }];
          } else {
            this.availabilities[a.userId].push({ ...a });
          }
        });
        this.processAvailability();
      });
    },
    timeRange(start, end) {
      return `${start.time.replace(/^0/, "")} ${
        start.hours < 12 ? "AM" : "PM"
      } - ${end.time.replace(/^0/, "")} ${end.hours < 12 ? "AM" : "PM"}`;
    },
    selectTimeSlot({ event: timeSlot }) {
      // allows students to select one time slot
      if (timeSlot.available) {
        if (this.userStore.isStudent) {
          this.selectedTime = timeSlot;
          // allows for faculty to select multiple time slots
        } else {
          timeSlot.available = false;
          console.log(timeSlot.name.split(" ").pop());
          this.selectedTime[timeSlot.name.split(" ").pop()] = timeSlot;
        }
        // support for removing time slots for faculty
      } else {
        if (!this.userStore.isStudent) {
          delete this.selectedTime[timeSlot.name.split(" ").pop()];
          timeSlot.available = true;
        }
      }
    },
    selectSongsFromCurSem() {
      this.allSongs.forEach((song) => {
        // let curSemester = "2023SP";
        if (
          /*song.semester == curSemester &&*/ !this.selectedSongs.includes(song)
        )
          this.selectedSongs.push(song);
      });
    },
    // filters array of timeslots to the times that are within the instructor and acompnaist availability
    // move the third loop to filter to available slots and if the time is not within
    processAvailability() {
      this.timeSlots.forEach((ts) => {
        ts.available = false;
        const slotStartTime = Date.parse(ts.start);
        const slotEndTime = Date.parse(ts.end);
        for (const time of Object.values(this.availabilities)[0]) {
          const startTime1 = Date.parse(this.event.date + " " + time.startTime);
          const endTime1 = Date.parse(this.event.date + " " + time.endTime);
          if (Object.keys(this.availabilities).length > 1) {
            for (const t2 of Object.values(this.availabilities)[1]) {
              const startTime2 = Date.parse(
                this.event.date + " " + t2.startTime
              );
              const endTime2 = Date.parse(this.event.date + " " + t2.endTime);
              if (
                this.timeWithin(
                  startTime1,
                  endTime1,
                  slotStartTime,
                  slotEndTime
                ) &&
                this.timeWithin(
                  startTime2,
                  endTime2,
                  slotStartTime,
                  slotEndTime
                )
              ) {
                ts.available = true;
                continue;
              }
              continue;
            }
          } else {
            if (
              this.timeWithin(startTime1, endTime1, slotStartTime, slotEndTime)
            ) {
              ts.available = true;
            }
          }
        }
      });
    },
    timeWithin(s1, e1, s2, e2) {
      return s2 >= s1 && e2 <= e1;
    },
    // Create new performance
    async studentSubmit() {
      if (this.selectedTime == null || this.selectedInstrumentId == null) {
        console.log("Fill in empty fields");
        this.snackbar = true;
        return;
      }

      if (this.$route.query.editing) {
        const data = {
          id: this.updateId,
          startTime: this.selectedTime.start.replace("T", " "),
          endTime: this.selectedTime.end.replace("T", " "),
          instrumentId: this.selectedInstrumentId,
        };
        await PerformanceDS.update(data.id, data)
          .then((res) => {
            console.log(res.data);
            console.log("perofrmance updated");
            this.$router.push({ name: "all-events" });
          })
          .catch((e) => {
            console.log("error updating performance: ", e);
          });
        this.selectedSongs.forEach(async (song) => {
          await PerformanceDS.addSong(data.id, song.id).catch((e) => {
            console.log(
              `Unable to add song "${song.title}" to the performance`
            );
            console.log(e);
          });
        });
        return false;
      }
      // submit data needs to be updated
      let data = {
        startTime: this.selectedTime.start.replace("T", " "),
        endTime: this.selectedTime.end.replace("T", " "),
        accompanist: this.noAccompanist ? "none" : this.accompanist,
        eventId: this.event.id,
        studentId: this.userStore.user.student.id,
        instructorId: this.userStore.user.student.instructorId,
        instrumentId: this.selectedInstrumentId,
      };

      // Create performance
      let performanceId = null;
      await PerformanceDS.create(data)
        .then((res) => {
          performanceId = res.data.id;
        })
        .catch((e) => {
          console.log("Unable to create performance");
          console.log(e);
        });

      // Stop if create failed
      if (performanceId == null) return;

      // Add performance songs
      this.selectedSongs.forEach(async (song) => {
        await PerformanceDS.addSong(performanceId, song.id).catch((e) => {
          console.log(`Unable to add song "${song.title}" to the performance`);
          console.log(e);
        });
      });

      console.log("Performance created");
      this.$router.push({ name: "home-page" });
    },
    async facultySubmit() {
      console.log("faculty submit");
      if (this.selectedTime.length == 0) {
        console.log("please select at least one time slot");
        return false;
      }
      const availabilities = this.combineConsecutive();
      availabilities.forEach(async (a) => {
        const data = {
          startTime: a.start.replace("T", " "),
          endTime: a.end.replace("T", " "),
          eventId: this.event.id,
          userId: this.userStore.user.id,
        };
        console.log(data);
        await AvailabilityDS.create(data)
          .then((res) => {
            console.log(
              "availability inserted. not sure what to do now",
              res.data
            );
          })
          .catch((e) => {
            console.log("error: ", e || "unknown");
          });
      });
      this.$router.push({ name: "home-page" });
    },
    combineConsecutive() {
      let timeSlots = [];
      let ts = {};
      Object.keys(this.selectedTime).forEach((key, index) => {
        if (index == 0) {
          ts = {
            start: this.selectedTime[key].start,
            end: this.selectedTime[key].end,
          };
        } else {
          if (key - Object.keys(this.selectedTime)[index - 1] == 1) {
            ts.end = this.selectedTime[key].end;
          } else {
            timeSlots.push(ts);
            ts = {
              start: this.selectedTime[key].start,
              end: this.selectedTime[key].end,
            };
          }
        }
      });
      timeSlots.push(ts);
      return timeSlots;
    },
  },
  mounted() {
    this.initializeData();
    if (this.userStore.isStudent) {
      this.selectedTime = null;
    } else {
      this.selectedTime = {};
    }
  },
};
</script>
