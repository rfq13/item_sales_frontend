//import vue router
import { createRouter, createWebHistory } from "vue-router";

//define a routes
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Index.vue"),
  },
  {
    path: "/items",
    name: "items.index",
    component: () => import(/* webpackChunkName: "post.index" */ "../views/items/Index.vue"),
  },
  {
    path: "/items/create",
    name: "items.create",
    component: () => import(/* webpackChunkName: "post.create" */ "../views/items/Create.vue"),
  },
  {
    path: "/items/edit/:id",
    name: "items.edit",
    component: () => import(/* webpackChunkName: "post.edit" */ "../views/items/Edit.vue"),
  },
  {
    path: "/customers",
    name: "customers.index",
    component: () => import(/* webpackChunkName: "post.index" */ "../views/customers/Index.vue"),
  },
  {
    path: "/customers/create",
    name: "customers.create",
    component: () => import(/* webpackChunkName: "post.create" */ "../views/customers/Create.vue"),
  },
  {
    path: "/customers/edit/:id",
    name: "customers.edit",
    component: () => import(/* webpackChunkName: "post.edit" */ "../views/customers/Edit.vue"),
  },
];

//create router
const router = createRouter({
  history: createWebHistory(),
  routes, // config routes
});

export default router;
