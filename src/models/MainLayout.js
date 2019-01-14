import { message } from 'antd';
import CommonInterface from '../services/CommonInterface';
import HomePageService from './../services/HomePageService';
// import { loginOut, getUserByToken, change, feedbackAdd } from '../services/CommonInterface';

export default {
  namespace: 'MainLayout',
  state: {
    complaint: '',
    repair: '',
    version: '',
    house: '',
    packAge: '',
    permission: '',
    communityList: JSON.parse(sessionStorage.getItem("communityList"))||[],
    info: JSON.parse(sessionStorage.getItem("info"))||{},
    communityId: sessionStorage.getItem("communityId")||"",
    path: "",
    showFeedback: false,
    visible: false,
    menuList: JSON.parse(sessionStorage.getItem("menus"))||[],
    lianZhangUrl: '',
    passwordsMainLay: false,
    is_set: '',
    is_verify: '',
    error_num: ''
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getUserInfo({ payload }, { call, put }) {
      const { code, data } = yield call(CommonInterface.getUserByToken, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
          }
        });
        sessionStorage.setItem('info',JSON.stringify(data));
      }
    },
    *menuList ({ payload }, { call, put }) {
      const { data, code } = yield call(CommonInterface.getMenuList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { menuList: data?data:[] }
        });
        sessionStorage.setItem('menus',JSON.stringify(data));
      }
    },
    *communityList({ payload }, { call, put }) {
      const { code, data } = yield call(CommonInterface.change, payload);
      if (code == 20000) {
        const communityId = sessionStorage.getItem("communityId");
        yield put({
          type: 'concat',
          payload: {
            communityList: data,
            communityId:  communityId? communityId:data[0].id,
          }
        });
        sessionStorage.setItem('communityId', communityId ? communityId : data[0].id);
        sessionStorage.setItem('communityList',JSON.stringify(data));
        yield put({type: 'menuList'})
        yield put({ type: 'dashboardIndex', payload: { community_id: communityId ? communityId : data[0].id} })
      }
    },
    *dashboardIndex({ payload }, { call, put, select }) {
      const { data, code } = yield call(HomePageService.dashboardIndex, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            complaint: data ? data.complaint : '',
            repair: data ? data.repair : '',
            version: data ? data.version : '',
            house: data ? data.house : '',
            packAge: data ? data.package : '',
            permission: data ? data.permission : '',
          }
        })
      }
    },
    *loginOut({ payload }, { call, put }) {
      const {code} = yield call(CommonInterface.loginOut, payload);
      if(code == 20000){
        message.success('退出成功！');
        setTimeout(() => {
          location.href = "#/";
        },2000)
      }
    },
    *changePassword({ payload }, { call, put }) {
      const { code } = yield call(CommonInterface.changePassword, payload);
      if (code == 20000) {
        window.sessionStorage.removeItem('password_time_stamp');
        message.success('密码修改成功，3秒后返回登录页');
        yield put({
          type: 'concat',
          payload: {
            visible: false
          }
        });
        setTimeout(() => {
          location.href = "#/";
        }, 2000)
      }
    },
    *feedbackAdd({ payload, callback }, { call, put }) {
      const { code } = yield call(CommonInterface.feedbackAdd, payload);
      if (code == 20000) {
        callback && callback();
        yield put({
          type: 'concat',
          payload: {
            showFeedback: false
          }
        });
      }
    },
    *lianZhangReq ({ payload, callback }, { call, put }) {
      const { data, code } = yield call(CommonInterface.lianZhang, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lianZhangUrl: data.url
          }
        });
        if (data.url !== '') {
          window.open(data.url);
        } else {
          message.warning('当前小区未开通此项服务');
        }
      }
    },
    *confirmPwd({payload,callback}, {call, put}){
      const { data,code } = yield call(CommonInterface.confirmPwd, payload);
      if(code == 20000){
        yield put({
          type:'concat',
          payload: {
            is_set:data?data.is_set:'',
          }
        })
        callback&&callback(data.is_set);
      }
    },
    *verifyPwd({payload, callback}, {call, put}){
      const { data,code } = yield call(CommonInterface.verifyPwd, payload);
      if(code == 20000){
        window.sessionStorage.setItem('password_time_stamp', new Date().getTime());
        yield put({
          type:'concat',
          payload: {
            is_verify: data ? data.is_verify : '',
            error_num: data ? data.error_num : ''
          }
        })
        callback && callback(data);
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if(pathname === '/homePage'){
          dispatch({ type: 'getUserInfo' });
          dispatch({ type: 'communityList' });
        }
      });
    }
  },
};
