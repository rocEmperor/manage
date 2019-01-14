import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Row, Col, Card, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
const { RangePicker, MonthPicker } = DatePicker;
const Option = Select.Option;

import Charts from "../../../components/Charts/index";
import './CommunityCompare.css';

function CommunityCompare(props) {
  const { dispatch, form, basic, amountsScale, totalsScale, billList } = props;
  const { getFieldDecorator } = form;

  let dateNow = new Date();
  let year = dateNow.getFullYear();
  let month = dateNow.getMonth() + 1;
  let day = dateNow.getDate();
  dateNow.setTime(dateNow.getTime() - 24 * 60 * 60 * 1000);
  let yesterday = dateNow.getFullYear() + "年" + (dateNow.getMonth() + 1) + "月" + dateNow.getDate() + "日";
  const formItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 14
    },
  }

  //收费金额对比
  function handleDate(date) {
    if(date.length==0){
      return;
    }
    let payload = {
      paid_at_start: date[0].format('YYYY-MM-DD'),
      paid_at_end: date[1].format('YYYY-MM-DD')
    }
    dispatch({ type: 'CommunityCompare/getAmountsScale', payload })
  }
  //收缴率对比
  function handSearch() {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let payload = {
        cost_type: values.bill,
        paid_at: values.dates ? values.dates.format('YYYY-MM') : ""
      };
      dispatch({ type: 'CommunityCompare/getTotalsScale', payload })
    })
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>统计报表</Breadcrumb.Item>
        <Breadcrumb.Item>小区概况对比表</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={16} style={{ "marginBottom": "10px" }}>
        <p className="chart_title">收款渠道<span>本数据统计至{yesterday} 24:00</span></p>
        <Col span={8}>
          <Card className="onlinePayment" title="线上收款">
            <Col span={12}>
              <div>本年</div>
              <div>{basic.online_charge ? basic.online_charge.year_charge : '-'}</div>
            </Col>
            <Col span={12}>
              <div>本月</div>
              <div>{basic.online_charge ? basic.online_charge.month_charge : '-'}</div>
            </Col>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="收银台收款">
            {basic.offline_charge ? basic.offline_charge.map((item, index) => {
              return <Col span={6} className="chartbox" key={index}>
                <div className="chartl">{item.pay_channel}</div>
                <div className="chartr">
                  <div>本年 {item.year_charge}</div>
                  <div>本月 {item.month_charge}</div>
                </div>
              </Col>
            }) : null
            }
          </Card>
        </Col>
      </Row>
      <Card title={amountsScale.title} className="section child-section">
        <Form layout="inline" className="selectChart">
          <Form.Item>
            {getFieldDecorator('date', { initialValue: [moment(year + '-' + month + '-' + 1, 'YYYY-MM-DD'), moment(year + '-' + month + '-' + day, 'YYYY-MM-DD')] })(
              <RangePicker onChange={handleDate} style={{ width: 300 }} />
            )}
          </Form.Item>
        </Form>
        {amountsScale.yAxis ? <Charts id="charts-1" type="bar" legend={amountsScale.yAxis ? amountsScale.yAxis.map((item, index) => {
          return item.name
        }) : null} xAxis={amountsScale.xAxis} yAxis={amountsScale.yAxis} /> : <div className="charts">暂无数据</div>}
      </Card>
      <Card title={totalsScale.title} className="section child-section">
        <Form layout="inline" className="selectChart">
          <Form.Item {...formItemLayout}>
            {getFieldDecorator('bill', { initialValue: billList[0] ? billList[0].id : "" })(
              <Select style={{ width: 120 }}>
                {billList.length > 0 ? billList.map((item, index) => {
                  return <Option value={item.id} key={index}>{item.name}收缴率</Option>
                }) : null}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout}>
            {getFieldDecorator('dates', { initialValue: moment(year + '-' + month, 'YYYY-MM') })(
              <MonthPicker />
            )}
          </Form.Item>
          <Button type="primary"  className="mr1" onClick={handSearch}>查询</Button>
        </Form>
        {totalsScale.yAxis ? <Charts id="charts-2" type="line" legend={totalsScale.yAxis ? totalsScale.yAxis.map((item, index) => {
          return item.name
        }) : null} xAxis={totalsScale.xAxis} yAxis={totalsScale.yAxis} /> : <div className="charts">暂无数据</div>}
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.CommunityCompare,
  }
}
export default connect(mapStateToProps)(Form.create()(CommunityCompare));