<template>
    <v-container>
        <v-row>
            <v-col>
                <h1 class="text-center">Sign Up Page</h1>
            </v-col>
        </v-row>
        <div v-if="loaded">
            <v-row :align="'center'">
                <v-col style="width:min-content">
                    <h4 class="text-right">Event Details</h4>
                </v-col>
                <v-col style="width:min-content">
                    <div><span class="font-weight-medium">Type:</span> {{ event.type }}</div>
                    <div><span class="font-weight-medium">Date:</span> {{ event.date }}</div>
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
                            :first-interval="calendarSettings.firstInterval"
                            :interval-count="calendarSettings.intervalCount"
                            :short-intervals="false"
                            @click:event="selectTimeSlot"
                            :event-color="getEventColor"
                            hide-header
                            style="max-height:600px"
                        >
                            <template v-slot:event="{ event }">
                                <div class="pl-1 text-center">
                                    <strong>{{ event.name }}</strong><br>
                                    {{ timeRange(event.start, event.end) }}
                                </div>
                            </template>
                        </v-calendar>
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
        </div>
        <v-row v-else>
            <v-col class="text-center">
                <v-progress-circular
                    indeterminate
                    size="150"
                    width="10"
                >
                    loading
                </v-progress-circular>
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
            loaded: false
            ,event: null
            ,timeSlots: []
            ,calendarSettings: {}
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
                    ,date: '2023-02-31'
                    ,type: 'Recital Hearing'
                    ,startTime: '8:40:00'
                    ,endTime: '10:30:00'
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
    ,methods: {
        // Initialization Methods
        initializeData() {
            this.event = this.testData.event;
            this.setCalendarSize();
            this.generateTimeSlots();
            this.generateSongList();
        }
        ,setCalendarSize() {
            let temp = this.testData.event.startTime.split(':');
            let start = {
                hours: temp[0]
                ,minutes: temp[1]
            };
            temp = this.testData.event.endTime.split(':');
            let end = {
                hours: temp[0]
                ,minutes: temp[1]
            };
            this.calendarSettings.firstInterval = start.hours * 12 + start.minutes / 5;
            this.calendarSettings.intervalCount = end.hours * 12 + end.minutes / 5 - this.calendarSettings.firstInterval;
        }
        ,generateTimeSlots() {
            let time = this.calendarSettings.firstInterval;
            let count = 1;
            while (time < this.calendarSettings.intervalCount + this.calendarSettings.firstInterval)
            {
                this.timeSlots.push({
                    name: `Time slot ${count}`
                    ,start: `${this.event.date}T${Math.floor(time / 12).toString().padStart(2, '0')}:${(time % 12 * 5).toString().padStart(2, '0')}`
                    ,end: `${this.event.date}T${Math.floor((time + 1) / 12).toString().padStart(2, '0')}:${((time + 1) % 12 * 5).toString().padStart(2, '0')}`
                    ,available: true
                });
                time++;
                count++;
            }
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

        //Other Methods
        ,getEventColor(event) {
            if (this.selectedTime && this.selectedTime.name === event.name)
                return "secondary";
            if (!event.available)
                return "grey"
            return "primary";
        }
        ,timeRange(start, end) {
            let startTime = new Date(start);
            let endTime = new Date(end);
            let val = `${(startTime.getHours() - 1) % 12 + 1}:${startTime.getMinutes()} ${startTime.getHours() < 12 ? 'AM' : 'PM'}`;
            val += ` - ${(endTime.getHours() - 1) % 12 + 1}:${endTime.getMinutes()} ${endTime.getHours() < 12 ? 'AM' : 'PM'}`;
            return val;
        }
        ,selectTimeSlot({ event }) {
            if (event.available)
                this.selectedTime = event;
        }
        ,selectSongsFromCurSem() {
            this.allSongs.forEach((song) => {
                // let curSemester = "2023SP";
                if (/*song.semester == curSemester &&*/ !this.selectedSongs.includes(song))
                    this.selectedSongs.push(song);
            })
        }
        ,submit() {
            // Calculate the start and end time
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
        this.loaded = true;
    }
}
</script>
