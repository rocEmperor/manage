import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card } from 'antd';
import './index.less';

function ParkingInformation(props) {
  const { info } = props;
  function jump(id){
    if(id == 1){
      window.location.href = '#/carportManagement'
    }else if(id == 2){
      window.location.href = '#/getInManagement'
    }else if(id == 3){
      window.location.href = '#/getOutManagement'
    }else if(id == 4){
      window.location.href = '#/carOwnerManagement'
    }
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>停车管理</Breadcrumb.Item>
        <Breadcrumb.Item>停车场概况</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Card title="车位信息" className="parking-card" style={{ width: '100%', cursor: "pointer", }} onClick={jump.bind(this, 1)}>
          <div className="main-info">
            <i className="iconfont icon-zongchewei parking-icon" style={{ color: '#76bdf0' }}></i>
            <div>
              <p>总车位（个）</p>
              <p className="f20">{info.lot_all}</p>
            </div>
            <span></span>
          </div>
          <div className="main-info">
            <div>
              <p>已售车位（个）</p>
              <p className="f20">{info.lot_sell}</p>
            </div>
          </div>
          <div className="main-info">
            <div>
              <p>已租车位（个）</p>
              <p className="f20">{info.lot_rent}</p>
            </div>
          </div>
          <div className="main-info">
            <div>
              <p>空闲车位（个）</p>
              <p className="f20">{info.lot_free}</p>
            </div>
          </div>
        </Card>
        <Card title="在库车辆信息" className="parking-card" style={{ width: '100%', cursor: "pointer", }} onClick={jump.bind(this, 2)}>
          <div className="main-info">
            <i className="iconfont icon-zaikucheliang parking-icon" style={{ color: '#faa78d' }}></i>
            <div>
              <p>当前在场车辆总数</p>
              <p className="f20">{info.park_in}</p>
            </div>
            <span></span>
          </div>
          <div className="main-info">
            <div>
              <p>当前空余车位</p>
              <p className="f20">{info.park_free}</p>
            </div>
          </div>
        </Card>
        <Card title="临停收费总览" className="parking-card" style={{ width: '100%', cursor: "pointer", }} onClick={jump.bind(this, 3)}>
          <div className="main-info">
            <i className="iconfont icon-lintingshoufei parking-icon" style={{ color: '#fdcd8d' }}></i>
            <div>
              <p>昨日临停收费（元）</p>
              <p className="f20">{info.amount ? info.amount.tmp.yesterday : ''}</p>
            </div>
            <span></span>
          </div>
          <div className="main-info">
            <div>
              <p>近7天临停收费（元）</p>
              <p className="f20">{info.amount ? info.amount.tmp.week : ''}</p>
            </div>
          </div>
          <div className="main-info">
            <div>
              <p>近30天临停收费（元）</p>
              <p className="f20">{info.amount ? info.amount.tmp.month : ''}</p>
            </div>
          </div>
          <div className="main-info">
            <div>
              <p>近一年临停收费（元）</p>
              <p className="f20">{info.amount ? info.amount.tmp.year : ''}</p>
            </div>
          </div>
        </Card>
        <Card title="车位租赁收费总览" className="parking-card" style={{ width: '100%', cursor: "pointer", }} onClick={jump.bind(this, 4)}>
          <div className="main-info">
            <i className="iconfont icon-zulinshoufei parking-icon" style={{ color: '#95b0ea' }}></i>
            <div>
              <p>昨日租赁收费（元）</p>
              <p className="f20">{info.amount ? info.amount.rent.yesterday : ''}</p>
            </div>
            <span></span>
          </div>
          <div className="main-info">
            <div>
              <p>近7天租赁收费（元）</p>
              <p className="f20">{info.amount ? info.amount.rent.week : ''}</p>
            </div>
          </div>
          <div className="main-info">
            <div>
              <p>近30天租赁收费（元）</p>
              <p className="f20">{info.amount ? info.amount.rent.month : ''}</p>
            </div>
          </div>
          <div className="main-info">
            <div>
              <p>近1年租赁收费（元）</p>
              <p className="f20">{info.amount ? info.amount.rent.year : ''}</p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.ParkingInformationModels };
}
export default connect(mapStateToProps)(Form.create()(ParkingInformation));