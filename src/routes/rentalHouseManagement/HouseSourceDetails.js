import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function HouseSourceDetails (props) {
  const { dispatch, detailInfo, previewVisible, previewImage } = props;
  let styleList = {marginTop: '20px'};
  let imgStyle = {width: '100px', height: '100px', display: 'inlineBlock', marginRight: '10px', marginBottom: '10px', float: 'left'};
  let matingStyle = {background: '#43cfbc', color: '#fff', display: 'inline-block', marginRight: '4px', padding: '0 6px', borderRadius: '4px'};
  /*
  * 图片预览
  * value Object
  * */
  function imgVisible (value) {
    dispatch({
      type: 'HouseSourceDetailsModel/concat',
      payload: {
        previewVisible: true,
        previewImage: value
      }
    })
  }
  /*
  * 取消图片预览
  * */
  function handleCancel () {
    dispatch({
      type: 'HouseSourceDetailsModel/concat',
      payload: {
        previewVisible: false,
        previewImage: ''
      }
    })
  }

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>租房管理</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#/rentalHouseManagement">租房房源管理</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>查看</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section"  style={{padding: 0}}>
        <div style={styleList}>
          <span>房屋：</span>
          {detailInfo.group}{detailInfo.building}{detailInfo.unit}{detailInfo.room}
        </div>
        <div style={styleList}>
          <span>房屋面积：</span>
          {detailInfo.house_space ? `${detailInfo.house_space}㎡` : ''}
        </div>
        <div style={styleList}>
          <span>户型：</span>
          {detailInfo.room_num ? detailInfo.room_num : 0}室
          {detailInfo.hall_num ? detailInfo.hall_num : 0}厅
          {detailInfo.kitchen_num ? detailInfo.kitchen_num : 0}厨
          {detailInfo.toilet_num ? detailInfo.toilet_num : 0}卫
        </div>
        <div style={styleList}>
          <span>楼层：</span>
          {detailInfo.floor_level ? `第${detailInfo.floor_level}层` : ''}
          {detailInfo.floor_total ? `--共${detailInfo.floor_total}层` : ''}
        </div>
        <div style={styleList}>
          <span>出租类型：</span>
          {detailInfo.rent_way_desc}
          {detailInfo.rent_way == 2 && detailInfo.single_no != null ? `-${detailInfo.single_no}号` : ''}
        </div>
        <div style={styleList}>
          <span>期望租金：</span>
          {detailInfo.expired_rent_price ? `${detailInfo.expired_rent_price}元/月` : ''}
        </div>
        <div style={styleList}>
          <span>装修程度：</span>
          {detailInfo.decorate_degree_desc}
        </div>
        <div style={{clear: 'both', overflow: 'hidden', marginTop: '20px'}}>
          <p style={{float: 'left'}}>房屋图片：</p>
          {detailInfo.imgs
            ? detailInfo.imgs.map((value, index) => {
              return (
                <img src={value} onClick={() => imgVisible(value)} style={imgStyle} key={index}/>
              )
            })
            : ''}
        </div>
        <div style={styleList}>
          <span>标题：</span>
          {detailInfo.rent_title}
        </div>
        <div style={styleList}>
          <span>房屋描述：</span>
          {detailInfo.rent_desc}
        </div>
        <div style={styleList}>
          <span>周边配套：</span>
          {detailInfo.labels
            ? detailInfo.labels.map((value, index) => {
              return (
                <span key={index} style={matingStyle}>
                  {value.name}
                </span>)
            })
            : ''}
        </div>
        <div style={styleList}>
          <span>支付方式：</span>
          {detailInfo.pay_way_desc}
        </div>
        <div style={styleList}>
          <span>业主姓名：</span>
          {detailInfo.member_name}
        </div>
        <div style={styleList}>
          <span>业主电话：</span>
          {detailInfo.member_mobile}
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
    ...state.HouseSourceDetailsModel
  }
})(HouseSourceDetails);
