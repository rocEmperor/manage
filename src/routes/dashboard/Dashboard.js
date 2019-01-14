import React from 'react';
import { connect } from 'dva';
import { Row, Col, Progress } from 'antd';
import './Dashboard.less';
import Charts from "../../components/Charts/index";

function Dashboard(props) {
  const { resident, error_percent, normal_percent, healthy, device_nums, community_name, dynamic, num_ge, num_shi, num_bai, num_qian, num_wan, repair, flux, maxSize, maxSize_flux} = props;
  
  function goDetail(id){
    if(id == 4){
      window.location.href = "#/repair";
    } else if (id == 3) {
      window.location.href = "#/complaintManagement";
    } else if (id == 2) {
      window.location.href = "#/openRecord";
    } else if (id == 1) {
      window.location.href = "#/getInManagement";
    } else if (id == 5) {
      window.location.href = "#/getOutManagement";
    }
  }
  return (
    <div className="dashboard">
      <h2>{community_name}</h2>
      <Row gutter={16} className="mb1">
        <Col span={7}>
          <div className="owner title">
            <p style={{ marginBottom: '30px' }}>业主身份</p>
            {resident.length > 0 ? <Charts id="charts-3-dashboard" size="short" radius={['20%', '50%']} legendShow={true} type="pie" roseType color={['#f38747', '#f7dc3e', '#6ed66d']} legend={resident.map(item => {
              return item.name
            })} pieData={resident} /> : <div className="charts">暂无数据</div>}
          </div>
          <div className="repair title">
            <p>报事报修</p>
            {repair && repair.yAxis.length > 0 ? <Charts id="charts-dashboard-line" size="short" noPercent maxSize={maxSize <= 10 ? 10 : ''} legendTextStyle="#5d71a2" lineColor="#5d71a2" color={['#eb4d50', '#f7dc3e']} type="line" legend={repair.yAxis ? repair.yAxis.map((item, index) => {
              return item.name
            }) : null} xAxis={repair.xAxis} yAxis={repair.yAxis} /> : <div className="charts">暂无数据</div>}
          </div>
        </Col>
        <Col span={10}>
          <div className="main">
            <p>总设备数</p>
            <div className="dashboard-num">
              <span>{num_wan}</span>
              <span>{num_qian}</span>
              <span>{num_bai}</span>
              <span>{num_shi}</span>
              <span>{num_ge}</span>
            </div>
            <Row gutter={16} className="press">
              <Col span={12}>
                <p>设备异常率</p>
                <Progress type="circle" percent={error_percent} width={90} status="exception" format={percent => `${percent} %`}/>
              </Col>
              <Col span={12}>
                <p>设备完好率</p>
                <Progress type="circle" percent={normal_percent} width={90} format={percent => `${percent} %`} status="active"/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="health title">
                  <p>系统健康等级</p>
                  {healthy.length > 0 ? healthy.map((item,index)=>{
                    if (item.level == 4){
                      return <div key={index}><span className="health-name">{item.name}</span><Progress percent={item.value} status="exception" format={percent => `${percent} %`}/><i>较弱</i></div>
                    } else if (item.level == 3){
                      return <div key={index}><span className="health-name">{item.name}</span><Progress percent={item.value} status="active"/><i>一般</i></div>
                    } else if (item.level == 2) {
                      return <div key={index}><span className="health-name">{item.name}</span><Progress percent={item.value} status="active"/><i>良好</i></div>
                    } else if (item.level == 1) {
                      return <div key={index}><span className="health-name">{item.name}</span><Progress percent={item.value} format={percent => `${percent} %`} status="active"/><i>健康</i></div>
                    }
                  }) : <div className="charts">暂无数据</div>}
                </div>
              </Col>
              <Col span={12}>
                <div className="health title">
                  <p>设备数量分布</p>
                  {device_nums.length > 0 ?<span>
                    <Charts id="charts-3-dashboard1" size="short" legendShow={true} radius={['30%', '50%']}  type="pie" color={['#0da5ff', '#ff9035', '#6ed66d', '#17caf2', '#9b6ff2', '#33b561', '#ef515b', '#f7dc3e', '#939cb2']} legend={device_nums.map(item => {
                      return item.name
                    })} pieData={device_nums} />
                    <ul>
                      {device_nums.map((item,index)=>{
                        return <li className={"li" + index} key={index}><span></span>{item.name}:{item.value}</li>
                      })}
                    </ul>
                  </span> : <div className="charts">暂无数据</div>}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={7}>
          <div className="owner title">
            <p>系统实时动态</p>
            <div className="list">
              {dynamic.length > 0 ? dynamic.map((item,index)=>{
                if(item.type == 4){
                  return <p key={index} onClick={goDetail.bind(this,item.type)}><i className="repairi"></i><span>报修</span><span className="time">{item.time}</span><span className="info">{item.message}</span></p>
                } else if(item.type == 3){
                  return <p key={index} onClick={goDetail.bind(this, item.type)}><i className="complaini"></i><span>投诉</span><span className="time">{item.time}</span><span className="info">{item.message}</span></p>
                } else if (item.type == 2) {
                  return <p key={index} onClick={goDetail.bind(this, item.type)}><i className="personi"></i><span>人行</span><span className="time">{item.time}</span><span className="info">{item.message}</span></p>
                } else if (item.type == 1 || item.type == 5 ) {
                  return <p key={index} onClick={goDetail.bind(this, item.type)}><i className="parki"></i><span>停车</span><span className="time">{item.time}</span><span className="info">{item.message}</span></p>
                }
              }) : <div className="charts">暂无数据</div>}
            </div>
          </div>
          <div className="repair title">
            <p>客流统计</p>
            {flux && flux.yAxis.length > 0 ? <Charts id="charts-dashboard-line1" size="short" noPercent maxSize={maxSize_flux <= 10 ? 10 : ''} legendTextStyle="#5d71a2" lineColor="#5d71a2" color={['#0da5ff', '#6ace6c']} type="line" legend={flux.yAxis ? flux.yAxis.map((item, index) => {
              return item.name
            }) : null} xAxis={flux.xAxis} yAxis={flux.yAxis} /> : <div className="charts">暂无数据</div>}
          </div>
        </Col>
      </Row>
    </div>
  )

}
function mapStateToProps(state) {
  return {
    ...state.DashboardModel,
  }
}
export default connect(mapStateToProps)(Dashboard);