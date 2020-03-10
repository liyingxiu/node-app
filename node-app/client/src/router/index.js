import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Register from '../views/Register'
import Notfound from '../views/404'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/index',
  },
  {
    path: '/index',
    name:'index',
    component:Index
  },
  {
    path: '/register',
    name:'register',
    component:Register
  },
  {
    path: "*",
    name:'/404',
    component:Notfound
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
