import request from '../utils/request';

const commonInterface = {

  companyTypeList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/company/type-list', data);
  },

};
export default commonInterface;
