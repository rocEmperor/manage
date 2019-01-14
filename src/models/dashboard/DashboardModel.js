import DashboardService from './../../services/DashboardService';

export default {
  namespace: 'DashboardModel',
  state: {
    error_percent:0,
    normal_percent:0,
    healthy:[],
    resident: [],
    device_nums:[],
    community_name:'',
    dynamic:[],
    num_ge:0,
    num_shi:0,
    num_bai:0,
    num_qian:0,
    num_wan:0,
    flux:null,
    repair:null,
    maxSize:0,
    maxSize_flux: 0,
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'monitorIndex',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
        }
      });
    },
    *monitorIndex({ payload }, { call, put, select }) {
      const { data, code } = yield call(DashboardService.monitorIndex, payload);
      if (code == 20000) {
        let num_shu = data.device ? data.device.num ? data.device.num.totals:0:0;
        let num_ge = num_shu - ((Math.floor(num_shu / 10)) * 10);//个位
        let num_shi = (num_shu - ((Math.floor(num_shu / 100)) * 100) - num_ge) / 10;//十位数
        let num_bai = (num_shu - ((Math.floor(num_shu / 1000)) * 1000) - (num_shi * 10) - num_ge) / 100//百位上的数字
        let num_qian = (num_shu - ((Math.floor(num_shu / 10000)) * 10000) - (num_bai * 100) - (num_shi * 10) - num_ge) / 1000//千位上的数字
        let num_wan = (num_shu - ((Math.floor(num_shu / 100000)) * 100000) - (num_qian * 1000)- (num_bai * 100)- (num_shi * 10) - num_ge) / 10000//万位上的数字

        let xAxis=[];
        let yAxis = [];
        let maxSize = [];
        if (data && data.repair){
          for (let i=0; i < data.repair.length; i++) {
            let obj = {};
            let arr = [];
            xAxis = [];
            for (let j=0; j < data.repair[i].list.length; j++) {
              xAxis.push(data.repair[i].list[j].time);
              arr.push(data.repair[i].list[j].value);
            }
            obj = {
              data: arr.slice(),
              name: data.repair[i].name,
              type: "line",
              smooth: true,
              areaStyle: {}
            }
            yAxis.push(obj)
            maxSize.push(Math.max(...arr))
          }
        }
        let xAxis_flux=[];
        let yAxis_flux = [];
        let maxSize_flux = [];
        if (data && data.flux) {
          for (let m=0; m < data.flux.length; m++) {
            let obj = {};
            let arr = [];
            xAxis_flux = []
            for (let n=0; n < data.flux[m].list.length; n++) {
              xAxis_flux.push(data.flux[m].list[n].time);
              arr.push(data.flux[m].list[n].value);
            }
            obj = {
              data: arr.slice(),
              name: data.flux[m].name,
              type: "line",
              smooth: true,
              areaStyle: {}
            }
            yAxis_flux.push(obj)
            maxSize_flux.push(Math.max(...arr))
          }
        }
        let residentArr = [];
        if (data && data.resident) {
          for (let w = 0; w < data.resident.length; w++) {
            const obj = {
              value: data.resident[w].value,
              name: data.resident[w].name,
              label:{
                formatter:'{b}: {c}({d}%)'
              }
            }
            residentArr.push(obj);
          }
        }

        yield put({
          type: 'concat',
          payload: {
            resident: residentArr,
            error_percent: data.device ? data.device.num.error_percent:0,
            normal_percent: data.device ? data.device.num.normal_percent : 0,
            healthy: data.device ? data.device.healthy:[],
            device_nums: data.device ? data.device.num ? data.device.num.nums:[] :[],
            community_name: data.community_name,
            dynamic: data.dynamic,
            num_ge: num_ge,
            num_shi: num_shi,
            num_bai: num_bai,
            num_qian: num_qian,
            num_wan: num_wan,
            flux: {
              xAxis: xAxis_flux.slice(),
              yAxis: yAxis_flux.slice(),
            },
            repair: {
              xAxis: xAxis.slice(),
              yAxis: yAxis.slice(),
            },
            maxSize: Math.max(...maxSize),
            maxSize_flux: Math.max(...maxSize_flux),
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/dashboard') {
          dispatch({ type: 'init' });
          let ws = global.ws;
          let wsUrl;
          let location = window.location,
            hostname = location.hostname;
          if (hostname == 'localhost' || hostname == 'dev-web.elive99.com') {   //本地启动接口地址
            wsUrl = 'wss://st.elive99.com';
          } else if (hostname == 'alipay.elive99.com') {  //线上接口地址
            wsUrl = 'wss://s.elive99.com'
          }
          const connect = function () {
            ws = new WebSocket(wsUrl);
            ws.onopen = onopen;
            ws.onmessage = onmessage;
            ws.onclose = onclose;
            ws.onerror = onerror;
            global.ws = ws;//将websocket对象存入全局变量
          }
          //建立连接(发送数据到服务端)
          const onopen = function () {
            // console.log('openen');
            const data = { "community_id": sessionStorage.getItem("communityId"), "type": "login", token: sessionStorage.getItem('QXToken') };
            ws.send(JSON.stringify(data));
          }

          //接受服务端传递的数据
          const onmessage = function (e) {
            // console.log('onmessage'+e.data);
            let data = JSON.parse(e.data)
            if (data && data.device) {
              let num_shu = data.device ? data.device.num ? data.device.num.totals : 0 : 0;
              let num_ge = num_shu - ((Math.floor(num_shu / 10)) * 10);//个位
              let num_shi = (num_shu - ((Math.floor(num_shu / 100)) * 100) - num_ge) / 10;//十位数
              let num_bai = (num_shu - ((Math.floor(num_shu / 1000)) * 1000) - (num_shi * 10) - num_ge) / 100//百位上的数字
              let num_qian = (num_shu - ((Math.floor(num_shu / 10000)) * 10000) - (num_bai * 100) - (num_shi * 10) - num_ge) / 1000//千位上的数字
              let num_wan = (num_shu - ((Math.floor(num_shu / 100000)) * 100000) - (num_qian * 1000) - (num_bai * 100) - (num_shi * 10) - num_ge) / 10000//万位上的数字
              dispatch({
                type: 'concat',
                payload: {
                  error_percent: data.device ? data.device.num.error_percent : 0,
                  normal_percent: data.device ? data.device.num.normal_percent : 0,
                  healthy: data.device ? data.device.healthy : [],
                  device_nums: data.device ? data.device.num ? data.device.num.nums : [] : [],
                  num_ge: num_ge,
                  num_shi: num_shi,
                  num_bai: num_bai,
                  num_qian: num_qian,
                  num_wan: num_wan,
                }
              });
            } else if (data && data.dynamic) {
              dispatch({
                type: 'concat',
                payload: {
                  dynamic: data.dynamic ? data.dynamic : [],
                }
              });
            } else if (data && data.resident) {
              let residentArr = [];
              for (let w = 0; w < data.resident.length; w++) {
                const obj = {
                  value: data.resident[w].value,
                  name: data.resident[w].name,
                  label: {
                    formatter: '{b}: {c}({d}%)'
                  }
                }
                residentArr.push(obj);
              }
              dispatch({
                type: 'concat',
                payload: {
                  resident: residentArr,
                }
              });
            } else if (data && data.flux) {
              let xAxis_flux=[];
              let yAxis_flux = [];
              let maxSize_flux = [];
              if (data && data.flux) {
                for (let m = 0; m < data.flux.length; m++) {
                  let obj = {};
                  let arr = [];
                  xAxis_flux = [];
                  for (let n = 0; n < data.flux[m].list.length; n++) {
                    xAxis_flux.push(data.flux[m].list[n].time);
                    arr.push(data.flux[m].list[n].value);
                  }
                  obj = {
                    data: arr.slice(),
                    name: data.flux[m].name,
                    type: "line",
                    smooth: true,
                    areaStyle: {}
                  }
                  yAxis_flux.push(obj)
                  maxSize_flux.push(Math.max(...arr))
                }
              }
              dispatch({
                type: 'concat',
                payload: {
                  flux: {
                    xAxis: xAxis_flux.slice(),
                    yAxis: yAxis_flux.slice(),
                  },
                  maxSize_flux: Math.max(...maxSize_flux),
                }
              });
            } else if (data && data.repair) {
              let xAxis=[];
              let yAxis = [];
              let maxSize = [];
              if (data && data.repair) {
                for (let i = 0; i < data.repair.length; i++) {
                  let obj = {};
                  let arr = [];
                  xAxis = [];
                  for (let j = 0; j < data.repair[i].list.length; j++) {
                    xAxis.push(data.repair[i].list[j].time);
                    arr.push(data.repair[i].list[j].value);
                  }
                  obj = {
                    data: arr.slice(),
                    name: data.repair[i].name,
                    type: "line",
                    smooth: true,
                    areaStyle: {}
                  }
                  yAxis.push(obj)
                  maxSize.push(Math.max(...arr))
                }
              }
              dispatch({
                type: 'concat',
                payload: {
                  repair: {
                    xAxis: xAxis.slice(),
                    yAxis: yAxis.slice(),
                  },
                  maxSize: Math.max(...maxSize),
                }
              });
            }
          }

          const onclose = function (e) {
            // console.log('onclose');
            if (e.code == 1006) {//服务端主动关闭，需要重连
              reconnect();//关闭重连
            }
            //客户端主动关闭code=1005，不需要重连(切换路由)
          }

          const onerror = function (e) {
            // console.log('onerror', e);
          }
          let reconnectCount = 1;//重连次数
          const reconnectMax = 10;//最大允许重连10次
          let reconnectTimer;//定时器ID
          let seconds = 2000;
          function reconnect() {//重连
            if (reconnectCount >= reconnectMax || ws.readyState == 1) {//超过次数或者连接成功，清除定时器
              clearTimeout(reconnectTimer);
            } else {
              reconnectCount = reconnectCount + 1;//重连次数+1
              if (ws.readyState == 3) {//close状态
                seconds = seconds + 2000;
                reconnectTimer = setTimeout(function () {
                  connect();
                }, seconds);//2s重连一次
              }
            }
          }

          //5分钟发送一次心跳，服务端10分钟内无心跳，判断为已失效，会主动断开连接
          setInterval(function () {
            keepalive(ws)
          }, 50000);

          function keepalive(ws) {
            if (ws.bufferedAmount == 0) {
              ws.send('h^1');//发送任意字符串
            }
          }
          if (!global.ws) {
            connect();
          } else {
            global.ws.onopen();
          }
        } else {
          if (global.ws) {//切换路由，全局的websocket变量存在，则主动关闭
            global.ws.close();
            global.ws = null;
          }
        }
      })
    }
  }
}
