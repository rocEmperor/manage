import React from 'react';
import { connect } from "dva";
import { Form, Breadcrumb, Card, Row, Col, DatePicker, Avatar, Table } from 'antd';
const { RangePicker } = DatePicker;
import Charts from "../../../components/Charts/index";
import './PatrolData.css';
function PatrolData(props) {
  const { dispatch, time, cycleActive1, cycleActive2, totals, users, list, piedata, community_id } = props;
  //没有数据
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  //表格1
  const tableProps1 = {
    columns: [{
      title: '巡更人员',
      dataIndex: 'name',
      key: 'name',
      render: renderColumns
    }, {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
      render: renderColumns
    }, {
      title: '应巡次数',
      dataIndex: 'task_num',
      key: 'task_num'
    }, {
      title: '实际次数',
      dataIndex: 'actual_num',
      key: 'actual_num'
    }, {
      title: '正常次数',
      dataIndex: 'normal_num',
      key: 'normal_num'
    }, {
      title: '旷巡次数',
      dataIndex: 'error_num',
      key: 'error_num'
    }],
    dataSource: users,
    pagination: false,
    rowKey: record => record.user_id
  }
  //表格2
  const tableProps2 = {
    columns: [{
      title: '巡更人员',
      dataIndex: 'name',
      key: 'name',
      render: renderColumns
    }, {
      title: '应巡次数',
      dataIndex: 'task_num',
      key: 'task_num',
    }, {
      title: '旷巡次数',
      dataIndex: 'error_num',
      key: 'error_num'
    }, {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank'
    }],
    dataSource: list,
    pagination: false,
    rowKey: record => record.user_id
  }

  function cycleChoose(activeNum, activeName) {
    if (activeName == "active1") {
      dispatch({
        type: 'PatrolData/concat',
        payload: {
          cycleActive1: activeNum
        }
      });
      dispatch({
        type: 'PatrolData/getReport',
        payload: {
          community_id,
          type: activeNum + 1
        }
      });
    } else if (activeName == "active2") {
      dispatch({
        type: 'PatrolData/concat',
        payload: {
          cycleActive2: activeNum
        }
      });
      dispatch({
        type: 'PatrolData/getReportRank',
        payload: {
          community_id,
          type: activeNum + 1
        }
      });
    }
  }
  function onChangeData(activeName, dateString) { 


    
    if (dateString && dateString.length > 0){
      if (activeName == "active1") {
        dispatch({
          type: 'PatrolData/getReport',
          payload: {
            community_id,
            type: 4,
            start_time: dateString["0"].format('YYYY-MM-DD'),
            end_time: dateString["1"].format('YYYY-MM-DD')
          }
        });
      } else if (activeName == "active2") {
        dispatch({
          type: 'PatrolData/getReportRank',
          payload: {
            community_id,
            type: 4,
            start_time: dateString["0"].format('YYYY-MM-DD'),
            end_time: dateString["1"].format('YYYY-MM-DD')
          }
        });
      }
    }
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item>数据报表</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Row className="pb2">
        <Col span={12}><h2>巡更数据统计</h2></Col>
        <Col span={12}>
          <span className="p_title">
            {time.map((val, index) => { return <a style={{marginRight:"10px"}} className={(index) == cycleActive1 ? "active" : null} onClick={cycleChoose.bind(this, index, "active1")} key={index}>{val.value}</a> })}
          </span>
          <RangePicker onChange={onChangeData.bind(this, "active1")} />
        </Col>
      </Row>
      <Row gutter={48} className="pb2">
        <Col span={6} style={{ borderRight: '1px solid #ebebeb' }}>
          <Row>
            <Col span={6}><Avatar  icon="user" style={{ backgroundColor: '#00b6f0' }} /></Col>
            <Col span={18}>
              <div>应巡次数</div>
              <h1>{totals.task_num ? totals.task_num : 0}</h1>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <div>实际次数</div>
          <h1>{totals.actual_num ? totals.actual_num : 0}</h1>
        </Col>
        <Col span={6}>
          <div>正常次数</div>
          <h1>{totals.normal_num ? totals.normal_num : 0}</h1>
        </Col>
        <Col span={6}>
          <div>旷巡次数</div>
          <h1>{totals.error_num ? totals.error_num : 0}</h1>
        </Col>
      </Row>
      <Table {...tableProps1} className="pb2" />
      <Row className="pb2">
        <Col span={12}>
          <div className="pb2">
            <span className="p_title">
              {time.map((val, index) => { return <a className={(index) == cycleActive2 ? "active" : null} onClick={cycleChoose.bind(this, index, "active2")} key={index}>{val.value}</a> })}
            </span>
            <RangePicker onChange={onChangeData.bind(this, "active2")} />
          </div>
          <h2 className="result-search">旷巡排行榜</h2>
          {piedata && piedata.length > 0 ?
            <Charts id="charts-1" type="pie" legend={list.map(item => { return item.name })} pieData={piedata} xAxis={list.map(item => { return item.percent_actual_num })} />
            : <div className="charts">暂无数据</div>}
        </Col>
        <Col span={12}>
          <Table {...tableProps2} />
        </Col>
      </Row>
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.PatrolData,
    loading: state.loading.models.PatrolData
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolData));