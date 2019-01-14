import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Row, Col, Button } from 'antd';
import Charts from "../../components/Charts/index";

function PersonData(props){
  const { totalsScale, totalPerson, totalStyle, dispatch,flag, deviceFlag,device } = props;

  function changeList (type) {
    dispatch({
      type: 'PersonDataModel/concat',
      payload: {
        flag: type,
        deviceFlag:""
      }
    });
    let params = {
      community_id: sessionStorage.getItem("communityId"),
      type: type
    }
    dispatch({
      type: 'PersonDataModel/exitTraffic',
      payload: params
    });
  }
  function change(id){
    dispatch({
      type: 'PersonDataModel/concat',
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
      type: 'PersonDataModel/exitTraffic',
      payload: params
    });
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>数据大盘</Breadcrumb.Item>
        <Breadcrumb.Item>人行数据概况</Breadcrumb.Item>
      </Breadcrumb>
      <Row style={{ marginRight: '10px' }}>
        <Col span={12}>
          <Card className="section">
            <h2>今日出入概况</h2>
            {totalPerson.length > 0 ?<Charts id="charts-1" type="pie" legend={totalPerson.map(item => {
              return item.name
            })} pieData={totalPerson} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
        <Col span={12} className="ml1" style={{ marginRight: '-10px' }}>
          <Card className="section">
            <h2>出行方式统计</h2>
            {totalStyle.length>0?<Charts id="charts-2" height="100px" type="pie" legend={totalStyle.map(item => {
              return item.name
            })} pieData={totalStyle} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
      </Row>
      <Card className="section">
        <Row>
          <h2>出入流量趋势</h2>
          <Row>
            <Button className="mr1" onClick={() => changeList(1)} type={flag === 1 ? "primary" : ""}>今日</Button>
            <Button className="mr1" onClick={() => changeList(2)} type={flag === 2 ? "primary" : ""}>昨日</Button>
            <Button className="mr1" onClick={() => changeList(3)} type={flag === 3 ? "primary" : ""}>7日</Button>
            <Button onClick={() => changeList(4)} type={flag === 4 ? "primary" : ""}>30日</Button>
          </Row>
          <Row>
            <Button className="mt1 mr1" type={deviceFlag === '' ? "primary" : ""} onClick={() => change('')}>全部</Button>
            {
              device ? device.map((items,indexs) => {
                return <Button key={indexs} className="mt1 mr1" onClick={() => change(items.id)} type={deviceFlag === items.id ? "primary" : ""}>{items.name}</Button>
              }):null
            }
          </Row>
          {totalsScale.data ? <Charts id="charts-1-line" type="line" noPercent intervalNum={1} legend={totalsScale.data ? totalsScale.data.map((item, index) => {
            return item.name
          }) : null} xAxis={totalsScale.time} yAxis={totalsScale.data} /> : <div className="charts">暂无数据</div>}
        </Row>
      </Card>
    </div>
  )

}
function mapStateToProps(state) {
  return {
    ...state.PersonDataModel,
  }
}
export default connect(mapStateToProps)(PersonData);
