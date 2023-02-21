<template>
    <div>
        <br><br><br>
        <h3 style="text-align: left">
            Create a New Performance
        </h3>
        <v-col></v-col>
        <v-col class="col-md">
            <v-card>
                <br>
                <v-col class="col-md-15">
                    <v-select
                        label="Select a performance type"
                        :items="eventType"
                        v-model="event.type"
                    ></v-select>
                </v-col>
                <div v-show="event.type">
                    <v-col class="col-md-15">
                        <v-row>
                            <v-text-field
                                v-model="event.name"
                                label="Name"
                            ></v-text-field>
                        </v-row>
                    </v-col>
                    <!-- date picker -->
                    <div>
                        <v-col class="col-md-15">
                            <v-menu
                                ref="dateMenu"
                                v-model="dateMenu"
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
                                        hint="YYYY-MM-DD format"
                                        persistent-hint
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="event.date"
                                    no-title
                                    @input="dateMenu = false"
                                    :allowed-dates="disablePastDates"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                    </div>
                    <!-- time pickers -->
                    <br>
                    <v-col class="col-md-15">
                        <v-row>
                            <v-col cols="11" sm="5" style="width: 50%; justify-content: center;">
                                <v-menu
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
                                        format="ampm"
                                        full-width
                                        @click:minute="$refs.timeMenu1.save(event.startTime)"
                                    ></v-time-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="11" sm="5" style="width: 50%; justify-content: center;">
                                <v-menu
                                    ref="timeMenu2"
                                    v-model="timeMenu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="event.endTime"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px">
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
                                        format="ampm"
                                        full-width
                                        @click:minute="$refs.timeMenu2.save(event.endTime)"
                                    ></v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-row>
                        <v-col class="col-md-15">
                            <v-row> &nbsp;
                                <v-col>
                                    <v-checkbox
                                        v-model="event.openForSignup"
                                        label="Open For Signup"
                                        hide-details
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col></v-col>
                        <v-col></v-col>
                    </v-row>
                    <v-row class="col-md-15">
                        <v-col>
                            <button
                                class="btn btn-danger"
                                @click="clearEvent()"
                                style="width: 100%; padding-left: 10px; margin-left: 10px;"
                            >Cancel</button>
                        </v-col>
                        <v-col>
                            <button
                                class="btn btn-success"
                                @click="createEvent()"
                                style="width: 100%; padding-right: 10px; margin-right: 10px;"
                            >Create Event</button>
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </v-col>
        <v-col></v-col>
    </div>
</template>

<script>
import eds from '../services/EventDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default {
    name: 'new-event'
    ,data() {
        return {
            eventType: [
                'Recital Hearing'
                ,'Jury'
                ,'Audition'
            ]
            ,event: {
                date: ''
                ,name: ''
                ,type: ''
                ,startTime: ''
                ,endTime: ''
                ,openForSignup: 0
            }
            ,today: null
            ,dateMenu: 0
            ,timeMenu1: 0
            ,timeMenu2: 0
        }
    }
    ,methods: {
        disablePastDates(val) {
            return val >= this.today;
        }
        ,createEvent() {
            if( this.eventIncomplete() ){
                return false;
            }
            eds.create({...this.event})
                .then(res => {
                    console.log(res.data); 
                    this.clearEvent();
                    this.$router.push({ name: 'all-events' });
                })
                .catch(e => {
                    console.log(e)
                })
        }
        ,clearEvent() {
            this.event = {
                date: ''
                ,type: ''
                ,name: ''
                ,startTime: ''
                ,endTime: ''
                ,openForSignup: 0
            }
            this.dateMenu = 0;
            this.timeMenu1 = 0;
            this.timeMenu2 = 0;
        }
        ,eventIncomplete() {
            return !(!Object.values(this.event).find(e => !e));
        }
    }
    ,computed: { ...mapStores(useUserStore) }
    ,mounted() { 
        this.today = new Date().toISOString().substring(0, 10);
    }
}
</script>

<style>

</style>