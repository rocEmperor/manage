import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function AccidentRecordView (props) {
  const { dispatch, detailInfo, img_url } = props;
  let styleList = {marginTop: '20px'};
  
  /**
   * 文件下载
   * @param {object} file 
   */
  function downloadFile(file) {
    dispatch({
      type: 'AccidentRecordViewModel/getDownFile',
      payload: {
        file_name: file.name ? file.name : '',
        file_url: file.url ? file.url : ''
      }
    });
  }

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>设备管理</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#/accidentRecord">重大事故记录</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>查看</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section"  style={{padding: 0}}>
        <div style={styleList}>
          <span>设备分类：</span>
          {detailInfo.category_name}
        </div>
        <div style={styleList}>
          <span>对应设备：</span>
          {detailInfo.device_name}
        </div>
        <div style={styleList}>
          <span>事故发生时间：</span>
          {detailInfo.happen_at}
        </div>
        <div style={styleList}>
          <span>出现场时间：</span>
          {detailInfo.scene_at}
        </div>
        <div style={styleList}>
          <span>出现场人员：</span>
          {detailInfo.scene_person}
        </div>
        <div style={styleList}>
          <span>确认人：</span>
          {detailInfo.confirm_person}
        </div>
        <div style={styleList}>
          <span>事件事故描述及损失范围：</span>
          {detailInfo.describe}
        </div>
        <div style={styleList}>
          <span>事故原因及处理意见：</span>
          {detailInfo.opinion}
        </div>
        <div style={styleList}>
          <span>处理结果：</span>
          {detailInfo.result}
        </div>
        <div style={styleList}>
          <span>事故描述附件：</span>
          <span>
            {img_url.length > 0 ?
              img_url.map((value, index) => {
                return <a key={index} href="javascript:;" onClick={downloadFile.bind(this, value)}>{value.name}</a>
              }) : null}
          </span>
        </div>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    ...state.AccidentRecordViewModel
  }
})(AccidentRecordView);
