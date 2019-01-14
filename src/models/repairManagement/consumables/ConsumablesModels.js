import { message } from 'antd';
import RepairManagementService from '../../../services/RepairManagementService';

export default {
  namespace: 'Consumables',
  state: {
    params: {
      page: 1,
      rows: 10,
      community_id: sessionStorage.getItem("communityId"),
    },
    modalShow: false,
    data: [],
    edit: true,//标记modal是编辑状态还是新增状态
    materialType: [],
    materialUnit: []
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      let query = {
        params: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
        },
      }

      yield put({type: 'getMaterials',payload: query.params});
      yield put({ type: 'concat', payload: query });
      yield put({
        type: 'getMaterialType',
        payload: {}
      });
      yield put({
        type: 'getMaterialUnit',
        payload: {}
      });

    },
    *getMaterials({ payload }, { call, put, select }) {
      const params = yield select(state => state.Consumables.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(RepairManagementService.materials, params);
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
    *getMaterialType({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getMaterialType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            materialType: data.list
          }
        });
      }
    },
    *getMaterialUnit({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getMaterialUnit, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            materialUnit: data.list
          }
        });
      }
    },
    *getAddMaterial({ payload }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.addMaterial, payload);
      if (code == 20000) {
        message.success('新增成功！');
        yield put({
          type: 'getMaterials',
          payload: {
            page: 1,
            rows: 10
          }
        });
        yield put({
          type: 'concat',
          payload: {
            modalShow: false,
            data: []
          }
        });
      }
    },
    *getEditMaterial({ payload }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.editMaterial, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        yield put({
          type: 'getMaterials',
          payload: {
            page: 1,
            rows: 10
          }
        });
        yield put({
          type: 'concat',
          payload: {
            modalShow: false,
            data: []
          }
        });
      }else{
        yield put({
          type: 'getMaterials',
          payload: {
            page: 1,
            rows: 10
          }
        });
      }
    },
    *getDeleteMaterial({ payload }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.deleteMaterial, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getMaterials',
          payload: {
            page: 1,
            rows: 10
          }
        });
      }
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/consumables') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
