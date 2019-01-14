import request from '../utils/request';

const fileUploadService = {
  // 账单管理中的批量收款功能
  selectedBillImport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-batch-import', data);
  },
  // 账单管理中的导入账单功能
  importBills: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-import', data);
  },
  // 导出账单
  billExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/export-bill', data);
  },
  // 缴费方式
  payChannel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/pay-channel', data);
  },
};

export default fileUploadService;