import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
//import styles from './index.less';
import { download} from '../../utils/util';
import Community from '../../components/Community/Community.js';
import { Table, Breadcrumb, Card, Select, Button, Input, Form, Col, DatePicker,Row } from 'antd';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  },
};
function VoteInfo (props) {
  let { dispatch, voteInfo, form } = props;
  let { community_id, current, vote_id, total, data, vote_channel, vote_type } = voteInfo;
  let { getFieldDecorator } = form;
  function handSearch () {
    form.validateFields((err, values) => {
      if (values.vote_time !== undefined) {
        values.vote_time_start = (values.vote_time[0].format('YYYY-MM-DD HH:mm'));
        values.vote_time_end = (values.vote_time[1].format('YYYY-MM-DD HH:mm'));
        delete values.vote_time;
      }
      values.community_id = community_id;
      values.page = current;
      values.vote_id = vote_id;
      dispatch({
        type: 'VoteInfoModel/voteShowMember',
        payload: values
      })
    })
  }
  function handleReset () {
    dispatch({
      type: 'VoteInfoModel/concat',
      payload: {current: 1}
    });
    form.resetFields();
    dispatch({
      type: 'VoteInfoModel/voteShowMember',
      payload: {vote_id: vote_id}
    })
  }
  function pageChange (page, pageSize){
    dispatch({
      type: 'VoteInfoModel/concat',
      payload: {current: page}
    });
    form.validateFields((err, values) => {
      if (values.vote_time !== undefined) {
        values.vote_time_start = (values.vote_time[0].format('YYYY-MM-DD HH:mm'));
        values.vote_time_end = (values.vote_time[1].format('YYYY-MM-DD HH:mm'));
        delete values.vote_time;
      }
      values.community_id = community_id;
      values.page = page;
      values.vote_id = vote_id;
      dispatch({
        type: 'VoteInfoModel/voteShowMember',
        payload: values
      })
    });
  }
  function handleRxport () {
    form.validateFields((err, values) => {
      if (values.vote_time !== undefined) {
        values.vote_time_start = (values.vote_time[0].format('YYYY-MM-DD HH:mm'));
        values.vote_time_end = (values.vote_time[1].format('YYYY-MM-DD HH:mm'));
        delete values.vote_time;
      }
      values.community_id = community_id;
      values.vote_id = vote_id;
      dispatch({
        type: 'VoteInfoModel/downFiles',
        payload:values ,callback(data){
          download(data);
        }
      });
    });
  }
  function handleData () {
    let param = {
      vote_id: vote_id,
      community_id:community_id
    }
    dispatch({
      type: 'VoteInfoModel/downLoadData',
      payload: param,callback(data){
        download(data);
      }
    });
  }
  const noData = (text, record) => {
    return (
      <span>{text ? text : '-'}</span>
    )
  };
  const columns = [{
    title: '房屋信息',
    dataIndex: 'room',
    key: 'room',
    render: (text,record)=>{
      return <span>{record.group}{record.building}{record.unit}{record.room}</span>
    }
  }, {
    title: '房屋面积(㎡)',
    dataIndex: 'charge_area',
    key: 'charge_area',
    render: noData
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: noData
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
    render: noData
  }, {
    title: '业主类型',
    dataIndex: 'identity_type_desc',
    key: 'identity_type_desc',
    render: noData
  }, {
    title: '投票渠道',
    dataIndex: 'vote_channel_desc',
    key: 'vote_channel_desc',
    render: noData
  }, {
    title: '是否投票',
    dataIndex: 'is_vote',
    key: 'is_vote',
    render: noData
  }, {
    title: '投票时间',
    dataIndex: 'vote_time',
    key: 'vote_time',
    render: noData
  }, {
    title: '操作',
    key: 'vote_ctrl',
    render: (text, record)=>{
      return (
        record.is_vote === '否'
          ? '-'
          : <Link to={`doVote?id=${vote_id}&m=${record.member_id}&r=${record.room_id}`}>查看详情</Link>
      )
    }
  }];
  const statisticalInfo = `共有 ${total} 条`;
  const PaginationProps = {
    total: parseInt(total),
    current: current,
    showQuickJumper: false,
    defaultPageSize: 10,
    showTotal: (total) => statisticalInfo,
    onChange: pageChange
  };
  const styleList1 = {fontWeight: 'bold'};
  const styleList2 = {marginLeft: 10, fontWeight: 'bold'};
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>投票管理</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="javascript:history.go(-1)">投票详情</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>人员详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <Row>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
          </Row>
          <Col span={6}>
            <FormItem {...formItemLayout} label="是否投票" >
              {getFieldDecorator('is_vote')(
                <Select placeholder="请选择">
                  <Option key={-1} value="-1">全部</Option>
                  <Option key={1}  value="1">已投票</Option>
                  <Option key={2}  value="2">未投票</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {vote_type != 1?<Col span={6}>
            <FormItem {...formItemLayout} label="业主姓名">
              {getFieldDecorator('member_name')(
                <Input type="text" placeholder="请输入业主姓名" />
              )}
            </FormItem>
          </Col>:null}
          {vote_type != 1?<Col span={6}>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('member_mobile')(
                <Input type="text" placeholder="请输入业主电话" />
              )}
            </FormItem>
          </Col>:null}
          <Col span={6}>
            <FormItem {...formItemLayout} label="投票时间" >
              {getFieldDecorator('vote_time')(
                <RangePicker style={{ width: 240 }} showTime="true" format="YYYY-MM-DD HH:mm"/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label="投票渠道" >
              {getFieldDecorator('vote_channel')(
                <Select placeholder="请选择" style={{ width: 150 }} >
                  <Option key={-1} value="-1">全部</Option>
                  {vote_channel.map((item, index)=>{
                    return <Option key={index} value={`${item.key}`}>{item.value}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col className="fr" span={8}>
            <Button type="primary"
              onClick={handSearch}
              className="mr1"
              style={{marginLeft: 10}} >
              搜索
            </Button>
            <Button type="ghost"
              onClick={handleReset}>
              重置
            </Button>
            <Button onClick={handleRxport}
              className="mr1"
              style={{marginLeft: 10}} >
              导出数据
            </Button>
            {/* {author("export")?<Button onClick={handleRxport}
              className="mr1"
              style={{marginLeft: 10}} >
              导出数据
            </Button>:null} */}
          </Col>
        </Form>
      </Card>
      <Card className="mt1">
        <Button type="primary"
          onClick={handleData}>
          导出投票详情数据
        </Button>
        {/* {author("exportDetails")? <Button type="primary"
          onClick={handleData}>
          导出投票详情数据
        </Button>:null} */}
        <h4 style={{ marginTop: 10, marginBottom: 10 }}>
          {
            data.all_total && vote_type != 1
              ? <span style={styleList1}>本次投票范围：应投人数：{data.all_total+''}人 已投人数：{data.vote_total}人</span>
              : null
          }
          {
            data.all_total && vote_type == 1
              ? <span style={styleList1}>本次投票范围：应投户数：{data.all_total+''}户 已投户数：{data.vote_total}户</span>
              : null
          }
          {
            data.all_area
              ? <span style={styleList2}>应投房屋面积：{data.all_area}㎡ 已投房屋面积：{data.vote_area}㎡</span>
              : null
          }
          {
            data.all_total && vote_type == 2
              ? <div>
                <span style={styleList1}>其中，线上投票人数：{data.on_vote_total}人</span>
                <span style={styleList2}>线下投票人数：{data.off_vote_total}人 </span>
              </div>
              : null
          }
          {
            data.all_total && vote_type == 3
              ? <div>
                <span style={styleList1}>其中，线上投票人数：{data.on_vote_total}人 线上投票面积：{data.on_vote_area}㎡</span>
                <span style={styleList2}>线下投票人数：{data.off_vote_total}人 线下投票面积：{data.off_vote_area}㎡</span>
              </div>
              : null
          }
          {
            data.all_total && vote_type == 1
              ? <div>
                <span style={styleList1}>其中，线上已投房屋：{data.on_vote_total}户 线上投票面积：{data.on_vote_area}㎡</span>
                <span style={styleList2}>线下已投房屋：{data.off_vote_total}户 线下投票面积：{data.off_vote_area}㎡</span>
              </div>
              : null
          }
        </h4>
        <Table columns={columns}
          dataSource={data.list}
          pagination={PaginationProps}
          rowKey={record => record.room_id}
        />
      </Card>
    </div>
  )

}

export default connect(state => {
  return {
    layout: state.MainLayout,
    voteInfo: state.VoteInfoModel,
  }
})(Form.create({})(VoteInfo));
