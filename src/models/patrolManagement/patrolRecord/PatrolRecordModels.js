import PatrolManagementService from '../../../services/PatrolManagementService';
import {message} from 'antd'
import { getCommunityId } from '../../../utils/util';
const initialState = {
  list: [],
  paginationTotal: '',
  is_reset:false,
  status: [],
  community_id: getCommunityId(),
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    points_name:"",
    user_name:"",
    status:"",
    plan_id:"",
    line_id:"",
    start_time:"",
    end_time:""
  }
};
export default {
  namespace: 'PatrolRecord',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let PatrolRecord = yield select(state => state.PatrolRecord);
      let { params } = PatrolRecord;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'getRecordList', payload: {
          page: 1,
          rows: 10,
          community_id:getCommunityId(),
          points_name: '',
          user_name: '',
          status: '',
          plan_id: '',
          line_id: '',
          start_time: '',
          end_time: '',
        }
      });
      yield put({
        type: 'getStatus', payload: {}
      });
      yield put({
        type: 'getRecordPlanList', payload: {
          community_id:getCommunityId()
        }
      });
      yield put({
        type: 'getRecordLineList', payload: {
          community_id:getCommunityId()
        }
      });
      yield put({
        type: 'concat', payload: {
          is_reset:true,
          params: params
        }
      });
    },
    *getRecordList({ payload }, { call, put, select }) {
      const params = yield select(state => state.PatrolRecord.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PatrolManagementService.recordList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            params: newParams
          }
        });
      }
    },
    *getStatus({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.getStatus, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            status: data
          }
        });
      }
    },
    *getRecordPlanList({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.recordPlanList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            execType2: data
          }
        });
      }
    },
    *getRecordLineList({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.recordLineList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lineList2: data
          }
        });
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.recordDownload, payload);
      if(code == 20000){
        message.success('导出成功！');
        yield put({
          type: 'concat',
          payload: {
            
          }
        })
      }
      callback&&callback(data.down_url);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/patrolRecord') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
