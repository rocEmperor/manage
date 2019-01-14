import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Row, Col, Card, DatePicker } from 'antd';
import Charts from "../../../components/Charts/index.js";
import './RepairCount.css';
import moment from 'moment';
const { RangePicker } = DatePicker;
let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth() + 1;
let day = dateNow.getDate();
dateNow.setTime(dateNow.getTime() - 24 * 60 * 60 * 1000);

function RepairCount(props) {
  const { dispatch, form, order_id, order, channel_id, channel, echart2, type_total, type, echart3, score_total, score, flag, order2, community_id, channel2 } = props;
  const { getFieldDecorator } = form;
  const echart1 = [{
    'data': [
      channel.life,
      channel.front,
      channel.phone,
      channel.dingding,
      channel.property,
      channel.reviews
    ],
    'type': 'bar',
  }];
  //布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }
  function checkOrder(val) {
    dispatch({
      type: 'RepairCount/concat',
      payload: {
        order_id: val
      }
    })
    if (val == 1) {
      dispatch({
        type: 'RepairCount/concat',
        payload: {
          order: {
            total_num: order2.week.total_num,
            process: order2.week.process,
            confirm: order2.week.confirm,
            reject: order2.week.reject,
            pending: order2.week.pending,
            completed: order2.week.completed,
            end: order2.week.end,
            review: order2.week.review,
            nullify: order2.week.nullify,
            recheck: order2.week.recheck,
          }
        }
      })
    } else if (val == 2) {
      dispatch({
        type: 'RepairCount/concat',
        payload: {
          order: {
            total_num: order2.month.total_num,
            process: order2.month.process,
            confirm: order2.month.confirm,
            reject: order2.month.reject,
            pending: order2.month.pending,
            completed: order2.month.completed,
            end: order2.month.end,
            review: order2.month.review,
            nullify: order2.month.nullify,
            recheck: order2.month.recheck,
          }
        }
      })
    } else if (val == 3) {
      dispatch({
        type: 'RepairCount/concat',
        payload: {
          order: {
            total_num: order2.year.total_num,
            process: order2.year.process,
            confirm: order2.year.confirm,
            reject: order2.year.reject,
            pending: order2.year.pending,
            completed: order2.year.completed,
            end: order2.year.end,
            review: order2.year.review,
            nullify: order2.year.nullify,
            recheck: order2.year.recheck,
          }
        }
      })
    }
  }
  //
  function checkChannel(val) {
    dispatch({
      type: 'RepairCount/concat',
      payload: {
        channel_id: val
      }
    })
    if (val == 1) {
      dispatch({
        type: 'RepairCount/concat',
        payload: {
          channel: {
            total_num: channel2.week.total_num,
            life: channel2.week.life,
            front: channel2.week.front,
            phone: channel2.week.phone,
            dingding: channel2.week.dingding,
            property: channel2.week.property,
            reviews: channel2.week.reviews,
          }
        }
      })
    } else if (val == 2) {
      dispatch({
        type: 'RepairCount/concat',
        payload: {
          channel: {
            total_num: channel2.month.total_num,
            life: channel2.month.life,
            front: channel2.month.front,
            phone: channel2.month.phone,
            dingding: channel2.month.dingding,
            property: channel2.month.property,
            reviews: channel2.month.reviews,
          }
        }
      })
    } else if (val == 3) {
      dispatch({
        type: 'RepairCount/concat',
        payload: {
          channel: {
            total_num: channel2.year.total_num,
            life: channel2.year.life,
            front: channel2.year.front,
            phone: channel2.year.phone,
            dingding: channel2.year.dingding,
            property: channel2.year.property,
            reviews: channel2.year.reviews,
          }
        }
      })
    }
  }
  //
  function handleTypeDate(date) {
    dispatch({
      type: 'RepairCount/getRepairTypeStatistic',
      payload: {
        community_id,
        start: date[0] ? date[0].format('YYYY-MM-DD') : '',
        end: date[0] ? date[1].format('YYYY-MM-DD') : '',
      }
    })
  }
  //
  function handleScoreDate(date) {
    dispatch({
      type: 'RepairCount/getRepairScoreStatistic',
      payload: {
        community_id,
        start: date[0] ? date[0].format('YYYY-MM-DD') : '',
        end: date[0] ? date[1].format('YYYY-MM-DD') : '',
      }
    })
  }
  
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>报修管理</Breadcrumb.Item>
      <Breadcrumb.Item>报修统计</Breadcrumb.Item>
    </Breadcrumb>
    <Row className="mt1">
      <Col span="12" style={{ "padding": "0 8px 0 0" }}>
        <Card>
          <h2>报修工单统计</h2>
          <p className="p-title">
            <a className={order_id == 1 ? "active" : ""} onClick={checkOrder.bind(this, '1')}>近7天</a>
            <a className={order_id == 2 ? "active" : ""} onClick={checkOrder.bind(this, '2')}>近30天</a>
            <a className={order_id == 3 ? "active" : ""} onClick={checkOrder.bind(this, '3')}>近1年</a>
          </p>
          <div className="nums">
            <dl><dt>{order.total_num}</dt><dd>工单数量</dd></dl>
            <dl><dt>{order.process}</dt><dd>待处理</dd></dl>
            <dl><dt>{order.confirm}</dt><dd>待确认</dd></dl>
            <dl><dt>{order.reject}</dt><dd>已驳回</dd></dl>
            <dl><dt>{order.pending}</dt><dd>待完成</dd></dl>
            <dl><dt>{order.completed}</dt><dd>已完成</dd></dl>
            <dl><dt>{order.end}</dt><dd>已结束</dd></dl>
            <dl><dt>{order.review}</dt><dd>已复核</dd></dl>
            <dl><dt>{order.nullify}</dt><dd>已作废</dd></dl>
            <dl><dt>{order.recheck}</dt><dd>复核不通过</dd></dl>
          </div>
        </Card>
      </Col>
      <Col span="12" style={{ "padding": "0 8px 0 0" }}>
        <Card>
          <h2>报修渠道统计</h2>
          <p className="p-title">
            <a className={channel_id == 1 ? "active" : ""} onClick={checkChannel.bind(this, '1')}>近7天</a>
            <a className={channel_id == 2 ? "active" : ""} onClick={checkChannel.bind(this, '2')}>近30天</a>
            <a className={channel_id == 3 ? "active" : ""} onClick={checkChannel.bind(this, '3')}>近1年</a>
          </p>
          <div className="nums">
            <dl><dt>{channel.total_num}</dt><dd>共计</dd></dl>
            <dl><dt>{channel.life}</dt><dd>生活号</dd></dl>
            <dl><dt>{channel.front}</dt><dd>前台报修</dd></dl>
            <dl><dt>{channel.phone}</dt><dd>电话报修</dd></dl>
            <dl><dt>{channel.dingding}</dt><dd>钉钉</dd></dl>
            <dl><dt>{channel.property}</dt><dd>物业内部</dd></dl>
            <dl><dt>{channel.reviews}</dt><dd>二次维修</dd></dl>
          </div>
          <Charts id="charts-1" type="bar" xAxis={['生活号', '前台报修', '电话报修', '钉钉', '物业内部', '二次维修']}
            yAxis={echart1} />
        </Card>
      </Col>
    </Row>
    <Row className="mt1">
      <Col span="12" style={{ "padding": "0 8px 0 0" }}>
        <Card>
          <h2>报修类型统计</h2>
          <Form>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('type', { initialValue: [moment(year + '-' + month + '-' + 1, 'YYYY-MM-DD'), moment(year + '-' + month + '-' + day, 'YYYY-MM-DD')] })(
                <RangePicker onChange={handleTypeDate.bind(this)} style={{ width: '250px' }} />
              )}
            </Form.Item>
          </Form>
          <div className="nums">
            {echart2.data.length > 0 || type_total != 0 ? <dl><dt>{type_total}</dt><dd>工单数量</dd></dl> : ''}
            {type.map((value, index) => {
              return <dl key={index}><dt>{value.num}</dt><dd>{value.name}</dd></dl>
            })}
          </div>
          {echart2 && echart2.data.length > 0 ? <Charts id="charts-2" type="pie" legend={echart2.data.map(item => {
            return item.name
          })} pieData={echart2.data} /> : <span>暂无数据</span>}
        </Card>
      </Col>
      <Col span="12" style={{ "padding": "0 8px 0 0" }}>
        <Card>
          <h2>报修评分统计</h2>
          <Form>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('score', { initialValue: [moment(year + '-' + month + '-' + 1, 'YYYY-MM-DD'), moment(year + '-' + month + '-' + day, 'YYYY-MM-DD')] })(
                <RangePicker onChange={handleScoreDate.bind(this)} style={{ width: '250px' }} />
              )}
            </Form.Item>
          </Form>
          <div className="nums">
            {echart3.data.length > 0 || score_total != 0 ? <dl><dt>{score_total}</dt><dd>工单数量</dd></dl> : null}
            {score.map((value, index) => {
              return <dl key={index}><dt>{value.num}</dt><dd>{value.name}</dd></dl>
            })}
          </div>
          {flag == true ? <Charts id="charts-3" type="pie" legend={echart3.data.map(item => {
            return item.name
          })} pieData={echart3.data} /> : <div style={{ "minWidth": "120px", "height": "auto", "clear": "both" }}>暂无统计数据</div>}
        </Card>
      </Col>
    </Row>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.RepairCount,
    loading: state.loading.models.RepairCount
  };
}
export default connect(mapStateToProps)(Form.create()(RepairCount));
