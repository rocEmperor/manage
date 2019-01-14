import dva from 'dva';
// import createHistory from 'history/createBrowserHistory';
import 'antd/dist/antd.less';
import './index.less';
import createLoading from 'dva-loading';
import router from './router';


// 1. Initialize

// const app = dva({
//   history: createHistory(),
// });
const app = dva();

// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(router);
// app.router(()=>{RouterConfig});

// 5. Start
app.start('#root');
