<template>
  <div>
    <h1 class="mt-15 ml-16 text-blue" style="color:#03003f">OC Music Department</h1>
    <v-container class="mt-15">
      <v-row class="align-center">
        <v-col class="pa-5">
          <div class="card-button align-center" style="position:relative">
            <div>
              <h2 class="pa-5" style="color:#03003f">
                View all events
              </h2>
            </div>
            <div class="align-end" style="position:absolute; bottom:20px; left:20px;">
              <v-btn color="#03003f"
                elevation="5"
                style="color:#ffffff"
                href="/events"
                >
                Events                              
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col class="pa-5">
          <div class="card-button align-center" style="position:relative">
            <div>
              <h2 class="pa-5" style="color:#03003f">
                Create a new event
              </h2>
            </div>
            <div class="align-end" style="position:absolute; bottom:20px; left:20px">
              <v-btn color="#03003f"
                elevation="5"
                style="color:#ffffff"
                href="/newevent"
                >
                Create                              
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col class="pa-5">
          <div class="card-button align-center" style="position:relative">
            <div>
              <h2 class="pa-5" style="color:#03003f">
                Sign up for an event
              </h2>
            </div>
            <div class="align-end" style="position:absolute; bottom:20px; left:20px">
              <v-btn color="#03003f"
                elevation="5"
                style="color:#ffffff"
                href="/events/1/SignUp"
                >
                Sign up                              
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import cds from "../services/UserDataService";
//import VueModal from "@kouts/vue-modal";
//import "@kouts/vue-modal/dist/vue-modal.css";

// import sds from '../services/StudentDataService';
// import uds from '../services/UserDataService';

export default {
  name: "course-list",
  components: {
   
  },
  data() {
    return {
      courses: [],
      searchVal: "",
      currentCourse: {},
      editing: false,
      viewModal: false,
    };
  },
  methods: {
    fetchAll() {
      cds
        .getAll()
        .then((res) => {
          this.courses = res.data;
          console.log(this.courses);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addCourse() {
      var data = {
        courseNumber: this.currentCourse.courseNumber,
        name: this.currentCourse.name,
        department: this.currentCourse.department,
        level: this.currentCourse.level,
        hours: this.currentCourse.hours,
        description: this.currentCourse.description,
        createdAt: new Date().toLocaleString(),
      };
      cds
        .create(data)
        .then((response) => {
          console.log(response.data);
          this.fetchAll();
          this.cancelAction();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateCourse() {
      var data = { ...this.currentCourse };
      if (data.createdAt == null) {
        data.createdAt = "2023-01-01 00:00:00";
      }
      data.updatedAt = new Date().toLocaleString();
      cds
        .update(data.id, data)
        .then((response) => {
          console.log(response.data);
          this.fetchAll();
          this.cancelAction();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteCourse(id) {
      cds
        .delete(id)
        .then((response) => {
          console.log(response.data);
          this.fetchAll();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    showModal(id) {
      console.log(id);
      if (id) {
        this.currentCourse = this.courses.find((c) => c.id == id);
        this.editing = true;
        this.viewModal = true;
      } else {
        this.currentCourse = {
          courseNumber: "",
          name: "",
          department: "",
          description: "",
          level: null,
          hours: null,
        };
        this.viewModal = true;
      }
    },
    cancelAction() {
      this.currentCourse = {};
      this.editing = false;
      this.viewModal = false;
    },
  },
  computed: {
    coursesFiltered() {
      if (this.searhVal == "") {
        return this.courses;
      } else {
        return this.courses.filter(
          (c) =>
            c.courseNumber.indexOf(this.searchVal.toUpperCase()) > -1 ||
            c.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1
        );
      }
    },
  },
  mounted() {
    this.fetchAll();
    console.log(this.users);
    // console.log('users: ', this.users);
    // console.log('students: ', this.students);
  },
};
</script>

<style scoped>
.card-button{
  border-radius: 4px;
  border-style: solid;
  border-color:#070243;
  min-height: 300px;
  max-width: 350px;
  
}
</style>
