import fetch from 'dva/fetch';
import { message } from 'antd';
import { getUrl } from './util';
import queryString from 'query-string';
import md5 from 'crypto-js/md5';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = '{}', methods, call = () => { }, err = () => { }) {
  
  const params = {
    data: options,
    token: sessionStorage.getItem('QXToken'),
    community_id:  sessionStorage.getItem("communityId")
  };
  let urls = getUrl() + url;
  const  appSecret = 'HU6%12(w';
  //四位随机数(1000-9999)
  let rand = parseInt(Math.random()*8999 + 1000, 10).toString();
  let timestamp = new Date().getTime().toString();
  let md5String = JSON.stringify({"data":JSON.parse(options), "rand":rand, "timestamp":timestamp, "token":params.token});
  //验签算法
  let sign = md5(md5(md5String).toString() + appSecret).toString();
  let formData = {};
  formData.method = 'POST';
  formData.headers = { 
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    "Zj-Custom-Rand":  rand,
    "Zj-Custom-Timestamp":  timestamp,
    "Zj-Custom-Sign":  sign
  };
  formData.body = queryString.stringify(params);
  
  return fetch(urls, formData)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      if (data.code == 20000) {
        call();
      } else if (data.code == 50002 ) {
        setTimeout(() => {
          // hashHistory.push('/');
          location.href = '#/';
        }, 2000);
        message.destroy();
        message.info('登录信息已失效，3秒后将自动跳转到登录页...');
      }else if(data.code == 50003){
        message.destroy();
        message.error("楼宇重复");
      } else {
        message.destroy();
        message.error(data.error.errorMsg);
      }
      return data;
    })
    .catch(err => ({ err }));
}
