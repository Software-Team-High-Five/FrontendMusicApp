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
                                :first-interval="calAtts.fIndex"
                                :interval-count="calAtts.iCount"
                                :short-intervals="false"
                                @click:event="selectTimeSlot"
                                :event-color="getEventColor"
                                hide-header
                                style="max-height:600px"
                            >
                                <template v-slot:event="{ event, eventParsed }">
                                    <div class="pl-1 text-center">
                                        <strong>{{ event.name }}</strong><br>
                                        {{ timeRange(eventParsed.start, eventParsed.end) }}
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
                                    v-model="selectedInstrument"
                                    :items="instruments"
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
                            <!-- Delete later: testing only -->
                            <br>
                            {{ allSongs }}
                        </v-container>
                    </v-col>
                </v-row>
            </div>
            <!-- Error while Loading -->
            <v-row v-else>
                <v-col class="text-center"> 
                    <div class="text-h5">
                        <strong>Error:</strong> Unable to load data for event with an id of {{ $route.params.eventId }}
                    </div>
                </v-col>
            </v-row>
        </div>
        <!-- Not Loaded -->
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
import eventDS from '../services/EventDataService';
import songDS from '../services/SongDataService';
import studentDS from '../services/StudentDataService';

export default {
    name: 'sign-up'
    ,data() {
        return {
            loaded: false
            ,error: false

            ,student: {}
            ,event: null
            ,timeSlots: []
            // calendar settings
            ,calAtts: {}
            ,selectedTime: null
            ,instruments: []
            ,selectedInstrument: null
            ,accompanist: ""
            ,noAccompanist: false
            ,songHeaders: [
                { text: 'Title', value: 'title' }
                ,{ text: 'Composer', value: 'composer' }
            ]
            ,allSongs: []
            ,selectedSongs: []
        }
    }
    ,methods: {
        // Initialization Methods
        async initializeData() {
            // Load user id from local store
            this.student.id = 1;

            // Get event data
            await eventDS.get(this.$route.params.eventId)
                .then(res => {
                    this.event = res.data;

                    // Set calendar size
                    let temp = this.event.startTime.split(':');
                    let start = {
                        hours: temp[0]
                        ,minutes: temp[1]
                    };
                    temp = this.event.endTime.split(':');
                    let end = {
                        hours: temp[0]
                        ,minutes: temp[1]
                    };
                    this.calAtts.fIndex = start.hours * 12 + start.minutes / 5;
                    this.calAtts.iCount = end.hours * 12 + end.minutes / 5 - this.calAtts.fIndex;

                    // Generate calendar time slots
                    let startI = this.calAtts.fIndex;
                    let count = 1;
                    while (startI < this.calAtts.iCount + this.calAtts.fIndex)
                    {
                        this.timeSlots.push({
                            name: `Time slot ${count}`
                            ,start: `${this.event.date}T${Math.floor(startI / 12).toString().padStart(2, '0')}:${(startI % 12 * 5).toString().padStart(2, '0')}`
                            ,end: `${this.event.date}T${Math.floor((startI + 1) / 12).toString().padStart(2, '0')}:${((startI + 1) % 12 * 5).toString().padStart(2, '0')}`
                            ,available: true  //whether the timeslot is open or not
                        });
                        startI++;
                        count++;
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.error = true;
                });

            // Get user instrument list
            studentDS.get(this.student.id)
                .then(res => {
                    console.log(res.data);
                    this.instruments = res.data.instruments;
                })
                .catch(e => {
                    console.log(e);
                });

            // Get user song list
            await songDS.getAll()
                .then(res => {
                    this.allSongs = res.data.filter(song => song.studentId === this.student.id).map(song => {
                        return {
                            title: song.title
                            ,composer: [song.composer.fName, song.composer.mName, song.composer.lName].filter(Boolean).join(' ')
                            // ,semester: song.semester
                        };
                    });
                })
                .catch(e => {
                    console.log(e);
                });

            this.loaded = true;
        }

        // Other Methods
        ,getEventColor(event) {
            if (this.selectedTime && this.selectedTime.name === event.name)
                return "secondary";
            if (!event.available)
                return "grey"
            return "primary";
        }
        ,timeRange(start, end) {
            return `${start.time.replace(/^0/, '')} ${start.hours < 12 ? 'AM' : 'PM'} - ${end.time.replace(/^0/, '')} ${end.hours < 12 ? 'AM' : 'PM'}`;
        }
        ,selectTimeSlot({ event: timeSlot }) {
            if (timeSlot.available)
                this.selectedTime = timeSlot;
        }
        ,selectSongsFromCurSem() {
            this.allSongs.forEach((song) => {
                // let curSemester = "2023SP";
                if (/*song.semester == curSemester &&*/ !this.selectedSongs.includes(song))
                    this.selectedSongs.push(song);
            })
        }

        // Create new performance
        ,submit() {
            let data = {
                startTime: this.selectedTime.start
                ,endTime: this.selectedTime.end
                ,accompanist: this.accompanist
                ,eventId: this.event.id
                ,studentId: this.student.id
                ,instructorId: this.student.instructorId
                ,instrumentId: this.selectedInstrument.id
            };
            console.log(data);
            // Create performance
            // Add performance songs
        }
    }
    ,mounted() {
        this.initializeData();
    }
}
</script>
