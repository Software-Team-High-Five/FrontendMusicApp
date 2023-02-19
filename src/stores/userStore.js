import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => {
        //user (id, role, fName, lName, email)
        return { user: {} };
    }
    ,getters: {
        name: (state) => state.user != null ? `${state.user.fName} ${state.user.lName}` : 'Error: user not initialized'
        ,isFaculty: (state) => state.user.role === 'faculty'
        ,isAdmin: (state) => state.user.role === 'admin'
    }
    ,actions: {
        setUser(userData) {
            this.user = userData;
        }
    }
});