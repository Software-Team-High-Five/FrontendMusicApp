<template>
  <div class="list-row">
    <br>
    <div class="col-md-1"></div>
    <div class="col-md-8 sticky-top" style="margin: 10px; padding: 10px;">
      <div class="input-group mb-3">
        <input 
          type="text"
          class="form-control"
          placeholder="search by name or course number"
          v-model="searchVal"
        /> <p></p>
        <button @click="searchVal=''" style="margin-right: 10px; border-radius: 4px;" class="btn btn-dark">Clear Search</button>
        <button @click="showModal(null)" style="margin-left: 10px; border-radius: 4px;" class="btn btn-dark">Add Course</button>

      </div>
    </div>
    <div class="col-md" style="border-radius: 5px; padding: 10px; margin: 10px;">
      <h4 style="text-align: center;"> Courses </h4>
      <div class="card">
        <table class="table">
          <thead class="" style="background-color: #f2f3f4;">
            <tr>
              <th scope="col">Course Number</th>
              <th scope="col">Name</th>
              <th scope="col">Level</th>
              <th scope="col">Hours</th>
              <th scope="col">Description</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr 
              class="table-group-item"
              v-for="(course, index) in coursesFiltered"
              :key="index"
            >
              <td>{{ course.courseNumber }}</td>
              <td class="cell">{{ course.name }}</td>
              <td>{{ course.level }}</td>
              <td>{{ course.hours }}</td>
              <td class="cell">{{ course.description }}</td>
              <td><button class="btn btn-outline-warning" @click="showModal(course.id)">edit</button></td>
              <td><button class="btn btn-outline-danger" @click="deleteCourse(course.id)">delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-1"></div>
    <!--  course edit/add popup -->
    <div>
      <Modal v-model="viewModal" title="Edit Course">
        <div class="form-group justify-content-evenly"><br>
          <label for="name">Course Name</label>
          <input 
            class="form-control"
            id="name"
            type="text"
            v-model="currentCourse.name"
            name="name"
            placeholder="A short name for the course"
            required
          />
        </div>
        <div class="form-group justify-content-evenly"><br>
          <label for="courseNumber">Course Number</label>
          <input 
            class="form-control"
            id="courseNumber"
            type="text"
            v-model="currentCourse.courseNumber"
            name="courseNumber"
            placeholder="xxxx-0000"
            required
          />
        </div>
        <div class="form-group justify-content-evenly"><br>
          <label for="department">Department</label>
          <input 
            class="form-control"
            id="department"
            type="text"
            v-model="currentCourse.department"
            name="department"
            placeholder="ACCT, CMSC, BUSS, BIBL, etc..."
            required
          />
        </div>
        <div class="form-group justify-content-evenly"><br>
          <label for="hours">Hours</label>
          <input 
            class="form-control"
            id="hours"
            type="number"
            v-model="currentCourse.hours"
            name="number"
            placeholder="1, 3, 4, etc..."
            required
          />
        </div>
        <div class="form-group justify-content-evenly"><br/>
          <label for="level">Level</label>
          <input 
            class="form-control"
            id="level"
            type="number"
            v-model="currentCourse.level"
            name="level"
            placeholder="0, 3, 4, etc..."
            required
          />
        </div>
        <div class="form-group justify-content-evenly"><br/>
          <label for="description">Description</label>
          <textarea
            class="form-control"
            name="description"
            v-model="currentCourse.description"
            placeholder="Please give a detailed description of the course"
            rows="4"
            required
          ></textarea>
        </div>
        <br>
        <div class="row">
          <div class="col col-left">
            <button class="btn btn-dark btn-center" @click="cancelAction()">Cancel</button>
          </div>
          <div class="col col-right">
            <button class="btn btn-success" @click="editing ? updateCourse() : addCourse()">{{ editing ? 'Update' : 'Add Course' }}</button>
          </div>
        </div>
      </Modal>
    </div>

  </div>
</template>

<script>
import cds from '../services/CourseDataService';
import VueModal from '@kouts/vue-modal';
import '@kouts/vue-modal/dist/vue-modal.css'; 

// import sds from '../services/StudentDataService';
// import uds from '../services/UserDataService';

export default {
  name: 'course-list'
  ,components: {
    'Modal' : VueModal
  }
  ,data() {
    return {
      courses: []
      ,searchVal: ''
      ,currentCourse: {}
      ,editing: false
      ,viewModal: false
      // ,users: []
      // ,students: []
    }
  }
  ,methods: {
    fetchAll() {
      cds.getAll()
      .then((res) => {
        this.courses = res.data;
        console.log(this.courses);
      })
      .catch((e) => {
        console.log(e);
      })

      // uds.getAll()
      // .then((res) => {
      //   this.users = res.data;
      //   console.log(this.users);
      // })
      // .catch((e) => {
      //   console.log(e);
      // })
      
      // sds.getAll()
      // .then((res) => {
      //   this.students = res.data;
      //   console.log(this.students);
      // })
      // .catch((e) => {
      //   console.log(e);
      // })
    }
    ,addCourse() {
      var data = {
        courseNumber: this.currentCourse.courseNumber
        ,name: this.currentCourse.name
        ,department: this.currentCourse.department
        ,level: this.currentCourse.level
        ,hours: this.currentCourse.hours
        ,description: this.currentCourse.description
        ,createdAt: new Date().toLocaleString()
      }
      cds.create(data)
        .then(response => {
          console.log(response.data);
          this.fetchAll();
          this.cancelAction();
        })
        .catch(e => {
          console.log(e);
        })
    }
    ,updateCourse() {
      var data = {...this.currentCourse};
      if (data.createdAt == null){
        data.createdAt = '2023-01-01 00:00:00'
      }
      data.updatedAt = new Date().toLocaleString();
      cds.update(data.id, data)
        .then(response => {
          console.log(response.data);
          this.fetchAll();
          this.cancelAction();
        })
        .catch(e => {
          console.log(e);
        })
    }
    ,deleteCourse(id) {
      cds.delete(id)
      .then(response => {
          console.log(response.data);
          this.fetchAll();
        })
        .catch(e => {
          console.log(e);
        })
    }
    ,showModal(id) {
      console.log(id);
      if(id){
        this.currentCourse = this.courses.find(c => c.id == id);
        this.editing = true;
        this.viewModal = true;
      } else {
        this.currentCourse = {
          courseNumber: ''
          ,name: ''
          ,department: ''
          ,description: ''
          ,level: null
          ,hours: null
        }
        this.viewModal = true;
      }
    }
    ,cancelAction() {
      this.currentCourse = {};
      this.editing = false;
      this.viewModal = false;
    }
  }
  ,computed: {
    coursesFiltered() {
      if(this.searhVal == ''){
        return this.courses;
      } else {
        return this.courses.filter(c => 
          (c.courseNumber.indexOf(this.searchVal.toUpperCase()) > -1 ||
           c.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1));
      }
    }
  }
  ,mounted() {
    this.fetchAll();
    // console.log('users: ', this.users);
    // console.log('students: ', this.students);
  } 

}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cell {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
