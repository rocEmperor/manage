'use strict';

import React from 'react';
import { connect } from 'react-redux';
// import * as actions from '../../actions/app';
import { Input, Button, Modal, Form, message } from 'antd';
// const InputGroup = Input.Group;
const FormItem = Form.Item;

import './index.css';
import SearchInput from '../../components/SearchInput/';

let map, cityName, geolocation, AMap = window.AMap;
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      lnglat: "",
      keyword: '',
      lng: '',
      lat: '',
      location_name: '',
      city: "",
      tips: "",
      pois: "",
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let t = this;
    if (this.props.type != nextProps.type) {
      this.setState({
        visible: true
      });
    } else {
      return;
    }
    cityName = nextProps.cityName;
    setTimeout(() => {
      map = new AMap.Map('containers', {
        zoom: 12
      });
      map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           //定位结果缓存0毫秒，默认：0
          convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        //显示定位按钮，默认：true
          buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status, result) {
          if (status == "complete") {
            t.setState({
              provinceCity: result.addressComponent.province + result.addressComponent.city,
              location_name: result.addressComponent.province + result.addressComponent.city + result.addressComponent.district + result.addressComponent.township + result.addressComponent.street + result.addressComponent.streetNumber,
              city: result.addressComponent.city,
              lat: result.addressComponent.businessAreas["0"].location.lat,
              lng: result.addressComponent.businessAreas["0"].location.lng,
              lnglat: result.addressComponent.businessAreas["0"].location.lng + "," + result.addressComponent.businessAreas["0"].location.lat
            })


            //   //周边搜索
            //   AMap.service(["AMap.PlaceSearch"], function () {
            //     var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            //       // pageSize: 5,
            //       pageIndex: 1,
            //       // city: "010", //城市
            //       // map: map,
            //       // panel: "result"
            //     });
            //     //关键字查询
            //     placeSearch.search(t.state.location_name, function (status, result) {
            //       if (status == "complete") {
            //         t.setState({
            //           pois: result.poiList.pois
            //         });
            //       }
            //     });
            //   });
            //   map.on('click', function (e) {
            //     t.setState({
            //       pois: ""
            //     });
            //   });
          }

        });
      });

      if (this.props.cityName) {
        map.setCity(this.props.cityName);
      }
    }, 1);
  }
  nameSearch(keyword) {
    let that = this;
    if (!keyword) {
      return false;
    }
    AMap.service(["AMap.PlaceSearch"], function () {
      let placeSearch = new AMap.PlaceSearch({ //构造地点查询类
        pageSize: 12,
        pageIndex: 1,
        city: cityName, //城市
        map: map
      });
      placeSearch.search(keyword, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          let mapObj = new AMap.Map('containers', { zoom: 12 });
          // let markers = [];
          let center = result.poiList.pois[0].location;
          result.poiList.pois.map((item, index) => {
            let num = +1 + index;
            let marker = new AMap.Marker({
              position: [item.location.lng, item.location.lat],
              map: mapObj,
              visible: true,
              clickable: true,
              content: '<div class="amap-marker-content" style="opacity: 1;"><div class="amap_lib_placeSearch_poi">' + num + '</div></div>'
            });
            marker.on('click', function () {
              that.setState({
                lnglat: item.location.lng + "," + item.location.lat,
                location_name: item.pname + item.cityname + item.adname + item.address
              });
              // mapObj.setZoomAndCenter(12, item.location);
            });
            // marker.setContent='<h3>'+item.name+'</h3><div>高德是中国领先的数字地图内容、导航和位置服务解决方案提供商。</div>';
            mapObj.setZoomAndCenter(12, center);
          })
        }
      })
    })
  }
  handleOk(e) {
    this.setState({
      lnglat: ""
    })
  }
  handleCancel(e) {
    this.setState({
      visible: false,
      lnglat: ""
    })
    // if (this.state.lnglat) {
    //   this.props.handleMap(this.state.lnglat, this.state.location_name);
    // }
  }
  handleSubmit(e) {
    if (this.state.lnglat) {
      this.props.handleMap(this.state.lnglat, this.state.location_name);
    } else {
      message.error('未选择坐标点，无法保存！', 2);
      return false;
    }
    this.setState({
      visible: false
    })
  }
  render() {
    // let { map } = this.props;
    let modalAdd = {
      title: '获取经纬度',
      visible: this.state.visible,
      onOk: this.handleOk.bind(this),
      onCancel: this.handleCancel.bind(this),
      okText: '提交',
      footer: false,
      width: 800,
      className: 'mapCont'
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal {...modalAdd}>
        <div className="page1-component">
          <Form layout="inline" >
            <FormItem {...formItemLayout} label="搜索">
              <SearchInput placeholder="请在此输入搜索条件" onSearch={this.nameSearch.bind(this)} />
            </FormItem>
            <FormItem {...formItemLayout} label="经纬度">
              <Input placeholder="自动获取，无需输入！" disabled={true} value={this.state.lnglat} />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
            </FormItem>
          </Form>
          <p>
            {
              //   list.map( (item, index ) => {
              //     return <span className="result" key={index}>{item}</span>;
              // })
            }
          </p>
          <div id="containers" className="containers"></div>
          <div id="panel"></div>
        </div>
      </Modal>
    );
  }
}

Map = Form.create({})(Map);
export default connect((state) => {
  return {
    map: state.map
  }
})(Map);
