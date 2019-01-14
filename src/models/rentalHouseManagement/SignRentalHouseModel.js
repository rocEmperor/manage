import { message } from 'antd';
import queryString from 'query-string';
import rentalHouseManagementService from '../../services/rentalHouseManagementService';
import { download } from '../../utils/util';
export default {
  namespace: 'SignRentalHouseModel',
  state: {
    contract_imgs: [],
    tenant_cardimg: [],
    tenant_cardimg_back: [],
    member_cardimg: [],
    member_cardimg_back: [],
    phoneNum: '',
    price: '',
    rent_start_time: '',
    rent_end_time: '',
    info: '',
    pay_period: [],
    uploadToken: '',
    members: []
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let reserve_id = {id: payload.queryId};
      yield put({type: 'rentReserveProperty', payload: {reserve_id: reserve_id}});
      yield put({type: 'getRentReserveGetComm', payload: {}});
    },
    *rentReserveProperty ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.rentReserveGetRentInfo, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
            members: data.members,
          }
        })
      }
    },
    *getRentReserveGetComm ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.rentReserveGetComm, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            pay_period: data.pay_period
          }
        })
      }
    },
    *getRentReserveRentContract ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(rentalHouseManagementService.rentReserveRentContract, payload);
      if (code === 20000) {
        yield put({type: 'concat', payload: {}});
        message.success('签约成功');
        // form.resetFields();
        setTimeout(() => {
          location.href = "#/orderRoomManagement";
        },1000)
      }
    },
    *getDownContact({ payload }, { call, put, select }) {
      const { code, data } = yield call(rentalHouseManagementService.downContact, payload);
      if (code === 20000) {
        download(data.down_url);
        message.success('下载成功！');
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/signRentalHouse') {
          dispatch({type: 'init', payload: {queryId: query.id}})
        }
      })
    }
  }
}
