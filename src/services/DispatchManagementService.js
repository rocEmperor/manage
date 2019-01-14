import request from '../utils/request';

const dispatchManagementService = {
  complaintList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/serve/complaint-list', data);
  },
  complaintTypes: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/serve/complaint-types', data);
  },
  complaintStatus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/serve/complaint-status', data);
  },
  complaintDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/serve/complaint-detail', data);
  },
  complaintMark: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/serve/complaint-done', data);
  }

};
export default dispatchManagementService;
