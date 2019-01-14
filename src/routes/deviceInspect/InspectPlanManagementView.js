import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card } from 'antd';

function InspectPlanManagementView (props) {
  const { detailInfo } = props;
  let styleList = {marginTop: '20px'};
  
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#/inspectPlanManagement">巡检计划</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>查看</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section"  style={{padding: 0}}>
        <div style={styleList}>
          <span>计划名称:</span>
          {detailInfo.name}
        </div>
        <div style={styleList}>
          <span>对应线路:</span>
          {detailInfo.line_name}
        </div>
        <div style={styleList}>
          <span>巡检周期:</span>
          {detailInfo.exec_name}
        </div>
        <div style={styleList}>
          <span>开始结束时间:</span>
          {detailInfo.time_lists?detailInfo.time_lists.map((val,index)=>{
            return <span key={index} className="mr1">{val}</span>
          }):null}
        </div>
        <div style={styleList}>
          <span>执行人员:</span>
          {detailInfo.user_lists}
        </div>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    ...state.InspectPlanManagementViewModel
  }
})(InspectPlanManagementView);
