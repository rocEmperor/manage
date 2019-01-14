import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Button, Modal } from 'antd';

function PatrolRecordView(props) {
  const { dispatch, previewVisible, previewImage, detail } = props;
  //布局
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
    style: { marginBottom: '2px' }
  }
  //返回上一页
  function handleBack(e) {
    history.go(-1);
  }
  //图片显示
  function imgVisible(value) {
    dispatch({
      type: 'PatrolRecordView/concat',
      payload: {
        previewVisible: true,
        previewImage: value,
      }
    })
  }
  //图片隐藏
  function handleCancel() {
    dispatch({
      type: 'PatrolRecordView/concat',
      payload: {
        previewVisible: false,
      }
    })
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/patrolRecord">巡更记录</a></Breadcrumb.Item>
      <Breadcrumb.Item>详情</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="巡更状态" {...formItemLayout}>
          <span style={{ color: '#FF9933' }}>{detail.status_des}</span>
        </Form.Item>
        <Form.Item label="巡更点" {...formItemLayout}>
          <span>{detail.point_name}</span>
        </Form.Item>
        <Form.Item label="所属计划" {...formItemLayout}>
          <span>{detail.plan_name}</span>
        </Form.Item>
        <Form.Item label="所在线路" {...formItemLayout}>
          <span>{detail.line_name}</span>
        </Form.Item>
        <Form.Item label="巡更时间" {...formItemLayout}>
          <span>{detail.patrol_time}</span>
        </Form.Item>
        <Form.Item label="地理位置" {...formItemLayout}>
          <span>{detail.location_name}</span>
        </Form.Item>
        <Form.Item label="巡更记录" {...formItemLayout}>
          <span>{detail.patrol_content}</span>
          {detail.patrol_imgs === undefined || detail.patrol_imgs.length === 0 ?
            ''
            :
            <Row gutter={16}>
              {detail.patrol_imgs.map((value, index) => {
                return <Col span={6} key={index}><img src={value} onClick={imgVisible.bind(this, value)} style={{ width: '100%', height: '10rem', marginTop: '16px', cursor: 'pointer' }} /></Col>
              })}
            </Row>
          }
        </Form.Item>
        <Form.Item label="执行人员" {...formItemLayout}>
          <span>{detail.user_name}</span>
        </Form.Item>
        <Form.Item style={{ marginTop: '20px' }} wrapperCol={{ span: 8, offset: 3 }}>
          <Button onClick={handleBack}>返回</Button>
        </Form.Item>
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Form>
    </Card>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.PatrolRecordView
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolRecordView));