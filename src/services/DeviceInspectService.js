import request from '../utils/request';

const deviceInspectService = {
  getLineList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/line-list', data);
  },
  lineDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/line-show', data);
  },
  lineAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/line-add', data);
  },
  lineEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/line-edit', data);
  },
  lineDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/line-delete', data);
  },
  
  pointsDownload: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/point-download', data);
  },
  // 点下拉列表
  pointsDropDown: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/point-drop-down', data);
  },
  // 线路下拉列表
  lineDropDown: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/line-drop-down', data);
  },
  // 计划下拉列表
  planDropDown: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/plan-drop-down', data);
  },
  getPlanList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/plan-list', data);
  },
  planDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/plan-show', data);
  },
  planAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/plan-add', data);
  },
  planEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/plan-edit', data);
  },
  planDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/plan-delete', data);
  },
  getPointsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/point-list', data);
  },
  getLocation: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/get-location', data);
  },
  getPhoto: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/get-photo', data);
  },
  pointsDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/point-delete', data);
  },
  downFiles: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/point-download', data);
  },
  pointsDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/point-show', data);
  },
  getPointsAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/point-add', data);
  },
  getPointsEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/point-edit', data);
  },
  // 设备类别
  deviceCategoryDropDown: (parameter) => {/*上级类别下拉*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-category-drop-down', data);
  },
  // 对应设备
  deviceDropDown: (parameter) => {/*设备下拉列表*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-drop-down', data);
  },
  outlierDataList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/record-issue-list', data);
  },
  outlierDataExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/record-issue-export', data);
  },
  outlierDataView: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/record-issue-show', data);
  },
  inspectRecordList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/record-list', data);
  },
  inspectRecordExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/record-export', data);
  },
  inspectRecordView: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/record-show', data);
  },
  inspectRecordViewList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/record-show-list', data);
  },
  inspectData: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/user-list', data);
  },
  errorData: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/issue-list', data);
  },
  deviceErrorData: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/device-list', data);
  },
  // 执行人员
  userList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/plan-user-list', data);
  },
  // 巡检计划启用停用
  planStatus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/inspect/plan-status', data);
  },
  
};

export default deviceInspectService;