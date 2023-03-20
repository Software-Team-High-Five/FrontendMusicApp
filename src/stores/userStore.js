import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => {
        //user (id, fName, lName, email, student: {}, instruments: [{}], roles: [{}])
        return { user: {} };
    }
    ,getters: {
        name: (state) => state.user != null ? `${state.user.fName} ${state.user.lName}` : 'Error: user not initialized'
        ,isFaculty: (state) => state.user.roles.find(r => r.role === 'faculty') ? true : false
        ,isAdmin: (state) => state.user.roles.find(r => r.role === 'admin' ) ? true : false
        ,isAccompanist: (state) => state.user.roles.find(r => r.role === 'accompanist') ? true : false
        ,isStudent: (state) => state.user.roles.find(r => r.role === 'student') ? true : false
    }
    ,actions: {
        setUser(userData) {
            this.user = userData;
        }
    }
});