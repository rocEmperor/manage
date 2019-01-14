import SystemSettingsService from '../../../services/SystemSettingsService';

export default {
  namespace: 'MyCommunity',
  state: {
    list: [],
    paginationTotal: '',
    loading: false
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const mainLayout = yield select(state => state.MainLayout);
      let { communityList, communityId } = mainLayout;
      let proCompanyId = '';
      communityList.forEach((value, index) => {
        if (communityId === value.community_id) {
          proCompanyId = value.pro_company_id
        }
      });
      yield put({
        type: 'getHouseOwn',
        payload: { pro_company_id: proCompanyId }
      });
    },
    *getHouseOwn({ payload, callback }, { call, put, select }) {
      yield put({type: 'concat', payload: { loading: true }});
      const { data, code } = yield call(SystemSettingsService.houseOwn, payload);
      if (code == 20000) {
        callback && callback(data);
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            loading: false
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/myCommunity') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
