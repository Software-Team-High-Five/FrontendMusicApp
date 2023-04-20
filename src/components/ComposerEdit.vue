<template>
    <v-container class="body-1" v-if="loaded">
        <!-- fName -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>First Name</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="composer.fName"
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
        <!-- mName -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Middle Name</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="composer.mName"
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
       
        <!-- Major -->
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Last Name</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="composer.lName"
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Birth Date</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="composer.bDate"
                    hint="yyyy-mm-dd"
                    persistant-hint
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left py-0" align-self="center" cols="4">
                <strong>Death Date</strong>
            </v-col>
            <v-col class="py-0" cols="8">
                <v-text-field
                    v-model="composer.dDate"
                    hint="yyyy-mm-dd"
                    persistant-hint
                    dense
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row class="mx-12">
            <v-btn @click="Save">
                Save Changes
            </v-btn>
        </v-row>
    </v-container>
</template>
<script>
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';
import composerDS from '@/services/ComposerDataService';

export default {
    name: 'composer-edit'
    ,data() {
        return {
            composer: {}
            ,loaded: false
        };
    }
    ,computed: {
        ...mapStores(useUserStore)
    }
    ,methods: {
        async Save() {
            // Update general student data
            await composerDS.update(this.composer.id,
                {
                    fName: this.composer.fName
                    ,mName: this.composer.mName
                    ,lName: this.composer.lName
                    ,bDate: this.composer.bDate
                    ,dDate: this.composer.dDate
                })
                .then(() => {
                    this.$router.push({name: 'composer-list'});
                })
                .catch(e => {
                    console.log(e);
                });

        }
    }
    ,async mounted() {
        // Get the composer's data
        let composerPromise = composerDS.get(this.$route.params.id)
            .then(res => {
                this.composer = {
                    id: res.data.id
                    ,fName: res.data.fName
                    ,mName: res.data.mName
                    ,lName: res.data.lName
                    ,bDate: res.data.bDate
                    ,dDate: res.data.dDate
                };
                console.log(this.composer)
            })
            .catch(e => {
                console.log(e);
            });
       
        await composerPromise;
        
        this.loaded = true;
    }
}
</script>