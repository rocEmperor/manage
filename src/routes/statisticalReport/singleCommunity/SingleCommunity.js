import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Select, Row, Col, Button, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const Option = Select.Option;
import moment from 'moment';

import './SingleCommunity.css'
import Charts from "../../../components/Charts/index";

function SingleCommunity(props) {
  const { dispatch, form, basic, totalScale, billList, amountScale } = props;
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
  };
  //收费项目占比
  function handleDate(date) {
    let payload = {
      community_id: sessionStorage.getItem("communityId"),
      paid_at_start: date[0].format('YYYY-MM-DD'),
      paid_at_end: date[1].format('YYYY-MM-DD')
    }
    dispatch({ type: 'SingleCommunity/getAmountScale', payload })
  }
  //收缴率趋势
  function handleSearch() {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let payload = {
        community_id: sessionStorage.getItem("communityId"),
        cost_type: values.bill,
      }
      dispatch({ type: 'SingleCommunity/getTotalScale', payload })
    })
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>统计报表</Breadcrumb.Item>
        <Breadcrumb.Item>单小区数据报表</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={16}>
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
      <Row gutter={16}>
        <p className="chart_title">收费概况</p>
        <Col span={8}>
          <Card title={amountScale.title}>    
            <Form layout="inline" className="selectChart">
              <Form.Item {...formItemLayout}>
                {getFieldDecorator('date', { initialValue: [moment(year + '-' + month + '-' + 1, 'YYYY-MM-DD'), moment(year + '-' + month + '-' + day, 'YYYY-MM-DD')] })(
                  <RangePicker onChange={handleDate} style={{ width: '250px' }} />
                )}
              </Form.Item>
            </Form>
            {amountScale.data ? <Charts id="charts-1" type="pie" legend={amountScale.data.map(item => {
              return item.name
            })} pieData={amountScale.data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
        <Col span={16}>
          <Card title={totalScale.title}>
            <Form layout="inline">
              <Form.Item>
                {getFieldDecorator('bill', { initialValue: billList[0] ? billList[0].id : "" })(
                  <Select style={{ width: 120 }}>
                    {billList.length > 0 ? billList.map((item, index) => {
                      return <Option value={item.id} key={index}>{item.name}收缴率</Option>
                    }) : null}
                  </Select>
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary"  className="mr1" onClick={handleSearch}>查询</Button>
              </Form.Item>
            </Form>
            {totalScale.yAxis ? <Charts id="charts-2" type="line" legend={totalScale.yAxis.map(item => {
              return item.name
            })} xAxis={totalScale.xAxis} yAxis={totalScale.yAxis} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
      </Row>
      {/* <Row gutter={16}>
        <p className="chart_title">小区数据概况</p>
        <Col span={8}>
          <Card title={basic.house_status ? basic.house_status.title : null} bordered={false}>
            {basic.house_status && basic.house_status.data.length > 0 ? <Charts id="charts-3" type="pie" legend={basic.house_status.data.map(item => {
              return item.name
            })} pieData={basic.house_status.data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
        <Col span="8">
          <Card title={basic.house_type ? basic.house_type.title : null} bordered={false}>
            {basic.house_type && basic.house_type.data.length > 0 ? <Charts id="charts-4" type="pie" legend={basic.house_type.data.map(item => {
              return item.name
            })} pieData={basic.house_type.data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
        <Col span="8">
          <Card title={basic.park_status ? basic.park_status.title : null} bordered={false}>
            {basic.park_status && basic.park_status.data.length > 0 ? <Charts id="charts-5" type="pie" legend={basic.park_status.data.map(item => {
              return item.name
            })} pieData={basic.park_status.data} /> : <div className="charts">暂无数据</div>}
          </Card>
        </Col>
      </Row> */}

    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.SingleCommunity,
    loading: state.loading.models.SingleCommunity
  };
}
export default connect(mapStateToProps)(Form.create()(SingleCommunity));

