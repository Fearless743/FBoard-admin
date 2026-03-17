import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'element-plus/dist/index.css'
import router from './router'
import { useAuthStore } from './stores/auth'
import './styles.css'

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus)
app.use(pinia)

const authStore = useAuthStore()
authStore.initializeAuth()

app.use(router)
app.mount('#root')
