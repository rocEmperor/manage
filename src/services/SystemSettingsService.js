import request from '../utils/request';

const systemSettingsService = {
  houseOwn: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/own', data);
  },
  groupManages: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/manages', data);
  },
  getMenus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/get-menus', data);
  },
  showManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/show-manage', data);
  },
  addManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/add-manage', data);
  },
  editManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/edit-manage', data);
  },
  deleteManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/delete-manage', data);
  },
  manageManages: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/manage/manages', data);
  },
  getGroups: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/get-groups', data);
  },
  getCommunitys: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/manage/get-communitys', data);
  },
  manageShowManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/manage/show-manage', data);
  },
  manageEditManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/manage/edit-manage', data);
  },
  manageAddManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/manage/add-manage', data);
  },
  changeManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/manage/change-manage', data);
  },
  commOperateLog: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/user/comm-operate-log', data);
  },
  delBillList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/del-bill-list', data);
  },
  payList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/pay-list', data);
  },
  houseGetGroups: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups?data=' + data, data);
  },
  getBuildings: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings?data=' + data, data);
  },
  getUnits: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units?data=' + data, data);
  },
  getRooms: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms?data=' + data, data);
  },
  delBillCheck: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/del-bill-check?data=' + data, data);
  },
  delBillAll: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/del-bill-all?data=' + data, data);
  },
  confirmPwd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/receipt/confirm-pwd', data);
  },
  addPwd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/receipt/add-pwd', data);
  },
  editPwd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/receipt/edit-pwd', data);
  },
  resetPwd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/receipt/reset-pwd', data);
  },
  sendMsg: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/receipt/send-msg', data);
  },
  getDeleteManage: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/manage/delete-manage', data);
  },

};

export default systemSettingsService;
