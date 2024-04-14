import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './routes'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState({
  auto: true,
}))
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
