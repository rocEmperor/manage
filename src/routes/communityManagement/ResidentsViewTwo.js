import React from 'react';
import { Card, Breadcrumb, Form, Row, Col, Modal } from 'antd';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'dva';
const FormItem = Form.Item;

function ResidentsViewTwo (props) {
  const { infoList, previewVisible, previewImage, dispatch } = props;
  let queryList = queryString.parse(window.location.hash.split('?')[1]);
  /**
   * 放大图片
   * @param  {Object} src
   */
  function handlePreview(src){
    dispatch({
      type: 'ResidentsViewTwoModel/concat',
      payload: {
        previewVisible:true,
        previewImage: src
      }
    });
  }
  /**
   * 隐藏放大的图片
   */
  function handleImgCancel () {
    dispatch({
      type: 'ResidentsViewTwoModel/concat',
      payload: {
        previewVisible: false,
        previewImage: ''
      }
    });
  }
  // 布局
  const formItemLayout2 = {
    labelCol: { span: 2 },
    wrapperCol: { span: 21 }
  };
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/residentsManage">住户管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={24}>
              <FormItem className="detail-item" label="姓名:" {...formItemLayout2}>
                <span>{infoList.name ? infoList.name : ''}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="手机号码:" {...formItemLayout2}>
                <span>{infoList.mobile ? infoList.mobile: ''}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="身份证号:" {...formItemLayout2}>
                <span>{infoList.card_no ? infoList.card_no : ''}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="对应房屋：" {...formItemLayout2}>
                <span>{`${infoList.group}${infoList.building}${infoList.unit}${infoList.room}`}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="身份：" {...formItemLayout2}>
                <span>{infoList.identity_type_des ? infoList.identity_type_des: ''}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="有效期：" {...formItemLayout2}>
                <span>{infoList.time_end == '0' ? '长期' : infoList.time_end}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem className="detail-item" label="提交时间：" {...formItemLayout2}>
                <span>{infoList.create_at ? infoList.create_at : ''}</span>
              </FormItem>
            </Col>
            <Col span={24} style={{padding: '10px 0px'}}>
              <FormItem className="detail-item" label="证件说明：" {...formItemLayout2}>
                <span>
                  {infoList.images && infoList.images.length != 0 ?
                    infoList.images.map((value, index) => {
                      return <img key={index} className="detail-img" src={value} onClick={handlePreview.bind(this,value)}/>
                    }) : '暂无图片'
                  }
                </span>
              </FormItem>
            </Col>
            <Col span={24}>
              {queryList.type === 'Failed' ?
                <FormItem className="detail-item" label="处理人：" {...formItemLayout2}>
                  <span>{infoList.operator_name ? infoList.operator_name: ''}</span>
                </FormItem> : null
              }
            </Col>
            <Col span={24}>
              {queryList.type === 'Failed' ?
                <FormItem className="detail-item" label="不通过原因：" {...formItemLayout2}>
                  <span>{infoList.reason ? infoList.reason : ''}</span>
                </FormItem> : null
              }
            </Col>
          </Row>
        </Form>
      </Card>
      <Modal visible={previewVisible} footer={null} onCancel={handleImgCancel.bind(this)}>
        <img alt="img" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.ResidentsViewTwoModel
  };
}
export default connect(mapStateToProps)(Form.create()(ResidentsViewTwo))
