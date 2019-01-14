import request from '../utils/request';

const patrolManagementService = {
  report: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/report', data);
  },
  reportRank: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/report-rank', data);
  },
  lineList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/line-list', data);
  },
  pointsListUnchoose: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/points-list-unchoose', data);
  },
  lineDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/line-detail', data);
  },
  lineAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/line-add', data);
  },
  lineEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/line-edit', data);
  },
  lineDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/line-delete', data);
  },
  planList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/plan-list', data);
  },
  planLineList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/plan-line-list', data);
  },
  getExecType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/get-exec-type', data);
  },
  planDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/plan-detail', data);
  },
  planUserList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/plan-user-list', data);
  },
  planAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/plan-add', data);
  },
  planEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/plan-edit', data);
  },
  planDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/plan-delete', data);
  },
  pointsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/points-list', data);
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
    return request('/property/patrol/points-delete', data);
  },
  pointsDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/points-detail', data);
  },
  pointsAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/points-add', data);
  },
  pointsEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/points-edit', data);
  },
  recordList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/record-list', data);
  },
  getStatus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/get-status', data);
  },
  recordLineList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/record-line-list', data);
  },
  recordPlanList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/record-plan-list', data);
  },
  recordDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/record-detail', data);
  },
  pointsDownload: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/points-download', data);
  },
  recordDownload: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/patrol/record-download', data);
  }
  
};

export default patrolManagementService;