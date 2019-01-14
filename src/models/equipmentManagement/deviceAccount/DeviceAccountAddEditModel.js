import { message } from 'antd';
import queryString from 'query-string';
import EquipmentManagementService from '../../../services/EquipmentManagementService';
import { getCommunityId, download } from '../../../utils/util';

export default {
  namespace: 'DeviceAccountAddEdit',
  state: {
    community_id: '',
    detail: {},
    treeData: [],
    statusType: [{
      name: "运行",
      id: "1"
    }, {
      name: "报废",
      id: "2"
    }],
    scrappedStatus: '',
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
    *getDeviceShow({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.deviceShow, payload);
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
          type: 'concat',
          payload: {
            detail: data,
            scrappedStatus: data.status ? data.status : '',
            img_url: img_urls
          }
        });
      }
    },
    *getDeviceAdd({ payload }, { call, put, select }) {
      const { code } = yield call(EquipmentManagementService.deviceAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/deviceAccount";
        }, 1000)
      }
    },
    *getDeviceEdit({ payload }, { call, put, select }) {
      const { code } = yield call(EquipmentManagementService.deviceEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/deviceAccount";
        }, 1000)
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
        if (pathname === '/deviceAccountAdd') {
          initData();
        } else if (pathname === '/deviceAccountEdit') {
          initData();
          if (query.id) {
            dispatch({ type: 'getDeviceShow', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
          }
        }
        function initData() {
          dispatch({ type: 'init' });
          dispatch({
            type: 'concat', payload: {
              id: query.id,
              detail: {},
              scrappedStatus: '',
              img_url: []
            }
          })
        }
      });
    }
  },
};
