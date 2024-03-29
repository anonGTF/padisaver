import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: '/', component: () => import("../pages/WelcomePage.vue") },
  { path: '/home', component: () => import("../pages/HomePage.vue") },
  { path: '/camera', component: () => import("../pages/CameraPage.vue") },
  { path: '/result', component: () => import("../pages/ResultPage.vue") },
  { path: '/list', component: () => import("../pages/ListPage.vue") },
  { path: '/detail/:id', component: () => import("../pages/DetailPage.vue") },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})