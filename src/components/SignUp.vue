<template>
    <v-container>
        <v-row>
            <v-col>
                <!--Event is already selected-->
                <h1 class="text-center">Sign Up Page</h1>
                <h2 class="text-center">Event Details</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!--Select a time slot-->
                <!--Calculate the start and end time-->
                <h4 class="text-center">Select a time slot</h4>
                <v-card>
                    <v-calendar
                        type="day"
                    ></v-calendar>
                </v-card>
            </v-col>
            <v-col>
                <br>
                <v-container>
                    <!-- Add an accompanist to the performance -->
                    <v-row>
                        <v-col>
                            <v-text-field
                                :disabled="noAccompanist"
                                v-model="accompanist"
                                label="Accompanist"
                            ></v-text-field>
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
                            v-model="instrument"
                            :items="testData.instruments"
                            item-text="instrument"
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
                                    <v-btn
                                        @click="selectSongsFromCurSem"
                                    >
                                        Select songs from current semester
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-row>
                    <!-- Submit -->
                    <v-row>
                        <v-btn @click="submit">
                            Submit
                        </v-btn>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
// import songDS from '../services/SongDataService';

export default {
    name: 'sign-up'
    ,data() {
        return {
            event: null
            ,timeSlots: null
            ,selectedTime: null
            ,instrument: null
            ,accompanist: ""
            ,noAccompanist: false
            ,songHeaders: [
                { text: 'Title', value: 'title' }
                ,{ text: 'Composer', value: 'composer' }
            ]
            ,allSongs: []
            ,selectedSongs: []

            ,testData: {
                user: {
                    id: 0
                    ,fname: 'Lucas'
                    ,lname: 'Ewald'
                    ,role: 'student'
                    ,email: 'lucas@ewald.edu'
                }
                ,studentId: 0
                ,songData: [ {
                        songId: 0
                        ,studentId: 0
                        ,composerId: 1
                        ,instrumentId: 3
                        ,title: 'Flow'
                        ,translation: null

                        ,fName: 'Carlos'
                        ,mName: 'G'
                        ,lName: 'Eiene'
                        ,bDate: '2000-01-01'
                        ,dDate: null
                    }
                ]
                ,event: {
                    id: 0
                    ,date: '2023-01-31'
                    ,type: 'Recital Hearing'
                    ,startTime: '15:40:00'
                    ,endTime: '16:30:00'
                    ,openForSignup: false
                }
                ,instruments: [
                    {
                        id: 0,
                        instrument: 'soprano'
                    }
                    ,{
                        id: 1,
                        instrument: 'alto'
                    }
                    ,{
                        id: 2,
                        instrument: 'tenor'
                    }
                    ,{
                        id: 3,
                        instrument: 'bass'
                    }
                ]
            }
        }
    }
    ,computed: {

    }
    ,methods: {
        initializeData() {
            this.event = this.testData.event;
            this.generateTimeSlots();
            this.generateSongList();
            console.log(this.allSongs)
        }
        ,generateTimeSlots() {

        }
        ,generateSongList() {
            this.testData.songData.forEach((song) => {
                this.allSongs.push({
                    title: song.title
                    ,composer: [song.fName, song.mName, song.lName].filter(Boolean).join(' ')
                    // ,semester: song.semester
                });
            })
        }
        ,selectSongsFromCurSem() {
            this.allSongs.forEach((song) => {
                // let curSemester = "2023SP";
                if (/*song.semester == curSemester &&*/ !this.selectedSongs.includes(song))
                    this.selectedSongs.push(song);
            })
        }
        ,submit() {
            let data = {
                startTime: null
                ,endTime: null
                ,accompanist: null
                ,eventId: null
                ,studentId: null
                ,userId: null
                ,instructorId: null
                ,instrumentId: null
            };
            console.log(data);
        }
    }
    ,mounted() {
        this.initializeData();
        // this.$route.params.eventId
        // songDS.getAll()//where studentId = tempUserId
        //     .then((res) => {
        //         this.allSongs = res.data;
        //         console.log(this.allSongs);
        //     })
        //     .catch((e) => {
        //         console.log(e);
        //     });
    }
}
</script>
