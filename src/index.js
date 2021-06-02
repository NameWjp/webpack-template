import { createApp } from 'vue';
// 这里引入 element-plus 后 vue-loader 热替换异常，注释掉后正常
import ElementPlus from 'element-plus';
import App from './App.vue';
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App);

app.use(ElementPlus);

app.mount('#app');
