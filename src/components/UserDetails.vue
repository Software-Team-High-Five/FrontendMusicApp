<template>
    <div>
        <v-container class="body-1">
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
            <!-- Instruments -->
            <v-row>
                <v-col class="text-right py-0" cols="5">
                    <strong>Instruments</strong>
                </v-col>
                <v-col class="py-0" cols="7">
                    <div v-for="instrument in userStore.user.instruments" :key="instrument.id">
                        {{ instrument.instrument }}
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default {
    name: 'user-details'
    ,computed: {
        ...mapStores(useUserStore)
    }
}
</script>