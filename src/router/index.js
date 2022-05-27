import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import UserInfo from '../components/users/UserInfo.vue'
import Doctor from '../components/doctor/Doctor.vue'
import Adddoctor from '../components/doctor/Adddoctor.vue'
import Department from '../components/department/Department.vue'
import Adddepartment from '../components/department/Add.vue'
import Imgmanage from '../components/picture/Imgmanage.vue'
import Appointment from '../components/appointment/Appointment.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: './welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/userinfo', component: UserInfo },
      { path: '/doctor', component: Doctor },
      { path: '/adddoctor', component: Adddoctor },
      { path: '/department', component: Department },
      { path: '/adddepartment', component: Adddepartment },
      { path: '/imgmanage', component: Imgmanage },
      { path: '/appointment', component: Appointment }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
