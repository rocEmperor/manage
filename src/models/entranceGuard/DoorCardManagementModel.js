import { message } from 'antd';
import EntranceGuardService from './../../services/EntranceGuardService';

const initialState = {
  list: [],
  totals: 2,
  selectedRowKeys: [],
  selectedIds: [],
  is_reset: false,
  id: '',
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
    room: '',
    card_num: '',
    type: '',
    time_status: '',
    status: ''
  }
}
export default {
  namespace: 'DoorCardManagement',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'concat', payload: { ...initialState } });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            group: '',
            building: '',
            unit: '',
            room: '',
            card_num: '',
            type: '',
            time_status: '',
            status: ''
          }
        }
      })
      // 列表
      yield put({
        type: 'doorCarList', payload: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          group: '',
          building: '',
          unit: '',
          room: '',
          card_num: '',
          type: '',
          time_status: '',
          status: ''
        }
      });
    },
    *doorCarList({ payload }, { call, put, select }) {
      const params = yield select(state => state.DoorCardManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(EntranceGuardService.doorCarList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: data.totals,
            params: newParams
          }
        })
      }
    },
    *doorCarSelDisabled({ payload }, { call, put, select }) {
      const { code } = yield call(EntranceGuardService.doorCarSelDisabled, payload);
      if (code == 20000) {
        message.success('操作成功！');
        yield put({
          type: 'doorCarList', payload: {
            page: 1,
            rows: 10,
            group: '',
            building: '',
            unit: '',
            room: '',
            card_num: '',
            type: '',
            time_status: '',
            status: ''
          }
        });
        yield put({
          type: 'concat',
          payload: {
            selectedRowKeys: [],
            selectedIds: []
          }
        })
      }
    },
    *doorCarDisabled({ payload }, { call, put, select }) {
      const { code } = yield call(EntranceGuardService.doorCarDisabled, payload);
      if (code == 20000) {
        message.success('操作成功！');
        yield put({
          type: 'doorCarList', payload: {
            page: 1,
            rows: 10,
            group: '',
            building: '',
            unit: '',
            room: '',
            card_num: '',
            type: '',
            time_status: '',
            status: ''
          }
        });
      }
    },
    *doorCarDelete({ payload }, { call, put, select }) {
      const { code } = yield call(EntranceGuardService.doorCarDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'doorCarList', payload: {
            page: 1,
            rows: 10,
            group: '',
            building: '',
            unit: '',
            room: '',
            card_num: '',
            type: '',
            time_status: '',
            status: ''
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/doorCardManagement') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
