import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Modal, Button, Select, Input } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
import {getCommunityId} from '../../utils/util';

function ChangerView(props) {
  let { info, previewVisible, previewImage, dispatch, visible, selected, form, id, btnHide } = props;
  const { getFieldDecorator } = form;
  /**
   * 隐藏放大的图片
   * @param  {Object} src
   */
  function handlePreview(src){
    dispatch({
      type: 'ChangerViewModel/concat',
      payload: {
        previewVisible:true,
        previewImage:src
      }
    });
  }
  /**
   * 隐藏放大的图片
   */
  function handleImgCancel(){
    dispatch({
      type: 'ChangerViewModel/concat',
      payload: {
        previewVisible:false,
        previewImage:''
      }
    });
  }
  /**
   * 点击设置为已受理按钮
   */
  function mark(record) {
    dispatch({
      type:'ChangerViewModel/concat',
      payload:{
        visible: true,
        id:record.id,
      }
    })
  }
  /**
   * 确认设置为已受理
   */
  function handleOk(e){
    form.validateFields((err, values) => {
      if(err){
        return;
      }
      dispatch({
        type:'ChangerViewModel/',
        payload:{
          community_id:getCommunityId(),
          status:values.status_modal,
          remark:values.content,
          changer_id:id,
        }
      })
      dispatch({
        type: 'ChangerViewModel/concat',
        payload:{
          visible: false,
          selected:2
        }
      })
      form.resetFields();// 将表单里的数据清空
      dispatch({
        type:'ChangerViewModel/getList',
        payload:{
          community_id:getCommunityId(),
          page:1,
          row:10
        }
      })
    });
  }

  /**
   * 隐藏设置为已受理弹框
   */
  function hideModalVisible(){
    dispatch({
      type: 'ChangerViewModel/concat',
      payload:{
        visible:false,
      }
    });
  }
  /**
   * 监听处理结果
   * @param  {String} value
   * value = 2  已变更
   * value = 3  已驳回
   */
  function handleChange(value) {
    dispatch({
      type: 'ChangerViewModel/concat',
      payload:{
        selected:value
      }
    })
  }
  // 布局
  const formItemLayout2 = {
    labelCol: { span: 2 },
    wrapperCol: { span: 21 },
  };
  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 21 },
  };
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/rightInfoChange">业主信息变更</Link></Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={24}>
              <FormItem className="detail-item" label="姓名:" {...formItemLayout2}>
                <span>{info.name}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="手机号码:" {...formItemLayout2}>
                <span>{info.mobile}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="对应房屋：" {...formItemLayout2}>
                <span>{info.address}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="相关证件：" {...formItemLayout2}>
                <span>
                  {info.images && info.images.length != 0 ?
                    info.images.map((value, index) => {
                      return <img key={index} className="detail-img" src={value} onClick={handlePreview.bind(this,value)}/>
                    }):'暂无图片'
                  }
                </span>
              </FormItem>
            </Col>
            <Col span={24}>
              {info.status_desc && info.status_desc != '' ?
                <FormItem className="detail-item" label="当前状态：" {...formItemLayout2}>
                  <span>{info.status_desc}</span>
                </FormItem>:""
              }
            </Col>
            <Col span={24}>
              {info.remark && info.remark != '' ?
                <FormItem className="detail-item" label="驳回原因：" {...formItemLayout2}>
                  <span>{info.remark}</span>
                </FormItem>:""
              }
            </Col>
            <Col span={24}>
              {info.status && info.status != 1?
                <Button type="primary" onClick={mark.bind(this)} style={{display: btnHide, marginTop:'10px'}}>设置为已受理</Button>:''
              }
            </Col>
          </Row>
        </Form>
      </Card>
      <Modal visible={previewVisible} footer={null} onCancel={handleImgCancel.bind(this)}>
        <img alt="img" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Modal title="设置为已受理" visible={visible} onOk={handleOk.bind(this)} onCancel={hideModalVisible.bind(this)}>
        <Form>
          <Row>
            <Col className="mb1">
              <FormItem label="处理结果" {...formItemLayout}>
                {getFieldDecorator('status_modal',{
                  rules: [{ required: true, message: '请选择处理结果'}]
                })(
                  <Select placeholder="请选择处理结果" notFoundContent="没有数据" onChange={handleChange.bind(this)}>
                    <Option key="2" value="2">已变更</Option>
                    <Option key="3" value="3">已驳回</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {selected == 3?
              <FormItem {...formItemLayout} label="驳回原因">
                {getFieldDecorator('content', {
                  rules: [{ required: true, message: '请输入驳回原因', whitespace: true }],
                })(
                  <Input type="textarea" maxLength={50} placeholder="请输入驳回原因" style={{lineHeight:"20px"}}/>
                )}
              </FormItem>:''
            }
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.ChangerViewModel};
}
export default connect(mapStateToProps)(Form.create()(ChangerView));
