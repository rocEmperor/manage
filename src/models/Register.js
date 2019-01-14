import  CommonInterface from './../services/CommonInterface';
import { message } from 'antd';
export default {
  namespace: 'register',
  state: {
    count:'发送验证码',
    flagSend:true,
    showPassword:false,
    phone:'',
    acode:'',
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type: 'concat',
        payload: {
          count:'发送验证码',
          flagSend:true,
          showPassword:false,
          phone:'',
          acode:'',
        }
      });
    },
    *getSmsCode({payload,callback},{call, put}){
      const { code } = yield call(CommonInterface.getSmsCode, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            flagSend: false,
          }
        });
        callback && callback();
      }
    },
    *backLogin({ payload, callback }, { call, put }) {
      location.href = '#/';
    },
    *validateSmsCode({ payload, callback }, { call, put }) {
      const { code,data } = yield call(CommonInterface.validateSmsCode, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            showPassword: true,
            phone:payload.mobile,
            acode:data.acode,
          }
        });
        callback && callback();
      }
    },
    *resetPassword({ payload, callback }, { call, put }) {
      const { code } = yield call(CommonInterface.resetPassword, payload);
      if (code == 20000) {
        message.success('重置修改成功，3秒后返回登录页');
        setTimeout(() => {
          location.href = "#/";
        }, 2000)
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if(pathname === '/register'){
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
