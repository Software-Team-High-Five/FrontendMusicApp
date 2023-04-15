<template>
  <div v-if="loaded">
    <v-container class="body-1" v-if="loaded">
      <!-- Name -->
      <v-row>
        <v-col class="text-right py-0" cols="5">
          <strong>Name</strong>
        </v-col>
        <v-col class="py-0" cols="7">
          {{ userStore.name }}
        </v-col>
      </v-row>
      <!-- Email -->
      <v-row>
        <v-col class="text-right py-0" cols="5">
          <strong>Email</strong>
        </v-col>
        <v-col class="py-0" cols="7">
          {{ userStore.user.email }}
        </v-col>
      </v-row>
      <v-row><v-col></v-col></v-row>
      <!-- Major -->
      <v-row>
        <v-col class="text-right py-0" align-self="center" cols="5">
          <strong>Major</strong>
        </v-col>
        <v-col class="py-0" cols="7">
          {{ userStore.user.student.major }}
        </v-col>
      </v-row>
      <!-- Classification -->
      <v-row>
        <v-col class="text-right py-0" align-self="center" cols="5">
          <strong>Classification</strong>
        </v-col>
        <v-col class="py-0" cols="5">
          {{ userStore.user.student.classification }}
        </v-col>
      </v-row>
      <!-- Semester -->
      <v-row>
        <v-col class="text-right py-0" align-self="center" cols="5">
          <strong>Semester</strong>
        </v-col>
        <v-col class="py-0" cols="7">
          {{ userStore.user.student.semester }}
        </v-col>
      </v-row>
      <!-- Level -->
      <v-row v-if="userStore.user.student.level != 0">
        <v-col class="text-right py-0" align-self="center" cols="5">
          <strong>Vocal Level</strong>
        </v-col>
        <v-col class="py-0" cols="7">
          {{ userStore.user.student.level }}
        </v-col>
      </v-row>
      <!-- Instructor -->
      <v-row>
        <v-col class="text-right py-0" align-self="center" cols="5">
          <strong>Instructor</strong>
        </v-col>
        <v-col class="py-0" cols="7">
          {{ instructor }}
        </v-col>
      </v-row>
      <!-- Instruments -->
      <v-row>
        <v-col class="text-right py-0" cols="5">
          <strong>Instruments</strong>
        </v-col>
        <v-col class="py-0" cols="7">
          <div
            v-for="instrument in userStore.user.user_instruments"
            :key="instrument.instrumentId"
          >
            {{ instrument.instrument.instrument }}
          </div>
        </v-col>
      </v-row>
      <!-- Repertoire -->
      <v-row justify="center">
        <v-col cols="10">
          <v-data-table
            :headers="songHeaders"
            :items="allSongs"
            class="elevation-1"
          >
            <!-- Edit and Delete Buttons -->
            <template v-slot:[`item.actions`]="{ item: song }">
              <v-icon small class="mr-2" @click="openSongDialog(song, false)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="openDeleteDialog(song)">
                mdi-delete
              </v-icon>
            </template>
            <!-- Title Bar -->
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title class="body-1"
                  ><strong>Repertoire</strong></v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn @click="openSongDialog({}, true)"> Add </v-btn>
              </v-toolbar>
            </template>
            <!-- Displays if there is no data -->
            <template v-slot:no-data> You have no songs </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <!-- Repertoire Dialog Boxes -->
    <!-- Add/Edit Song Dialog Box -->
    <v-dialog v-model="songDialog" max-width="1000px">
      <v-card>
        <v-card-title>{{ addingSong ? "Add" : "Edit" }} Song</v-card-title>
        <v-card-text>
          <v-container class="body-1">
            <!-- Title -->
            <v-row>
              <v-col class="text-right py-0" align-self="center" cols="4">
                <strong>Title</strong>
              </v-col>
              <v-col class="py-0" cols="8">
                <v-text-field v-model="selectedSong.title" dense></v-text-field>
              </v-col>
            </v-row>
            <!-- Composer -->
            <v-row>
              <v-col class="text-right py-0" align-self="center" cols="4">
                <strong>Composer</strong>
              </v-col>
              <v-col class="py-0" cols="8">
                <v-select
                  v-model="selectedSong.composerId"
                  :items="allComposers"
                  item-text="name"
                  item-value="id"
                  dense
                ></v-select>
              </v-col>
            </v-row>
            <!-- Instrument -->
            <v-row>
              <v-col class="text-right py-0" align-self="center" cols="4">
                <strong>Instrument</strong>
              </v-col>
              <v-col class="py-0" cols="8">
                <v-select
                  v-model="selectedSong.instrumentId"
                  :items="userStore.user.user_instruments"
                  :item-text="instrument => instrument.instrument.instrument"
                  item-value="instrumentId"
                  dense
                ></v-select>
              </v-col>
            </v-row>
            <!-- Translation -->
            <v-row>
              <v-col class="text-right py-0" align-self="center" cols="4">
                <strong>Translation</strong>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="selectedSong.translation"
                  rows="6"
                  no-resize
                  outlined
                  dense
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <!-- Save/Cancel Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="addingSong ? addSong() : editSong()">
            {{ addingSong ? "Add" : "Save" }}
          </v-btn>
          <v-btn @click="songDialog = false"> Cancel </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete Song Dialog Box -->
    <v-dialog v-model="deleteDialog" max-width="700px">
      <v-card>
        <v-card-title
          >Are you sure you want to delete "{{
            this.selectedSong.title
          }}"?</v-card-title
        >
        <!-- Delete/Cancel Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteSong"> Delete </v-btn>
          <v-btn @click="deleteDialog = false"> Cancel </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { useUserStore } from "@/stores/userStore";
