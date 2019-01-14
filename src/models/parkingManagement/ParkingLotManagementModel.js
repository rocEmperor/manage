import { message } from 'antd';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'ParkingLotManagement',
  state: {
    params: {
      community_id: getCommunityId(),
      name:'',
    },
    is_reset: false,
    list: [],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = getCommunityId();
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: {
            name: '',
          },
          list: [],
        }
      });
      yield put({
        type: 'getLotListNew', payload: { community_id, name: '' }
      });
    },
    *getLotListNew({ payload }, { call, put, select }) {
      const params = yield select(state => state.ParkingLotManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(CarEquipManagementService.lotListNew, newParams);
      data.list?data.list.map(item=>{
        if(item.children.length==0){
          delete item.children;
        }
        item.children?item.children.map(items=>{
          if(items.children.length==0){
            delete items.children
          }
        }):[]
      }):[]
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            params: newParams,
            paginationTotal: data.count,
          }
        });
      }
    },
    *getLotAreaDelete({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.lotAreaDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getLotListNew', payload: {
            community_id: getCommunityId()
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/parkingLotManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
