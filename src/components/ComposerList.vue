<template>
    <div>
        <v-container>
            <h1 class="mt-15 text-blue" style="color:#03003f" v-show="userStore.isAdmin">Composers</h1>
            <br>
            <div v-show="userStore.isAdmin">
            <h3 class="mt-5 text-blue" style="color:#03003f">Approved Composers</h3>
            <v-card>
                <v-card-title>
                    <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="composerHeaders"
                :items="composers"
                :search="search"
                :hide-defaut-footer="true"
                disable-pagination
                loading-text="Loading... Please Wait"
                class="elevation-1"
                >
                <template v-slot:[`item.actions`]="{item}">
                    <v-btn icon small class="mr-2" :to="{name: 'composer-edit', params: {id: item.id}}"><v-icon small>mdi-pencil</v-icon></v-btn>
                </template>
            </v-data-table>
            </v-card>
            <br>
            <h3 class="mt-5 text-blue" style="color:#03003f">Non-Approved Composers</h3>
            <v-card>
                <v-card-title>
                    <v-text-field
                    v-model="unapprovedSearch"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="composerHeaders"
                :items="unapprovedComposers"
                :search="unapprovedSearch"
                :hide-defaut-footer="true"
                disable-pagination
                loading-text="Loading... Please Wait"
                class="elevation-1"
                >
                <template v-slot:[`item.actions`]="{item}">
                    <v-btn color="primary" elevation="2" @click="approveComposer(item)">Approve</v-btn>
                    <v-btn icon small class="mr-2 ml-4" :to="{name: 'composer-edit', params: {id: item.id}}"><v-icon small>mdi-pencil</v-icon></v-btn>
                    <v-btn icon small class="mr-2 ml-4" @click="deleteComposer(item)"><v-icon small>mdi-delete</v-icon></v-btn>
                </template>
            </v-data-table>
            </v-card>
            </div>
        </v-container>
    </div>
</template>
<script>
import composerDS from '../services/ComposerDataService'
//import userDS from '../services/UserDataService';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default{
    name: 'user-list',
    computed: {
        ...mapStores(useUserStore)
    },
    data(){
        return{
            composerHeaders:[
                {
                    text: 'First Name',
                    value: 'fName',
                    sortable: 'true'
                },
                {
                    text: 'Middle Name',
                    value: 'mName',
                    sortable: 'true'
                },
                {
                    text: 'Last Name',
                    value: 'lName',
                    sortable: 'true'
                },
                {
                    text: 'Birth Date',
                    value: 'bDate',
                    sortable: 'false'
                },
                {
                    text: 'Death Date',
                    value: 'dDate',
                    sortable: 'false'
                },
                { 
                    text: "", 
                    value: "actions", 
                    sortable: false 
                }
            ],
            search:'',
            composers: [],
            composer: {},
            unapprovedComposers: [],
            unapprovedSearch:''
        } 
    },
    methods:{
         async approveComposer(c){
            this.composer = c
            console.log(this.composer)
            this.composer.isApproved = true
            console.log(this.composer)
            await composerDS.update(this.composer.id,
            {
                fName: this.composer.fName,
                mName: this.composer.mName,
                lName: this.composer.lName,
                bDate: this.composer.bDate,
                dDate: this.composer.dDate,
                isApproved: this.composer.isApproved
            })
            .then(() => {
                    console.log('Composer updated');
                })
                .catch(e => {
                    console.log(e);
                });
            this.getComposers()
        },
        async deleteComposer(c){
            this.composer = c
            await composerDS.delete(c.id)
            .then(() =>{
                console.log('Composer updated')
            })
            .catch(e => {
                console.log(e)
            })
            this.getComposers()
        },
        getComposers(){
            this.composers = []
            this.unapprovedComposers = []
            if(this.userStore.isAdmin){
            composerDS.getAll()
            .then(res =>{
                res.data.forEach(c => {
                    if(c.isApproved == 1){
                        this.composers.push({
                        id: c.id,
                        fName: c.fName,
                        mName: c.mName,
                        lName: c.lName,
                        bDate: c.bDate,
                        dDate: c.dDate,
                        isApproved: c.isApproved
                        // roles: u.roles.map(r => r.role).join(', '),
                        // instruments: u.instruments.map(i => i.instrument).join(', ')
                    })
                    }
                    else{
                        this.unapprovedComposers.push({
                        id: c.id,
                        fName: c.fName,
                        mName: c.mName,
                        lName: c.lName,
                        bDate: c.bDate,
                        dDate: c.dDate,
                        isApproved: c.isApproved
                        // roles: u.roles.map(r => r.role).join(', '),
                        // instruments: u.instruments.map(i => i.instrument).join(', ')
                    })
                    }
                    
                }
                 
                )
                console.log(this.unapprovedComposers)
                console.log(this.composer)
            })
            .catch(e => console.log(e))
        }
        }
    },
    mounted(){
        this.getComposers()
    }
}
</script>