import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col, Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function ViewOrderRoom(props) {
  let { dispatch, ViewOrderRoomModel } = props;
  let { previewImage, previewVisible, detailInfo } = ViewOrderRoomModel;

  function imgVisible(value) {
    dispatch({
      type: 'ViewOrderRoomModel/concat',
      payload: {
        previewVisible: true,
        previewImage: value
      }
    })
  }

  function handleCancel() {
    dispatch({
      type: 'ViewOrderRoomModel/concat',
      payload: {
        previewVisible: false,
        previewImage: ''
      }
    })
  }
  let marginStyle = { marginTop: '20px' };
  let imgStyle = { width: '100px', height: '100px', display: 'inlineBlock', marginRight: '10px', marginBottom: '10px', float: 'left' };
  let oppositeStyle = { marginTop: '20px', clear: 'both', overflow: 'hidden' };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>租房管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/orderRoomManagement">预约看房管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>查看</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section" style={{ padding: 0 }}>
        <div style={marginStyle}>
          <span>预约编号：</span>{detailInfo.serial_no}
        </div>
        <div style={marginStyle}>
          <span>预约房源：</span>{detailInfo.address}
        </div>
        <div style={marginStyle}>
          <span>预约看房时间：</span>{detailInfo.reserve_time}
        </div>
        <div style={marginStyle}>
          <span>预约人：</span>{detailInfo.reserve_name}
        </div>
        <div style={marginStyle}>
          <span>联系电话：</span>{detailInfo.reserve_mobile}
        </div>
        <div style={marginStyle}>
          <span>业主姓名：</span>{detailInfo.member_name}
        </div>
        <div style={marginStyle}>
          <span>业主电话：</span>{detailInfo.member_mobile}
        </div>
        <div style={marginStyle}>
          <span>预约状态：</span>{detailInfo.status_desc}
        </div>
        <div style={marginStyle}>
          <span>看房留言：</span>{detailInfo.note}
        </div>
        <div style={marginStyle}>
          <span>带看备注：</span>{detailInfo.take_look_note}
        </div>
        {
          detailInfo.status == 3
            ? <div>
              <p style={{ fontWeight: 'bold', marginTop: '20px', marginBottom: '20px', borderTop: '1px solid #ccc' }}>
                签约内容
              </p>
              <div style={marginStyle}>
                <span>支付金额：</span>{detailInfo.contacts.first_period_amount ? `${detailInfo.contacts.first_period_amount}元` : ''}
              </div>
              <div style={marginStyle}>
                <span>房屋租金：</span>{detailInfo.contacts.rent_price ? `${detailInfo.contacts.rent_price}元/月` : ''}
              </div>
              <div style={marginStyle}>
                <span>房屋押金：</span>{detailInfo.contacts.pledge_amount ? `${detailInfo.contacts.pledge_amount}元` : ''}
              </div>
              <div style={marginStyle}>
                <span>支付方式：</span>{detailInfo.contacts.pay_period_desc}
              </div>
              <div style={marginStyle}>
                <span>租房周期：</span>{detailInfo.contacts.rent_start_time}-{detailInfo.contacts.rent_end_time}
              </div>
              <div style={{ clear: 'both', overflow: 'hidden', borderBottom: '1px dashed #ccc' }}>
                <p style={{ marginTop: '20px', marginBottom: '10px', float: 'left' }}>租房合同：</p>
                {detailInfo.contacts.contract_imgs
                  ? detailInfo.contacts.contract_imgs.map((value, index) => {
                    return (
                      <img src={value} key={index} onClick={() => imgVisible(value)} style={imgStyle}
                      />
                    )
                  })
                  : ''
                }
              </div>

              <Row>
                <Col span={8}>
                  <div style={marginStyle}>
                    <span>租客姓名：</span>{detailInfo.contacts.tenant_name}
                  </div>
                  <div style={marginStyle}>
                    <span>租客电话：</span>{detailInfo.contacts.tenant_mobile}
                  </div>
                  <div style={marginStyle}>
                    <span>租客身份证号：</span>{detailInfo.contacts.tenant_card_no}
                  </div>
                  <div style={oppositeStyle}>
                    <p style={{ float: 'left' }}>租客身份证正面：</p>
                    {detailInfo.contacts.tenant_cardimg
                      ? <img src={detailInfo.contacts.tenant_cardimg}
                        onClick={() => imgVisible(detailInfo.contacts.tenant_cardimg)}
                        style={imgStyle} />
                      : ''}
                  </div>
                  <div style={oppositeStyle}>
                    <p style={{ float: 'left' }}>租客身份证反面：</p>
                    {detailInfo.contacts.tenant_cardimg_back
                      ? <img src={detailInfo.contacts.tenant_cardimg_back}
                        onClick={() => imgVisible(detailInfo.contacts.tenant_cardimg_back)}
                        style={imgStyle} />
                      : ''}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={marginStyle}>
                    <span>业主姓名：</span>{detailInfo.contacts.member_name}
                  </div>
                  <div style={marginStyle}>
                    <span>业主电话：</span>{detailInfo.contacts.member_mobile}
                  </div>
                  <div style={marginStyle}>
                    <span>业主身份证号：</span>{detailInfo.contacts.member_card_no}
                  </div>
                  <div style={oppositeStyle}>
                    <p style={{ float: 'left' }}>业主身份证正面：</p>
                    {detailInfo.contacts.member_cardimg
                      ? <img src={detailInfo.contacts.member_cardimg}
                        onClick={() => imgVisible(detailInfo.contacts.member_cardimg)}
                        style={imgStyle} />
                      : ''}
                  </div>
                  <div style={oppositeStyle}>
                    <p style={{ float: 'left' }}>业主身份证反面：</p>
                    {detailInfo.contacts.member_cardimg_back
                      ? <img src={detailInfo.contacts.member_cardimg_back}
                        onClick={() => imgVisible(detailInfo.contacts.member_cardimg_back)}
                        style={imgStyle} />
                      : ''}
                  </div>
                </Col>
              </Row>
              <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
            : ''
        }
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    ViewOrderRoomModel: state.ViewOrderRoomModel
  }
})(ViewOrderRoom);
