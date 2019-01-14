import request from '../utils/request';

const repairManagementService = {
  getRepairType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/get-repair-type', data);
  },
  getGroups: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups?data=' + data, data);
  },
  repairFromList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-from-list', data);
  },
  getRepairStatus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/get-repair-status', data);
  },
  repairList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/list', data);
  },
  //导出报修列表
  repairExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/export', data);
  },
  getBuildings: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings', data);
  },
  getUnits: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units', data);
  },
  getRooms: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms', data);
  },
  addRepair: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/add-repair', data);
  },
  repairShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/show', data);
  },
  getRepairMaterial: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/get-repair-material', data);
  },
  groupGetGroups: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/get-groups', data);
  },
  getGroupUsers: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/group/get-group-users', data);
  },
  assignRepair: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/assign-repair', data);
  },
  //标记完成
  makeComplete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/make-complete', data);
  },
  //添加维修记录
  addRecord: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/add-record', data);
  },
  //作废
  nullifyRepair: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/nullify-repair', data);
  },
  repairCreateNew: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-create-new', data);
  },
  //标记疑难
  checkHard: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/check-hard', data);
  },
  //复核
  repairReview: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-review', data);
  },
  getUserInfo: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/get-user-info', data);
  },
  hardList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/hard-list', data);
  },
  //导出疑难
  hardExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/hard-export', data);
  },
  materials: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/materials', data);
  },
  getMaterialType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/get-material-type', data);
  },
  getMaterialUnit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/get-material-unit', data);
  },
  deleteMaterial: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/delete-material', data);
  },
  editMaterial: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/edit-material', data);
  },
  addMaterial: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/add-material', data);
  },
  repairTypeList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-type-list', data);
  },
  repairTypeLevel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-type-level', data);
  },
  repairTypeLevelList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-type-level-list', data);
  },
  repairTypeStatus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-type-status', data);
  },
  repairTypeAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-type-add', data);
  },
  repairTypeEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-type-edit', data);
  },
  repairStatistic: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-statistic', data);
  },
  repairTypeStatistic: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-type-statistic', data);
  },
  repairScoreStatistic: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/repair-score-statistic', data);
  },
  repairMakePay: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/repair/make-pay', data);
  }
  
};

export default repairManagementService;