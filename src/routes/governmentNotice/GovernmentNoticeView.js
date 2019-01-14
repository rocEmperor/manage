import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card } from 'antd';

function GovernmentNoticeView (props) {
  let { info } = props;
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>政务通知</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#/governmentNotice">政务通知</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <h2 style={{marginTop:'20px'}}>
          <span>{info ? info.title : ''}</span>
        </h2>
        <div dangerouslySetInnerHTML={{__html: info.content}} style={{marginTop: '20px'}}/>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    ...state.GovernmentNoticeViewModel
  }
})(GovernmentNoticeView);
