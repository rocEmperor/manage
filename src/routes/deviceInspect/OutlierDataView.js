import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function OutlierDataView (props) {
  const { detailInfo, images,dispatch,previewVisible, previewImage, } = props;
  let styleList = {marginTop: '20px'};
  
  function imgVisible(value) {
    dispatch({
      type: 'OutlierDataViewModel/concat', payload: {
        previewVisible: true,
        previewImage: value,
      }
    })
  }
  function handleCancel() {
    dispatch({
      type: 'OutlierDataViewModel/concat', payload: {
        previewVisible: false,
      }
    })
  }
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#/outlierData">异常数据汇总</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>查看</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section"  style={{padding: 0}}>
        <div style={styleList}>
          <span>设备状态: </span>
          {detailInfo.device_status}
        </div>
        <div style={styleList}>
          <span>任务名称: </span>
          {detailInfo.plan_name}
        </div>
        <div style={styleList}>
          <span>对应线路: </span>
          {detailInfo.line_name}
        </div>
        <div style={styleList}>
          <span>对应巡检点: </span>
          {detailInfo.point_name}
        </div>
        <div style={styleList}>
          <span>对应设备: </span>
          {detailInfo.device_name}
        </div>
        <div style={styleList}>
          <span>巡检记录: </span>
          {detailInfo.record_note}
        </div>
        <div style={{ clear: "both", overflow: "hidden", marginTop: "20px" }}><p style={{ float: 'left' }}>巡检记录图片：</p>
          {images && images.length != 0 ?
            images.map((value, index) => {
              return <img src={value} key={index} onClick={imgVisible.bind(null, value)} style={{ width: "100px", height: "100px", display: "inlineBlock", marginRight: "10px", marginBottom: "10px", float: "left" }} />
            })
            : '暂无图片'
          }
        </div>
        <div style={styleList}>
          <span>执行人员: </span>
          {detailInfo.user_name}
        </div>
        <div style={styleList}>
          <span>地理位置: </span>
          {detailInfo.location_name}
        </div>
        <div style={styleList}>
          <span>完成时间: </span>
          {detailInfo.finish_at}
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    ...state.OutlierDataViewModel
  }
})(OutlierDataView);
