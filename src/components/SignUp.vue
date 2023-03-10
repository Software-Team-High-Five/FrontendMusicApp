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
import PerformanceDS from '../services/PerformanceDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default {
    name: 'sign-up'
    ,data() {
        return {
            loaded: false
            ,error: false

            ,event: null
            ,timeSlots: []
            // calendar settings
            ,calAtts: {}
            ,selectedTime: null
            ,instruments: []
            ,selectedInstrumentId: null
            ,accompanist: ""
            ,noAccompanist: false
            ,songHeaders: [
                { text: 'Title', value: 'title' }
                ,{ text: 'Composer', value: 'composer' }
            ]
            ,allSongs: []
            ,selectedSongs: []
            ,takenTimes: []
        }
    }
    ,computed: {
        ...mapStores(useUserStore),
    }
    ,methods: {
        // Initialization Methods
        async initializeData() {
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
            if(this.userStore.user.student) {          
                await studentDS.get(this.userStore.user.student.id)
                .then(res => {
                    this.instruments = res.data.instruments;
                })
                .catch(e => {
                    console.log(e);
                });
            
            
            // Get user song list
                await songDS.getAll()
                    .then(res => {
                        this.allSongs = res.data.filter(song => song.studentId === this.userStore.user.student.id).map(song => {
                            return {
                                id: song.id
                                ,title: song.title
                                ,composer: [song.composer.fName, song.composer.mName, song.composer.lName].filter(Boolean).join(' ')
                                // ,semester: song.semester
                            };
                        });
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
            // get signup times that have already been taken
            await PerformanceDS.getTakenTimes(this.$route.params.eventId)
            .then(res => {
                res.data.forEach(p => {
                    this.takenTimes.push(p);
                    this.takenTimes.forEach(t => {
                        var takenTime = this.timeSlots.find(ts => (ts.start.slice(-5) == t.startTime.substr(0, 5) && t.endTime.substr(0, 5) == ts.end.slice(-5)))
                        takenTime.available = false;
                    })
                    
                });
            })
            .catch(e => console.log(e))

            //set up for edit
            if(this.$route.query.editing && this.userStore.user.student){
                await PerformanceDS.editPerformance(this.userStore.user.student.id, this.$route.params.eventId)
                .then(res => {
                    this.accompanist = res.data.accompanist ? res.data.accompanist : 'none';
                    this.studentId = res.data.studentId;
                    this.instructorId = res.data.instructorId;
                    this.selectedInstrumentId = res.data.instrument.id;
                    this.selectedTime = this.timeSlots.find(ts => (ts.start.slice(-5) == res.data.startTime.substr(0, 5) && ts.end.slice(-5) == res.data.endTime.substr(0, 5)));
                    this.selectedTime.available = true;
                    this.updateId = res.data.id
                    console.log(res.data);
                    res.data.songs.forEach(s => this.selectedSongs.push(s));
                })
            }
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
        ,async submit() {
            if (this.selectedTime == null || this.selectedInstrumentId == null) {
                console.log("Fill in empty fields");
                return;
            }

            if(this.$route.query.editing) {
                const data = {
                    id: this.updateId
                    ,startTime: this.selectedTime.start.replace("T", " ")
                    ,endTime: this.selectedTime.end.replace("T", " ")
                    ,instrumentId: this.selectedInstrumentId
                }
                await PerformanceDS.update(data.id, data)
                    .then(res => {
                        console.log(res.data);
                        console.log('perofrmance updated');
                        this.$router.push({ name: 'all-events'});
                    })
                    .catch(e => {
                        console.log('error updating performance: ', e);
                    })
                    this.selectedSongs.forEach(async (song) => {
                        await PerformanceDS.addSong(data.id, song.id)
                            .catch((e) => {
                                console.log(`Unable to add song "${song.title}" to the performance`);
                                console.log(e);
                            });
                    });
                return false;
            }
            // submit data needs to be updated
            let data = {
                startTime: this.selectedTime.start.replace("T", " ")
                ,endTime: this.selectedTime.end.replace("T", " ")
                ,accompanist: this.noAccompanist ? 'none' : this.accompanist
                ,eventId: this.event.id
                ,studentId: this.userStore.user.student.id
                ,instructorId: this.userStore.user.student.instructorId
                ,instrumentId: this.selectedInstrumentId
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
            if (performanceId == null)
                return;

            // Add performance songs
            this.selectedSongs.forEach(async (song) => {
                await PerformanceDS.addSong(performanceId, song.id)
                    .catch((e) => {
                        console.log(`Unable to add song "${song.title}" to the performance`);
                        console.log(e);
                    });
            });

            console.log('Performance created');
            this.$router.push({ name: 'home-page' });
        }
        
    }
    ,mounted() {
        this.initializeData();
    }
}
</script>
