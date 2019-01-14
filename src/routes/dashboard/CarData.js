import React from 'react';
import { connect } from 'dva';
import './Cardata.less';
import { Breadcrumb, Card, Row, Col, Button } from 'antd';
import Charts from "../../components/Charts/index";
import carData1 from "../../../static/images/carData1.png";
import carData2 from "../../../static/images/carData2.png";
import carData3 from "../../../static/images/carData3.png";
import carData4 from "../../../static/images/carData4.png";

function CarData(props) {
  const { totalsScale, exit, entry, visitor, free, flag, deviceFlag, device, dispatch } = props;
  function changeList(type) {
    dispatch({
      type: 'CarDataModel/concat',
      payload: {
        flag: type,
        deviceFlag: ""
      }
    });
    let params = {
      community_id: sessionStorage.getItem("communityId"),
      type: type
    }
    dispatch({
      type: 'CarDataModel/carTraffic',
      payload: params
    });
  }
  function change(id) {
    dispatch({
      type: 'CarDataModel/concat',
      payload: {
        deviceFlag: id,
      }
    });
    let params = {
      community_id: sessionStorage.getItem("communityId"),
      device: id,
      type: flag
    }
    dispatch({
      type: 'CarDataModel/carTraffic',
      payload: params
    });
  }
  
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>数据大盘</Breadcrumb.Item>
        <Breadcrumb.Item>行车数据概况</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <h2>今日车辆概况</h2>
        <Row >
          <Col span={6} >
            <div className="num">
              <img src={carData1} title="logo" alt="logo" />
              <p>入口总流量</p>
              <h2>{exit}</h2>
            </div>
          </Col>
          <Col span={6}>
            <div className="num">
              <img src={carData2} title="logo" alt="logo" />
              <p>出口总流量</p>
              <h2>{entry}</h2>
            </div>
          </Col>
          <Col span={6}>
            <div className="num">
              <img src={carData3} title="logo" alt="logo" />
              <p>访客总流量</p>
              <h2>{free}</h2>
            </div>
          </Col>
          <Col span={6}>
            <div className="num">
              <img src={carData4} title="logo" alt="logo" />
              <p>剩余车位</p>
              <h2>{visitor}</h2>
            </div>
          </Col>
        </Row>
      </Card>
      <Card className="section">
        <Row>
          <h2>车辆流量趋势</h2>
          <Row >
            <Button className="mr1" onClick={() => changeList(1)} type={flag === 1 ? "primary" : ""}>今日</Button>
            <Button className="mr1" onClick={() => changeList(2)} type={flag === 2 ? "primary" : ""}>昨日</Button>
            <Button className="mr1" onClick={() => changeList(3)} type={flag === 3 ? "primary" : ""}>7日</Button>
            <Button onClick={() => changeList(4)} type={flag === 4 ? "primary" : ""}>30日</Button>
          </Row>
          <Row className="mt1">
            <Button className="mt1 mr1" type={deviceFlag === '' ? "primary" : ""} onClick={() => change('')}>全部</Button>
            {
              device ? device.map((items, indexs) => {
                return <Button key={indexs} className="mt1 mr1" onClick={() => change(items.id)} type={deviceFlag === items.id ? "primary" : ""}>{items.name}</Button>
              }) : null
            }
          </Row>
          {totalsScale.data ? <Charts id="charts-1-line" noPercent type="line" intervalNum={1} legend={totalsScale.data ? totalsScale.data.map((item, index) => {
            return item.name
          }) : null} xAxis={totalsScale.time} yAxis={totalsScale.data} /> : <div className="charts">暂无数据</div>}
        </Row>
      </Card>
    </div>
  )

}
function mapStateToProps(state) {
  return {
    ...state.CarDataModel,
  }
}
export default connect(mapStateToProps)(CarData);