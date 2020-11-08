import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const original = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return original.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
