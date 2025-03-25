import { createRouter, createWebHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import StoryView from "../views/StoryView.vue";
import Maintenance from "../views/Maintenance.vue";

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory("/ikura"),
  routes: [
    {
      path: "/",
      name: "begin",
      component: StartView,
    },
    {
      path: "/story",
      name: "story",
      component: StoryView,
    },
    {
      path: "/maintenance",
      name: "maintenance",
      component: Maintenance,
    },
  ],
});

export default router;
