import { message } from 'antd';
import queryString from 'query-string';
import EquipmentManagementService from '../../../services/EquipmentManagementService';
import { getCommunityId, download } from '../../../utils/util';

export default {
  namespace: 'DeviceRegisterShow',
  state: {
    community_id: '',
    detail: {},
    treeData: [],
    deviceIdType: [],
    img_url: []
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
        payload: { community_id }
      });
      yield put({
        type: 'getDeviceCategoryDropDown', payload: { community_id }
      });
    },
    *getDeviceCategoryDropDown({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.deviceCategoryDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            treeData: data
          }
        });
      }
    },
    *getDeviceRepairShow({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.deviceRepairShow, payload);
      if (code == 20000) {
        let imgUrl = [], imgName = [];
        if (data.file_url !== null && data.file_url !== undefined && data.file_url !== "" && data.file_name !== null && data.file_name !== undefined && data.file_name !== "") {
          imgUrl = data.file_url.split(',');
          imgName = data.file_name.split(',');
        }
        let img_urls = [];
        for (let i = 0; i < imgUrl.length; i++) {
          let obj = {
            uid: i - 1,
            name: imgName[i],
            status: 'done',
            url: imgUrl[i],
          };
          img_urls[i] = obj;
        }
        yield put({
          type: 'getDeviceDropDown', payload: { community_id: data.community_id, category_id: data.category_id }
        });
        yield put({
          type: 'concat',
          payload: {
            detail: data,
            img_url: img_urls
          }
        });
      }
    },
    *getDeviceDropDown({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.deviceDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            deviceIdType: data
          }
        });
      }
    },
    *getDownFile({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.downFile, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('下载成功！');
      }
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/deviceRegisterShow') {
          if (query.id) {
            dispatch({ type: 'init' });
            dispatch({ type: 'getDeviceRepairShow', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
          }
        }
      });
    }
  },
};
