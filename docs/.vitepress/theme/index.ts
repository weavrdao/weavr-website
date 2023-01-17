// .vitepress/theme/index.js
import Layout from './Layout.vue'
import DefaultTheme from 'vitepress/theme'

export default {
    ...DefaultTheme,
    enhanceApp({app}) {
        app.component('Layout', Layout)
    }
}