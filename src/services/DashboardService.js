import request from '../utils/request';

const dashboardService = {
  todayExit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/monitor/users', data);
  },
  exitTraffic: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/monitor/users-traffic', data);
  },
  todayCar: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/monitor/cars', data);
  },
  carTraffic: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/monitor/cars-traffic', data);
  },
  communityData: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/monitor/community', data);
  },
  monitorIndex: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/monitor/index', data);
  },
};
export default dashboardService;
