import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Settings from '../views/Settings.vue';
import Feeds from '../views/Feeds.vue';
import Feed from '../views/Feed.vue';
import Article from '../views/Article.vue';
import Articles from '../views/Articles.vue';
import Newfeed from '../views/Newfeed.vue';
import Editfeed from '../views/Editfeed.vue';
import { auth } from '../firebase';
import Crypto from "../views/Crypto";
import Cryptos from "../views/Cryptos";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/feed/:id',
    name: 'Feed',
    component: Feed,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: Article
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles
  },
  {
    path: '/feeds/new',
    name: 'New Feed',
    component: Newfeed,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/feeds/edit/:id',
    name: 'Edit Feed',
    component: Editfeed,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/cryptos/:cpid',
    name: 'Crypto',
    component: Crypto,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/cryptos',
    name: 'Cryptos',
    component: Cryptos,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/feeds',
    name: 'RSS Feed',
    component: Feeds,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Authentication',
    component: () => import('../views/Authentication.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;
