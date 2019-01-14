import ChangingItemManagementService from '../../services/ChangingItemManagementService';
import { getCommunityId } from '../../utils/util'
import { message } from 'antd';
const {
  getFormula,
  shareWaterEdit,
  sharedWaterList,
  deleteFormula,
  addFormula,
  waterShow,
  getWaterLiat,
  WaterEditReq,
  electricShowList,
  getElectricList ,
  sharedElectricEdit,
  sharedElectricList,
  electricEdit
} = ChangingItemManagementService;
export default {
  namespace: 'FormulaManagementModel',
  state: {
    totals: 1,
    current: 1,
    list: [],
    data: {},
    visible: false,
    visible1: false,
    visible2: false,
    submitButtonLoading: false,
    formula: '',
    formulaName: '',
    formulaWaterList: '',
    formulaElectricityList: '',
    editVisible: false,
    electricityVisible: false,
    communityId: getCommunityId()
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let dataList = {community_id: getCommunityId()};
      yield put({type: 'getFormulaList'});
      yield put({type: 'getFormulaWaterList', payload: dataList});
      yield put({type: 'getFormulaElectricityList', payload: dataList});
      yield put({type: 'getFormulaSharedWaterList', payload: dataList});
      yield put({type: 'getFormulaSharedElectricList', payload: dataList});
      yield put({type: 'getFormulaWaterShow', payload: dataList});
      yield put({type: 'getFormulaElectricShow', payload: dataList});
    },
    *getFormulaList ({ payload }, { call, put, select }) {
      let FormulaManagementModel = yield select(state => state.FormulaManagementModel);
      let page = undefined;
      if (payload !== undefined && payload.hasOwnProperty('page')) {
        page = payload.page
      }
      let dataList = { community_id: getCommunityId(), page: page ? page : FormulaManagementModel.current, rows: 8 };
      const { data, code } = yield call(getFormula, dataList);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            totals: Number(data.totals),
            list: data.list
          }
        });
      }
    },
    *deleteFormula ({ payload }, { call, put, select }) {
      let dataList = {formula_id: payload.id};
      const { code } = yield call(deleteFormula, dataList);
      if (code == 20000) {
        message.success('删除成功', 2);
        yield put({type: 'getFormulaList'});
        payload.resolve()
      }
    },
    *submitFormula ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {submitButtonLoading: true}});
      let dataList = {
        name: payload.formulaName,
        calc_rule: payload.calc_rule,
        del_decimal_way: payload.del_decimal_way,
        formula: payload.formula.toLowerCase(),
        community_id: getCommunityId()
      };
      const { code } = yield call(addFormula, dataList);
      if (code == 20000) {
        message.success('保存成功', 2);
        setTimeout(() => {
          payload.callback()
        }, 1000);
        yield put({type: 'concat', payload: {submitButtonLoading: false}});
        yield put({ type: 'getFormulaList' })
      }
    },
    *getFormulaWaterShow ({ payload }, { call, put, select }) {
      const { data, code } = yield call(waterShow, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            formulaWaterShow: data
          }
        })
      }
    },
    *getFormulaWaterList ({ payload }, { call, put, select }) {
      const { data, code } = yield call(getWaterLiat, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            formulaWaterList: data
          }
        })
      }
    },
    *submitFormulaWater ({ payload, callback, err }, { call, put, select }) {
      yield put({type: 'concat', payload: {submitButtonLoading: true}});
      let dataList = {
        type: payload.type,
        price: payload.price,
        phase_list: payload.phase_list,
        calc_rule: payload.calc_rule,
        del_decimal_way: payload.del_decimal_way,
        community_id: getCommunityId()
      };
      const { code } = yield call(WaterEditReq, dataList);
      if (code === 20000) {
        message.success('保存成功', 2);
        yield put({
          type: 'concat',
          payload: { submitButtonLoading: false }
        });
        yield put({
          type: 'concat',
          payload: {
            visible1: false
          }
        });
        yield put({
          type: 'getFormulaWaterList',
          payload: {
            community_id: getCommunityId()
          }
        });
        callback && callback
      } else {
        err && err()
      }
    },
    *getFormulaElectricShow ({ payload }, { call, put, select }) {
      const { data, code } = yield call(electricShowList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: { formulaElectricShow: data }
        })
      }
    },
    *getFormulaElectricityList ({ payload }, { call, put, select }) {
      const { data, code } = yield call(getElectricList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: { formulaElectricityList: data }
        })
      }
    },
    *submitFormulaSharedEditWater ({ payload, callback, err }, { call, put, select }) {
      yield put({ type: 'concat', payload: { submitButtonLoading: true }});
      const { code } = yield call(shareWaterEdit, payload);
      if (code === 20000) {
        message.success('保存成功', 2);
        yield put({ type: 'concat', payload: { submitButtonLoading: false }});
        yield put({type: 'getFormulaSharedWaterList', payload: {community_id: getCommunityId()}})
        yield put({
          type: 'concat',
          payload: { editVisible: false }
        })
        callback && callback()
      } else {
        err && err()
      }
    },
    *getFormulaSharedWaterList ({ payload }, { call, put, select }) {
      const { data, code } = yield call(sharedWaterList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {formulaSharedWaterList: data}
        })
      }
    },
    *submitFormulaSharedEditElectricity ({ payload, callback, err }, { call, put, select }) {
      yield put({type: 'concat', payload: {submitButtonLoading: true}});
      const { code } = yield call(sharedElectricEdit, payload);
      if (code === 20000) {
        message.success('保存成功', 2);
        yield put({
          type: 'concat',
          payload: { submitButtonLoading: false }
        });
        yield put({
          type: 'getFormulaSharedElectricList',
          payload: {community_id: getCommunityId()}
        });
        yield put({
          type: 'concat',
          payload: { electricityVisible: false }
        })
        callback && callback()
      } else {
        err && err()
      }
    },
    *getFormulaSharedElectricList ({ payload }, { call, put, select }) {
      const { data, code } =yield call(sharedElectricList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {formulaSharedElectricList: data}
        })
      }
    },
    *submitFormulaElectric ({ payload, callback, err }, { call, put, select }) {
      yield put({type: 'concat', payload: {submitButtonLoading: true}});
      const { code } = yield call(electricEdit, payload);
      if (code == 20000) {
        message.success('保存成功', 2);
        yield put({type: 'concat', payload: {submitButtonLoading: false}});
        yield put({
          type: 'concat',
          payload: { visible2: false }
        });
        yield put({
          type: 'getFormulaElectricityList',
          payload: { community_id: getCommunityId() }
        });
        callback && callback()
      } else {
        err && err()
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/formulaManagement') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
