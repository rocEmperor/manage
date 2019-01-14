import request from '../utils/request';

const GovernmentNoticeService = {
  // 政务通知列表
  governmentNoticeList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/notify/notice-list', data);
  },
  // 消息已读
  newReadInfo (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/notify/notify-read', data);
  },
  // 政务通知是否有未读消息
  isReadNewInfo (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/notify/latest-notify', data);
  },
  // 消息详情
  newsDetailList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/notify/show-notice', data);
  }
};
export default GovernmentNoticeService;
