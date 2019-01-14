import request from '../utils/request';

const statisticalReportService = {
  commsInfo: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/report/comms-info', data);
  },
  billList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/service/bill-list', data);
  },
  amountsScale: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/report/amounts-scale', data);
  },
  totalsScale: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/report/totals-scale', data);
  },
  commInfo: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/report/comm-info', data);
  },
  amountScale: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/report/amount-scale', data);
  },
  totalScale: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/report/total-scale', data);
  },
  //缴费项目
  payList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/pay-list', data);
  },
  //导出年收费总况
  exportYear: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-report/year-export', data);
  },
  //导出收费项目明细表
  exportRoom: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-report/room-export', data);
  },
  //导出月报表
  exportMoth: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-report/export-month', data);
  },
  //导出渠道
  exportChannel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-report/export-channel', data);
  },
  //年收费总况列列表
  getYearList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-report/year-list', data);
  },
  //月报表列表
  getMonthList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-report/get-month-report', data);
  },
  //收费项目明细表
  getRoomList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-report/room-list', data);
  },
  //收款渠道列表
  getChannelList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-report/get-channel-list', data);
  },
  
};
export default statisticalReportService;