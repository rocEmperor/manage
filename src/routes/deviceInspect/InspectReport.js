import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Row, Col, Card, DatePicker, Progress,Table } from 'antd';
const { RangePicker } = DatePicker;
import './index.css';
import Report1 from "../../../static/images/task.png";
import Report2 from "../../../static/images/device.png";

function InspectReport(props) {
  const { dispatch, form,paginationTotal,params,loading, paginationTotals,device, issue, inspect,errorData } = props;
  
  const { getFieldDecorator } = form;
  let styleList = { textAlign: 'center', marginTop: '20px' };
  let fontStyle = { fontSize: '22px' };
  let imgList = { width: '70px' }

  //巡检数据与异常数据搜索
  function handleDate(type,date) {
    if (date.length == 0) {
      return;
    }
    let payload = {
      start_at: date[0].format('YYYY-MM-DD'),
      end_at: date[1].format('YYYY-MM-DD'),
      page: 1,
      rows: 5,
      community_id: sessionStorage.getItem("communityId")
    }
    if(type == 1){
      dispatch({ type: 'InspectReport/inspectData', payload })
    }else{
      dispatch({ type: 'InspectReport/errorData', payload })
    }
    
  }
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }  
  const tableProps = {
    columns: [{
      title: '巡检人员',
      dataIndex: 'user_name',
      key: 'user_name',
      render: renderColumns
    }, {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
      render: renderColumns
    }, {
      title: '任务次数',
      dataIndex: 'task_count',
      key: 'task_count',
      render: renderColumns
    }, {
      title: '完成次数',
      dataIndex: 'finish_count',
      key: 'finish_count',
      render: renderColumns
    }, {
      title: '部分完成次数',
      dataIndex: 'part_count',
      key: 'part_count',
      render: renderColumns
    }, {
      title: '未完成次数',
      dataIndex: 'unfinish_count',
      key: 'unfinish_count',
      render: renderColumns
    }, {
      title: '完成率',
      dataIndex: 'finish_rate',
      key: 'finish_rate',
      render: renderColumns
    }],
    dataSource: inspect.list,
    pagination: {
      total: paginationTotal ? Number(paginationTotal) : '',
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 5,
      showTotal: (total, range) => `共有 ${paginationTotal} 条`,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'InspectReport/inspectData',
          payload: { ...params, page }
        })
      },
    },
    rowKey: (record, index) => index,
    loading: loading
  }
  const tableProps1 = {
    columns: [{
      title: '设备名称',
      dataIndex: 'device_name',
      key: 'device_name',
      render: renderColumns
    }, {
      title: '设备编号',
      dataIndex: 'device_no',
      key: 'device_no',
      render: renderColumns
    }, {
      title: '设备巡检次数',
      dataIndex: 'inspect_count',
      key: 'inspect_count',
      render: renderColumns
    }, {
      title: '设备正常次数',
      dataIndex: 'normal_count',
      key: 'normal_count',
      render: renderColumns
    }, {
      title: '设备异常次数',
      dataIndex: 'issue_count',
      key: 'issue_count',
      render: renderColumns
    }, {
      title: '设备异常率',
      dataIndex: 'issue_rate',
      key: 'issue_rate',
      render: renderColumns
    }],
    dataSource: errorData.list,
    pagination: {
      total: paginationTotals ? Number(paginationTotals) : '',
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 5,
      showTotal: (total, range) => `共有 ${paginationTotals} 条`,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'InspectReport/errorData',
          payload: { ...params, page }
        })
      },
    },
    rowKey: (record, index) => index,
    loading: loading
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
        <Breadcrumb.Item>巡检报表</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={16} style={{ "marginBottom": "10px" }}>
        <Col span={12} style={styleList}>
          <Card className="onlinePayment" title="设备概况">
            <Col span={24}>
              <Progress className="mb2" type="circle" percent={device.rate} format={percent => `正常设备占比${device.rate?device.rate:''}%`} />
            </Col>
            <Col span={8}>
              <dl>
                <dt style={fontStyle}>{device.normal}</dt>
                <dd>正常设备数量</dd>
              </dl>
            </Col>
            <Col span={8}>
              <dl>
                <dt style={fontStyle}>{device.issue}</dt>
                <dd>异常设备数量</dd>
              </dl>
            </Col>
            <Col span={8}>
              <dl>
                <dt style={fontStyle}>{device.scrap}</dt>
                <dd>报废设备数量</dd>
              </dl>
            </Col>
          </Card>
        </Col>
        <Col span={12} style={styleList}>
          <Card className="onlinePayment" title="设备异常率">
            <Col span={24}>
              <Progress type="circle" className="mb2" percent={issue.rate} format={percent => `设备异常占比${issue.rate?issue.rate:''}%`} />
            </Col>
            <Col span={8}>
              <dl>
                <dt style={fontStyle}>{issue.totals}</dt>
                <dd>设备巡检次数</dd>
              </dl>
            </Col>
            <Col span={8}>
              <dl>
                <dt style={fontStyle}>{issue.normal}</dt>
                <dd>正常次数</dd>
              </dl>
            </Col>
            <Col span={8}>
              <dl>
                <dt style={fontStyle}>{issue.issue}</dt>
                <dd>异常次数</dd>
              </dl>
            </Col>
          </Card>
        </Col>
      </Row>
      <Card title="巡检数据统计" className="section child-section">
        <Form layout="inline" className="selectChart">
          <Form.Item>
            {getFieldDecorator('date')(
              <RangePicker onChange={handleDate.bind(this,1)} style={{ width: 300 }} />
            )}
          </Form.Item>
        </Form>
        <Row style={styleList}>
          <Col span={9} style={{textAlign:'left'}}>
            <Col span={8}>
              <img src={Report1} style={imgList}/>
            </Col>
            <Col span={16}>
              <dl>
                <dt style={{marginTop: '10px'}}>任务总次数</dt>
                <dd style={{fontSize: '22px', marginLeft: '16px'}}>{inspect.task_count}</dd>
              </dl>
            </Col>
          </Col>
          <Col span={3}>
            <dl>
              <dt style={fontStyle}>{inspect.fact_count}</dt>
              <dd>实际次数</dd>
            </dl>
          </Col>
          <Col span={3}>
            <dl>
              <dt style={fontStyle}>{inspect.finish_count}</dt>
              <dd>完成次数</dd>
            </dl>
          </Col>
          <Col span={3}>
            <dl>
              <dt style={fontStyle}>{inspect.part_count}</dt>
              <dd>部分完成次数</dd>
            </dl>
          </Col>
          <Col span={3}>
            <dl>
              <dt style={fontStyle}>{inspect.unfinish_count}</dt>
              <dd>未完成次数</dd>
            </dl>
          </Col>
          <Col span={3}>
            <dl>
              <dt style={fontStyle}>{inspect.finish_rate}%</dt>
              <dd>完成率</dd>
            </dl>
          </Col>
        </Row>
        <Table className="mt2" {...tableProps} />
      </Card>
      <Card title="异常设备统计" className="section child-section">
        <Form layout="inline" className="selectChart">
          <Form.Item>
            {getFieldDecorator('date1')(
              <RangePicker onChange={handleDate.bind(this,2)} style={{ width: 300 }} />
            )}
          </Form.Item>
        </Form>
        <Row style={styleList}>
          <Col span={9} style={{textAlign:'left'}}>
            <Col span={8}>
              <img src={Report2} style={imgList}/>
            </Col>
            <Col span={16}>
              <dl>
                <dt style={{marginTop: '10px'}}>设备巡检总次数</dt>
                <dd style={{fontSize: '22px', marginLeft: '30px'}}>{errorData.inspect_count}</dd>
              </dl>
            </Col>
          </Col>
          <Col span={5}>
            <dl>
              <dt style={fontStyle}>{errorData.normal_count}</dt>
              <dd>设备正常次数</dd>
            </dl>
          </Col>
          <Col span={5}>
            <dl>
              <dt style={fontStyle}>{errorData.issue_count}</dt>
              <dd>设备异常次数</dd>
            </dl>
          </Col>
          <Col span={5}>
            <dl>
              <dt style={fontStyle}>{errorData.issue_rate}%</dt>
              <dd>设备异常率</dd>
            </dl>
          </Col>
        </Row>
        <Table className="mt2" {...tableProps1} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.InspectReport,
  }
}
export default connect(mapStateToProps)(Form.create()(InspectReport));