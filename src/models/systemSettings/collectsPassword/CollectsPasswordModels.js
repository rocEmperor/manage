import { message } from 'antd';
import SystemSettingsService from '../../../services/SystemSettingsService';

export default {
  namespace: 'CollectsPassword',
  state: {
    is_set: 'no',
    mark: false,
    set: false,
    reset: false,
    code: false,
    countdown: 180,
    tel: ""
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const mobile = yield select(state => state.MainLayout.info.mobile);
      let tel = mobile.substr(0, 3) + '****' + mobile.substr(7);
      yield put({
        type: 'concat',
        payload: {
          tel: tel
        }
      });
      yield put({
        type: 'getConfirmPwd',
        payload: {}
      });
    },
    *getConfirmPwd({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.confirmPwd, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            is_set: data.is_set
          }
        });
      }
    },
    *getAddPwd({ payload }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.addPwd, payload);
      if (code == 20000) {
        message.destroy();
        message.info("密码设置成功！");
        yield put({
          type: 'getConfirmPwd',
          payload: {}
        });
        yield put({
          type: 'concat',
          payload: {
            set: false,
          }
        });
      }
    },
    *getEditPwd({ payload }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.editPwd, payload);
      if (code == 20000) {
        message.destroy();
        message.info("收款密码修改成功！");
        yield put({
          type: 'getConfirmPwd',
          payload: {}
        });
        yield put({
          type: 'concat',
          payload: {
            mark: false,
          }
        });
      }
    },
    *getResetPwd({ payload }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.resetPwd, payload);
      if (code == 20000) {
        message.destroy();
        message.info("收款密码重置成功！")
        yield put({
          type: 'concat',
          payload: {
            reset: false,
          }
        });
      }
    },
    *getSendMsg({ payload }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.sendMsg, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            code: true,
          }
        });
      }
    },
    *changeCode({ payload }, { call, put, select }) {
      const { countdown } = yield select(state => state.CollectsPassword);
      if (countdown == 0) {
        yield put({
          type: 'concat',
          payload: {
            countdown: 180,
            code: false
          }
        });
      } else {
        yield put({
          type: 'concat',
          payload: {
            countdown: countdown - 1
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/collectsPassword') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
