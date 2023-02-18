// .vitepress/theme/index.js
import Layout from './Layout.vue'
import DefaultTheme from 'vitepress/theme'
import '../global-custom.css';

export default {
    ...DefaultTheme,
    Layout: Layout
}