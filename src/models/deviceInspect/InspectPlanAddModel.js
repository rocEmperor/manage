import { message } from 'antd';
import DeviceInspectService from '../../services/DeviceInspectService';
import queryString from 'query-string';

export default {
  namespace: 'InspectPlanAdd',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    detail: {},
    selected: '',
    userList: [],
    lineList: [],
    execType: [],
    id: '',
    startValue: null,
    arrData: [{
      startTime: '',
      endTime: '',
      key: 1
    }],
    arrWeekData: [{
      start: '',
      startTime: '',
      end: '',
      endTime: '',
      key: 1
    }],
    arrMonthData: [{
      start: '',
      startTime: '',
      end: '',
      endTime: '',
      key: 1
    }],
    arrYearData: [{
      startMonth: '',
      startDay: '',
      startTime: '',
      endMonth: '',
      endDay: '',
      endTime: '',
      key: 1
    }],
    addVisible: true,
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          community_id: community_id,
          selectExecType: '',
        }
      });
      yield put({
        type: 'getPlanLineList',
        payload: { community_id }
      });
      yield put({
        type: 'getPlanUserList',
        payload: { community_id }
      });
      yield put({
        type: 'lineDropDown',
        payload: { community_id }
      });
    },
    *lineDropDown({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.lineDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lineList: data ? data.list : []
          }
        });
      }
    },
    *getPlanDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.planDetail, payload);
      if (code == 20000) {
        let arr = [], arr1 = [], arr2 = [], arr3 = [];
        if (data.exec_type == 1) {
          data.time_list.map((item, index) => {
            arr.push({
              startTime: item.hours_start,
              endTime: item.hours_end,
              key: index
            })
          })
        } else if (data.exec_type == 2) {
          data.time_list.map((item, index) => {
            arr1.push({
              start: item.week_start,
              end: item.week_end,
              startTime: item.hours_start,
              endTime: item.hours_end,
              key: index
            })
          })
        } else if (data.exec_type == 3) {
          data.time_list.map((item, index) => {
            arr2.push({
              start: item.day_start,
              end: item.day_end,
              startTime: item.hours_start,
              endTime: item.hours_end,
              key: index
            })
          })
        } else {
          data.time_list.map((item, index) => {
            arr3.push({
              startMonth: item.month_start,
              endMonth: item.month_end,
              startDay: item.day_start,
              endDay: item.day_end,
              startTime: item.hours_start,
              endTime: item.hours_end,
              key: index
            })
          })
        }
        yield put({
          type: 'concat',
          payload: {
            detail: data,
            arrData: arr,
            arrWeekData: arr1,
            arrMonthData: arr2,
            arrYearData: arr3,
            selected: data.exec_type
          }
        });
      }
    },
    *getPlanUserList({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.userList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            userList: data,
          }
        });
      }
    },
    *getPlanAdd({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.planAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/inspectPlanManagement";
        }, 1000)
      }
    },
    *getPlanEdit({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.planEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/inspectPlanManagement";
        }, 1000)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        function initData() {

          dispatch({ type: 'init' });
          dispatch({
            type: 'concat', payload: {
              id: query.id,
              detail: {},
              selected: '',
              addVisible: true,
              arrData: [{
                startTime: '',
                endTime: '',
                key: 1
              }],
              arrWeekData: [{
                start: '',
                startTime: '',
                end: '',
                endTime: '',
                key: 1
              }],
              arrMonthData: [{
                start: '',
                startTime: '',
                end: '',
                endTime: '',
                key: 1
              }],
              arrYearData: [{
                startMonth: '',
                startDay: '',
                startTime: '',
                endMonth: '',
                endDay: '',
                endTime: '',
                key: 1
              }],
            }
          })
        }
        if (pathname === '/inspectPlanAdd') {
          initData();
          if (query.id) {
            dispatch({ type: 'getPlanDetail', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
          }
        }
      });
    }
  },
};
