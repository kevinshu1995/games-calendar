import { createApp } from "vue";
import "./assets/style.css";
import App from "./App.vue";
import HomeView from "./view/Home.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: HomeView, name: "Home" },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: "smooth" };
  },
});

createApp(App).use(router).mount("#app");
