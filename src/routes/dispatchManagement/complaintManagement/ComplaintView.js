import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Modal, Row, Col, Input } from 'antd';
const FormItem = Form.Item;


function ComplaintView(props) {
  const { dispatch, form, username, mobile, type, content, images, status, handle_content, handle_at, previewVisible, previewImage, btnHide, show, id, community_id } = props;
  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }

  function imgVisible(value) {
    dispatch({
      type: 'ComplaintView/concat', payload: {
        previewVisible: true,
        previewImage: value,
      }
    })
  }
  function handleCancel() {
    dispatch({
      type: 'ComplaintView/concat', payload: {
        previewVisible: false,
      }
    })
  }
  function handleMark(params) {
    dispatch({
      type: 'ComplaintView/concat', payload: {
        show: true
      }
    })
    props.form.resetFields();
  }
  function handleHidden(params) {
    dispatch({
      type: 'ComplaintView/concat', payload: {
        show: false
      }
    })
    props.form.resetFields();
  }
  function handleOk(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({ type: 'ComplaintView/getComplaintMark', payload: { content: values.content, id, community_id } })
    });
  }

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>报事管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/complaintManagement">业主投诉</a></Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>


      <Card className="section">
        <p style={{ marginTop: '20px' }}><span>业主姓名：{username}</span></p>
        <p style={{ marginTop: '20px' }}><span>联系电话：{mobile}</span></p>
        <p style={{ marginTop: '20px' }}><span>投诉类型：{type ? type.name : ''}</span></p>
        <p style={{ marginTop: '20px' }}><span>投诉内容：{content}</span></p>

        <div style={{ clear: "both", overflow: "hidden", marginTop: "20px" }}><p style={{ float: 'left' }}>投诉图片：</p>
          {images && images.length != 0 ?
            images.map((value, index) => {
              return <img src={value} key={index} onClick={imgVisible.bind(null, value)} style={{ width: "100px", height: "100px", display: "inlineBlock", marginRight: "10px", marginBottom: "10px", float: "left" }} />
            })
            : '暂无图片'
          }
        </div>
        <p style={{ marginTop: '20px' }}><span>当前状态：{status ? status.name : ''}</span></p>
        <p style={{ marginTop: '20px' }}><span>处理内容：{handle_content ? handle_content : '无'}</span></p>
        <p style={{ marginTop: '20px', marginBottom: '20px' }}><span>处理时间：{handle_at ? handle_at : '无'}</span></p>
        <Button type="primary" onClick={handleMark} style={{ display: btnHide }}>标记为已处理</Button>

        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Modal title="标记为已处理" visible={show} onOk={handleOk} onCancel={handleHidden}>
          <Form>
            <Row>
              <Col className="mb1" style={{ paddingLeft: '60px' }}>
                <span className="mr1" style={{ fontSize: '12px' }}>业主姓名 :</span>
                <span style={{ fontSize: '12px' }}>{username}</span>
              </Col>
              <Col className="mb1" style={{ paddingLeft: '60px' }}>
                <span className="mr1" style={{ fontSize: '12px' }}>联系电话 :</span>
                <span style={{ fontSize: '12px' }}>{mobile}</span>
              </Col>
              <FormItem {...formItemLayout} label="处理内容">
                {getFieldDecorator('content', {
                  rules: [{ required: true, message: '请输入处理内容', whitespace: true }],
                })(<Input type="textarea" maxLength={200} placeholder="请输入处理内容" style={{ lineHeight: "20px" }} />)}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </Card>

    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.ComplaintView,
  };
}
export default connect(mapStateToProps)(Form.create()(ComplaintView));

