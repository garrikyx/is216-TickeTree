import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { db } from '../firebase'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('db', db);

app.mount('#app');
