<template>
    <div>
        <br><br><br>
        <h3 style="text-align: left">
            Create a New Performance
        </h3>
        <v-card>
            <br>
            <v-select
            label="Select a performance type"
            :items="eventType"
            v-model="type"
        ></v-select>
        <div v-show="type">
            <!-- date picker -->
            <div>
                <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="event.date"
                        label="Date"
                        hint="MM/DD/YYYY format"
                        persistent-hint
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="event.date"
                        no-title
                        @input="menu1 = false"
                        :allowed-dates="disablePastDates"
                    ></v-date-picker>
                          </v-menu>
            </div>
            <!-- time pickers -->
            <v-row>
                <v-col cols="11" sm="5">
                    <input 
                        v-model="event.startTime"
                        placeholder="Start Time(3:15 PM) "
                        type="text"
                   />
                </v-col>
                <v-col>
                    <input 
                        v-model="event.endTime"
                        placeholder="End Time(3:15 PM) "
                        type="text"
                   />
                    
                    <!-- <v-menu
                        ref="timeMenu1"
                        v-model="timeMenu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="event.startTime"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            v-model="event.startTime"
                            label="Start Time"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-time-picker
                            v-if="timeMenu1"
                            v-model="event.startTime"
                            full-width
                            @click:minute="$refs.timeMenu1.save(event.startTime)"
                        ></v-time-picker>
                    </v-menu>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="11" sm="5">
                    <v-menu
                    ref="timeMenu2"
                    v-model="timeMenu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="event.endTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        v-model="event.endTime"
                        label="End Time"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-time-picker
                        v-if="timeMenu2"
                        v-model="event.endTime"
                        full-width
                        @click:minute="$refs.timeMenu2.save(event.endTime)"
                    ></v-time-picker>
                    </v-menu> -->
                </v-col>
            </v-row>
            <v-row>
                <input 
                v-model="event.openForSignup"
                type="checkbox"
                name="openForSignup"/>
                <label for="openForSignup">Open for signup</label>

            </v-row>
            <v-row>
                <v-col>
                    <v-btn
                        color="error"
                        @click="clearEvent()"
                    >Cancel</v-btn>
                </v-col>
                <v-col>
                    <v-btn
                        color="success"
                        @click="createEvent()"
                    >Create Event</v-btn>
                </v-col>
            </v-row>
        </div>
        </v-card>
    </div>
</template>

<script>
import eds from '../services/EventDataService';

export default {
    name: 'new-event'
    ,data() {
        return {
            hello: 'hello new event'
            ,eventType: [
                'Recital Hearing'
                ,'Jury'
                ,'Auditiion'
            ]
            ,event: {
                date: ''
                ,type: ''
                ,startTime: ''
                ,endTime: ''
                ,openForSignup: null
            }
            ,type: null
            ,menu1: false
            ,today: null
            // ,time1: null
            // ,time2: null
            // ,timeMenu1: false
            // ,timeMenu2: false
        }
    }
    ,methods: {
        disablePastDates(val) {
            return val >= this.today;
        }
        ,createEvent() {
            eds.create({...this.event})
                .then(res => {
                    console.log(res.data); 
                    console.log('event created successfully');
                    this.clearEvent();
                    this.$router.push({ name: 'home-page' });
                })
                .catch(e => {
                    console.log(e)
                })
        }
        ,clearEvent() {
            this.event = {
                date: ''
                ,type: ''
                ,startTime: ''
                ,endTime: ''
                ,openForSignup: null
            }
        }
        ,eventFilledOut() {

        }
    }
    ,computed: { }
    ,mounted() { 
        this.today = new Date().toISOString().substring(0, 10)
     }
}
</script>

<style>

</style>