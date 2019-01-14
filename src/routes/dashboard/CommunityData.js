import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Row, Col, Progress, Tooltip } from 'antd';
import Charts from "../../components/Charts/index";
import './Communitydata.less';

function CommunityData(props) {
  const { totalRepair, totalPatrol, totalPark, totalHouseStatus, totalPerson, totalHouseType,totalParkStatus,device } = props;
  
  return (
    <div className="dashboard-community">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>数据大盘</Breadcrumb.Item>
        <Breadcrumb.Item>小区数据概况</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={16} className="mb1 device">
        <Col span={8}>
          <Card title="监管设备">
            <div className="fl">
              <dl>
                <dt className="font">{device.totals}</dt>
                <dd>设备总数</dd>
              </dl>
              <dl className="fl">
                <dt>{device.normal}</dt>
                <dd>正常</dd>
              </dl>
              <dl className="fl">
                <dt>{device.error}</dt>
                <dd>异常</dd>
              </dl>
              <dl className="fl">
                <dt>{device.scarp}</dt>
                <dd>报废</dd>
              </dl>
            </div>
            {device.normal_percent > 0 ? <Progress className="fr" type="circle" percent={device.normal_percent} format={percent => `完好率${device.normal_percent}%`} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
        <Col span="8">
          <Card title="报修统计" extra={<a href="#/repair">更多</a>}>
            <div className="pie-name" style={{ Position: "absolute" }}>
              <div>{totalRepair.totals}</div>
              <p>7天报修总数</p>
            </div>
            {totalRepair.data && totalRepair.data.length > 0 ? <Charts id="charts-2-nk" legendShow={true} size="short" width="60%" type="pie" legend={totalRepair.data?totalRepair.data.map(item => {
              return item.name
            }) : null} pieData={totalRepair.data} /> : <div className="charts">暂无数据</div>}
            <div className="item-list">{totalRepair.data && totalRepair.data.length > 0 ? totalRepair.data.map(item => { return <p key={item.name}><span></span>{item.name}</p> }) : null}</div>
          </Card>
        </Col>
        <Col span="8">
          <Card title="巡更统计" extra={<a href="#/patrolRecord">更多</a>}>
            <div className="pie-name">
              <div>{totalPatrol.totals}</div>
              <p>7天巡更总数</p>
            </div>
            {totalPatrol.data && totalPatrol.data.length > 0 ? <Charts id="charts-3" size="short" width="50%" type="pie" legend={totalPatrol.data?totalPatrol.data.map(item => {
              return item.name
            }) : null} pieData={totalPatrol.data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="mb1">
        <Col span={12}>
          <Card title="停车" extra={<a href="#/carData">更多</a>}>
            <div className="pie-name">
              <div>{totalPark.totals}</div>
              <p>车流统计</p>
            </div>
            <div className="pie-name">
              <span></span>
              <div>{totalPark.use_percent}</div>
              <p>车位使用率</p>
            </div>
            {totalPark.data && totalPark.data.length > 0 ? <Charts id="charts-4" size="short" width="50%" type="pie" legend={totalPark.data?totalPark.data.map(item => {
              return item.name
            }) : null} pieData={totalPark.data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
        <Col span="12">
          <Card title="人行" extra={<p style={{margin:0}}><a href="#/openRecord" className="mr1">出入记录</a><a href="#/personData">更多</a></p>}>
            <div className="pie-name">
              <div>{totalPerson.totals}</div>
              <p>客流统计</p>
            </div>
            <div className="pie-name">
              <span></span>
              <div>{totalPerson.visitor}</div>
              <p>访客人流</p>
            </div>
            {totalPerson.data && totalPerson.data.length > 0 ? <Charts id="charts-5" size="short" width="50%" type="pie" legend={totalPerson.data?totalPerson.data.map(item => {
              return item.name
            }) : null} pieData={totalPerson.data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="mb1">
        <Col span={8}>
          <Card title="房屋状态" style={{fontSize:'14px'}}>
            <p style={{fontSize: '15px',marginTop:'6px',marginBottom:'0px' }}><span className="color color-green"></span>未售: {totalHouseStatus.unsold}</p>
            <p style={{fontSize: '15px',marginTop:'6px',marginBottom:'0px' }}><span className="color color-blue"></span>已售: {totalHouseStatus.sold}</p>
            <Tooltip title={'已售' + totalHouseStatus.unsold_percent + '%' + '，未售' + totalHouseStatus.sold_percent + '%' }>
              <Progress percent={100} successPercent={totalHouseStatus.unsold_percent} status="active"/>
            </Tooltip>
            <p style={{fontSize: '15px',marginTop:'6px',marginBottom:'0px' }}><span className="color color-blue"></span>已租: {totalHouseStatus.rented}</p>
            <Tooltip title={'已租' + totalHouseStatus.rented_percent+'%'}>
              <Progress percent={totalHouseStatus.rented_percent} status="active"/>
            </Tooltip>
          </Card>
        </Col>
        <Col span="8">
          <Card title="房屋类型">
            <div className="pie-name">
              <div>{totalHouseType.totals}</div>
              <p>房屋总数</p>
            </div>
            {totalHouseType.type_data && totalHouseType.type_data.length > 0 ? <Charts id="charts-7" size="short" width="50%" type="pie" legend={totalHouseType.type_data?totalHouseType.type_data.map(item => {
              return item.name
            }) : null} pieData={totalHouseType.type_data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
        <Col span="8">
          <Card title="车位状态">
            <div className="pie-name">
              <div>{totalParkStatus.totals}</div>
              <p>车位总数</p>
            </div>
            {totalParkStatus.data && totalParkStatus.data.length > 0 ? <Charts id="charts-8" size="short" width="50%" type="pie" legend={totalParkStatus.data?totalParkStatus.data.map(item => {
              return item.name
            }) : null} pieData={totalParkStatus.data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
      </Row>
    </div>
  )

}
function mapStateToProps(state) {
  return {
    ...state.CommunityDataModel,
  }
}
export default connect(mapStateToProps)(CommunityData);