import { mapStores } from "pinia";
import userDS from "@/services/UserDataService";
import songDS from "@/services/SongDataService";
import composerDS from "@/services/ComposerDataService";

export default {
  name: "student-details",
  data() {
    return {
      loaded: false,
      instructor: "",
      songHeaders: [
        { text: "Title", value: "title" },
        { text: "Composer", value: "composer" },
        { text: "Instrument", value: "instrument.instrument" },
        // ,{ text: 'Semester', value: 'semester' }
        { text: "Actions", value: "actions", sortable: false },
      ],
      allSongs: [],
      selectedSong: {},
      songIndex: -1,
      addingSong: true,
      songDialog: false,
      deleteDialog: false,
      prevRoute: null,
      instruments: []
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    openSongDialog(song, songAction) {
      this.songIndex = this.allSongs.indexOf(song);
      this.selectedSong = Object.assign({}, song);
      this.addingSong = songAction;
      this.songDialog = true;
    },
    openDeleteDialog(song) {
      this.songIndex = this.allSongs.indexOf(song);
      this.selectedSong = Object.assign({}, song);
      this.deleteDialog = true;
    },
    addSong() {
      songDS
        .create({
          title: this.selectedSong.title,
          translation: this.selectedSong.translation,
          composerId: this.selectedSong.composerId,
          instrumentId: this.selectedSong.instrumentId,
          // ,semesterId: this.selectedSong.semesterId
          studentId: this.userStore.user.id,
        })
        .then((res) => {
          let song = res.data;
          song.composer = this.allComposers.find(
            (c) => c.id == song.composerId
          ).name;
          song.instrument = this.userStore.user.user_instruments.find(
            (i) => i.instrumentId == res.data.instrumentId
          ).instrument;
          this.allSongs.push(song);
          this.songDialog = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editSong() {
      songDS
        .update(this.selectedSong.id, {
          title: this.selectedSong.title,
          translation: this.selectedSong.translation,
          composerId: this.selectedSong.composerId,
          instrumentId: this.selectedSong.instrumentId,
          // ,semesterId: this.selectedSong.semesterId
        })
        .then(() => {
          this.selectedSong.composer = this.allComposers.find(
            (c) => c.id == this.selectedSong.composerId
          ).name;
          this.selectedSong.instrument = this.userStore.user.user_instruments.find(
            (i) => i.instrumentId == this.selectedSong.instrumentId
          ).instrument;
          Object.assign(this.allSongs[this.songIndex], this.selectedSong);
          this.songDialog = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteSong() {
      songDS
        .delete(this.selectedSong.id)
        .then(() => {
          this.allSongs.splice(this.songIndex, 1);
          this.deleteDialog = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    // Get the instructor
    let instructorPromise;
    if (this.userStore.user.student.instructorId != null) {
      instructorPromise = userDS
        .get(this.userStore.user.student.instructorId)
        .then((res) => {
          this.instructor = `${res.data.fName} ${res.data.lName}`;
        })
        .catch((e) => {
          console.log(e);
          this.instructor = "Error: not found";
        });
    }
    else {
      // if no instructor is assigned, use an empty string and promise
      this.instructor = "";
      instructorPromise = Promise.resolve();
    }
    // Get the student's songs
    let songsPromise = songDS
      .getAll()
      .then((res) => {
        this.allSongs = res.data
          .filter((song) => song.studentId === this.userStore.user.id)
          .map((song) => {
            song.composer = [
              song.composer.fName,
              song.composer.mName,
              song.composer.lName,
            ]
              .filter(Boolean)
              .join(" ");
            song.instrument = this.userStore.user.user_instruments.find(
              (i) => i.instrumentId == song.instrumentId
            ).instrument;
            return song;
          });
      })
      .catch((e) => {
        console.log(e);
      });
    // Get the composers
    let composersPromise = composerDS
      .getAll()
      .then((res) => {
        this.allComposers = res.data.map((composer) => {
          return {
            id: composer.id,
            name: [composer.fName, composer.mName, composer.lName]
              .filter(Boolean)
              .join(" "),
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
    // Mark page as loaded when all data is loaded
    Promise.all([instructorPromise, songsPromise, composersPromise])
      .then(() => {
        this.loaded = true;
      })
      .catch(() => {
        console.log(
          "Unable to display page because of 1 or more errors while loading data"
        );
      });
  }
};
</script>
