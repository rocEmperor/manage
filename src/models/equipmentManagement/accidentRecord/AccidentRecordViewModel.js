import { message } from 'antd';
import queryString from 'query-string';
import EquipmentManagementService from '../../../services/EquipmentManagementService';
import { getCommunityId, download } from '../../../utils/util';

export default {
  namespace: 'AccidentRecordViewModel',
  state: {
    previewVisible: false,
    previewImage: '',
    detailInfo: {},
    img_url: []
  },
  reducers: {
    concat (state, { payload }) {
      return {...state, ...payload};
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      const { data } = yield call(EquipmentManagementService.accidentShow, payload);
      /*图片上传*/
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
        payload: { detailInfo: data, img_url: img_urls }
      })
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
    setup ({ dispatch, history }) {
      return history.listen (({ pathname, search }) => {
        let query = queryString.parse(search)
        if (pathname === '/accidentRecordView') {
          dispatch({type: 'init', payload: {id: query.id,community_id: getCommunityId()}})
        }
      })
    }
  }
}
