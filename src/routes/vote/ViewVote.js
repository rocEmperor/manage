import React from 'react';
import { connect } from 'dva';
import './index.less';
import { Form, Breadcrumb, Table, Button, Card, Row, message, DatePicker, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { download } from '../../utils/util';
const FormItem = Form.Item;
const createForm = Form.create;

const formItemLayout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 22
  }
};
const formItemLayout2 = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 18
  }
};
const now = Date.parse(new Date());
function ViewVote (props) {
  let { dispatch, viewVote, form } = props;
  let { type, data, end_time, vote_id, show_at, flag, data_show, max, data_count,previewVisible, previewImage, visible } = viewVote;
  let { getFieldDecorator } = form;
  function timeChange (val) {
    if (type == 1) {
      dispatch({
        type: 'ViewVoteModel/concat',
        payload: {
          end_time: val.format('YYYY-MM-DD HH:mm')
        }
      })
    } else {
      dispatch({
        type: 'ViewVoteModel/concat',
        payload: {
          show_at:val.format('YYYY-MM-DD HH:mm')
        }
      })
    }
  }
  function onOk () {
    let parm = {};
    if (type == 1) {
      if (Date.parse(new Date(end_time)) > Date.parse(new Date(data.show_at))){
        message.error('截止时间不能晚于公示时间');
        return false;
      }
      parm = {
        end_time: end_time,
        vote_id: vote_id
      };
      dispatch({
        type: 'ViewVoteModel/concat',
        payload: { end_time: parm.end_time }
      })
    } else {
      if (Date.parse(new Date(show_at)) < Date.parse(new Date(data.end_time))) {
        message.error('公示时间不能早于截止时间');
        return false;
      }
      parm = {
        show_at: show_at,
        vote_id: vote_id
      };
      dispatch({
        type: 'ViewVoteModel/concat',
        payload: { show_at: parm.show_at }
      })
    }
    dispatch({
      type: 'ViewVoteModel/voteEndtime',
      payload: { ...parm, type: type }
    });
    dispatch({
      type: 'ViewVoteModel/concat',
      payload: {
        visible: false,
        end_time: '',
        show_at: ''
      }
    });
    form.resetFields();
  }
  function handleShow (data, type) {
    dispatch({
      type: 'ViewVoteModel/concat',
      payload: {
        visible: true,
        vote_id: data.id,
        type: type
      }
    });
  }
  function handleCancel () {
    dispatch({
      type: 'ViewVoteModel/concat',
      payload: {
        visible: false,
        end_time: '',
        show_at: ''
      }
    });
    form.resetFields();
  }
  function handleImg (url) {
    dispatch({
      type: 'ViewVoteModel/concat',
      payload: {
        previewVisible: true,
        previewImage: url
      }
    });
  }
  function handleCancels () {
    dispatch({
      type: 'ViewVoteModel/concat',
      payload: { previewVisible: false }
    });
  }
  function handleFlag (flag) {
    dispatch({
      type: 'ViewVoteModel/concat',
      payload: { flag: flag }
    });
  }
  function showToast () {
    if (data.is_end_time == 0) {
      message.error('当前时间段不可新增/更改');
    }
    if (data.is_show_at == 1) {
      message.error('当前时间段不可新增/更改');
    }
    if (data.is_show_at == 0 && data.is_end_time == 1) {
      message.error('当前时间段不可新增/更改');
    }
  }
  //导出数据
  function handleExport () {
    let parm = {
      vote_id: vote_id
    };
    if (flag === 'online_data_show') {
      parm.data_type = 'online';
    } else if (flag === 'underline_data_show') {
      parm.data_type = 'offline';
    } else {
      parm.data_type = 'all';
    }
    dispatch({
      type: 'ViewVoteModel/downFiles',
      payload:parm ,callback(data){
        download(data);
      }
    });
  }
  function judgefn () {
    let result = undefined;
    let term1 = data.is_end_time && data.is_end_time == 1 && data.is_show_at == 1 && data.vote_result == 1;
    let term2 = data.is_end_time && data.is_end_time == 1 && data.is_show_at == 0 && data.vote_result == 1;
    if (term1 || term2) {
      result = <Link to={`showResultView?vote_id=${vote_id}&is_show_at=${data.is_show_at}`}>
        <span>查看投票公示结果</span>
      </Link>
    } else {
      result = <a onClick={showToast}>填写投票公示结果</a>
    }
    return result
  }
  const noData = (text, record) => {
    return (
      <span>{text ? text : '-'}</span>
    )
  };
  const columns = [{
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
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    render: (text, record) => {
      if (text == '1') {
        return (
          <span>男</span>
        )
      } else if (text == '2') {
        return (
          <span>女</span>
        )
      } else {
        return (
          <span>未知</span>
        )
      }
    },
  }, {
    title: '对应房屋',
    dataIndex: 'address',
    key: 'address',
    render: noData
  }, {
    title: '身份',
    dataIndex: 'identity_type_desc',
    key: 'identity_type_desc',
    render: noData
  }, {
    title: '认证状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      if (text == 1) {
        return (
          <span>未认证</span>
        )
      }else if (text == 2) {
        return (
          <span>已认证</span>
        )
      } else {
        return (
          <span>已失效</span>
        )
      }
    },
  }];
  const columns2 = [];
  if (max > 0) {
    for (let i= 0; i<max; i++) {
      if (i == 0) {
        const obj = {
          title: ' ',
          key: i,
          render: (text, record) => {
            return `题目${record.key}`
          }
        };
        columns2.push(obj);
      } else {
        const obj = {
          title: `选项${i}`,
          key: i,
          render: (text, record) => {
            return record.options[+i-1] || '-';
          }
        };
        columns2.push(obj);
      }
    }
  }

  let desc = data.vote_desc && data.vote_desc.split('\n\n') || [];
  return (
    <div className="page-content">
      <Breadcrumb separator="/">
        <Breadcrumb.Item>
          <a href="javascript:history.go(-1)">投票管理</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>投票详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card style={{marginBottom: 10}}>
          <Row>
            <FormItem className="ink-item" label="投票名称" {...formItemLayout}>
              <span className="ink-break">{data.vote_name}</span>
            </FormItem>
          </Row>
          <Row>
            <FormItem className="ink-item" label="起止时间" {...formItemLayout}>
              <span>{data.created_at} - {data.end_time}</span>
              {
                data.vote_status === '进行中'
                  ? <Button type="primary"
                    onClick={() => handleShow(data, 1)}
                    style={{marginLeft: '10px'}} >
                    修改截至时间
                  </Button>
                  : null
              }
              {
                // author("deadline")?data.vote_status === '进行中'
                //   ? <Button type="primary"
                //     onClick={() => handleShow(data, 1)}
                //     style={{marginLeft: '10px'}} >
                //     修改截至时间
                //   </Button>
                //   : null:null
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem className="ink-item" label="公示时间" {...formItemLayout}>
              <span>{data.show_at}</span>
              {
                data.is_show_at == 0
                  ? <Button type="primary"
                    onClick={() => handleShow(data, 2)}
                    style={{marginLeft: '10px'}} >
                    修改公示时间
                  </Button>
                  : null
              }
              {
                // author("noticeTime")?data.is_show_at == 0
                //   ? <Button type="primary"
                //     onClick={() => handleShow(data, 2)}
                //     style={{marginLeft: '10px'}} >
                //     修改公示时间
                //   </Button>
                //   : null:null
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem className="ink-item" label="投票说明" {...formItemLayout}>
              {desc.length > 0 && desc.map((item, index) => {
                return <span className="ink-break" key={index}>{item}<br/></span>
              })}
            </FormItem>
          </Row>
          <Row>
            <FormItem className="ink-item" label="投票权限" {...formItemLayout}>
              <span>{data.permission_type_desc}</span>
            </FormItem>
          </Row>

          <Row>
            {
              data.permission_type == 3
                ? <Card>
                  <Table columns={columns}
                    dataSource={data.appoint_members}
                    rowKey={record => record.id}
                  />
                </Card>
                : null
            }
          </Row>
          <Row>
            <FormItem className="ink-item" label="投票类型" {...formItemLayout}>
              <span>{data.vote_type_desc}</span>
            </FormItem>
          </Row>
          <Row>
            <FormItem className="ink-item" label="投票结果" {...formItemLayout}>
              {
                data.permission_type && data.permission_type !=1
                  ? <span>
                    本次投票范围：应投人数：{data_count.all_total+''}人， 已投人数：{data_count.vote_total}人；
                  </span>
                  : null
              }
              {
                data.permission_type && data.permission_type == 1
                  ? <span>
                    本次投票范围：应投户数：{data_count.all_total+''}户， 已投户数：{data_count.vote_total}户；
                  </span>
                  : null
              }
              {
                data_count.all_area
                  ? <span style={{marginLeft: 10}}>
                    应投房屋面积：{data_count.all_area}㎡， 已投房屋面积：{data_count.vote_area}㎡；
                  </span>
                  : null
              }
              {
                data.permission_type && data.permission_type == 2
                  ? <span style={{marginLeft: 10}}>
                    其中，线上投票人数：{data_count.on_vote_total}人，
                    <span style={{marginLeft: 10}}>
                      线下投票人数：{data_count.off_vote_total}人
                    </span>
                  </span>
                  : null
              }
              {
                data.permission_type && data.permission_type == 3
                  ? <span style={{marginLeft: 10}}>
                    其中，线上投票人数：{data_count.on_vote_total}人， 线上投票面积：{data_count.on_vote_area}㎡；
                    <span style={{marginLeft: 10}}>
                      线下投票人数：{data_count.off_vote_total}人 线下投票面积：{data_count.off_vote_area}㎡
                    </span>
                  </span>
                  : null
              }
              {
                data.permission_type && data.permission_type == 1
                  ? <span style={{marginLeft:10}}>
                    其中，线上已投房屋：{data_count.on_vote_total}户， 线上投票面积：{data_count.on_vote_area}㎡；
                    <span style={{marginLeft:10}}>
                      线下已投房屋：{data_count.off_vote_total}户 线下投票面积：{data_count.off_vote_area}㎡
                    </span>
                  </span>
                  : null
              }
              <Link to={`voteInfo?id=${data.id}&type=${data.permission_type}&c=${data.community_id}&is_show_at=${data.is_show_at}`}
                style={{marginLeft: 10}}>
                查看详情
              </Link>
            </FormItem>
          </Row>
          <Row>
            <FormItem className="ink-item" label="结果公告" {...formItemLayout}>
              请于投票活动结束后填写投票结果公告，该公告将公示在业主生活号。
              {
                data.is_end_time && data.is_end_time == 1 && data.is_show_at == 0 && data.vote_result == 0
                  ? <Link to={`addShowResult?vote_id=${vote_id}`}><span>填写投票公示结果</span></Link>
                  : judgefn()
              }

            </FormItem>
          </Row>
        </Card>
        {
          data.vote_status && data.vote_status !== '进行中'
            ? <Card style={{marginBottom: 10}}>
              <Row>
                <FormItem className="ink-item" label="统计结果" {...formItemLayout}>
                </FormItem>
              </Row>
              <Card>
                <Row>
                  <Button style={{ marginBottom: 10, float:'left'}}
                    onClick={() => handleFlag('total_data_show')}
                    type={flag === 'total_data_show' ? 'primary' : 'ghost'}>
                    统计结果汇总
                  </Button>
                  <Button style={{ marginLeft: 10, float: 'left'}}
                    onClick={() => handleFlag('online_data_show')}
                    type={flag === 'online_data_show' ? 'primary' : 'ghost'}>
                    线上统计结果
                  </Button>
                  <Button style={{ marginLeft: 10,float:'left'}}
                    onClick={() => handleFlag('underline_data_show')}
                    type={flag === 'underline_data_show' ? 'primary' : 'ghost'}>
                    线下统计结果
                  </Button>
                  {
                    data.show_at && new Date(data.show_at) > now
                      ? <Link to={`doVote?id=${vote_id}&c=${data.community_id}`}>
                        <Button style={{ marginLeft: 10,float:'right'}} type="primary">
                          线下数据录入
                        </Button>
                      </Link>
                      : null
                  }
                  {
                    // author("entryUnderLine")?data.show_at && new Date(data.show_at) > now
                    //   ? <Link to={`DoVote?id=${vote_id}&c=${data.community_id}`}>
                    //     <Button style={{ marginLeft: 10,float:'right'}} type="primary">
                    //       线下数据录入
                    //     </Button>
                    //   </Link>
                    //   : null:null
                  }
                  <Button style={{ marginLeft: 10,float:'right'}}
                    onClick={handleExport}
                    type="primary">
                    导出数据
                  </Button>
                  {/* {author("export")?<Button style={{ marginLeft: 10,float:'right'}}
                    onClick={handleExport}
                    type="primary">
                    导出数据
                  </Button>:null} */}
                </Row>
                <Row>
                  <Table columns={columns2}
                    dataSource={data_show[flag]}
                    rowKey={record => record.id}
                    pagination={false}
                    scroll={{ x: 80 * max}}/>
                </Row>
              </Card>
            </Card>
            : null
        }
        <Card style={{marginBottom: 10}}>
          <Row>
            <FormItem className="ink-item" label="选项设置" {...formItemLayout}>
            </FormItem>
          </Row>
          {data.problems && data.problems.map((item, index) => {
            return (
              <Card style={{marginBottom: 10}} key={index}>
                <Row>问题{index + 1}：{item.title}【{item.option_type_desc}】</Row>
                {item.options.map((items, indexs) => {
                  return (
                    <div key={indexs}>
                      <Row>选项{indexs + 1}：{items.title}</Row>
                      {
                        item.vote_type == 2
                          ? <img key={indexs+1} style={{marginTop: 10, marginBottom: 10, width: 80}}
                            src={items.image_url}
                            onClick={() => handleImg(items.image_url)}/>
                          : null
                      }
                      {item.vote_type == 2 ? <Row>{items.option_desc}</Row  > : null}
                      {
                        data.vote_status !== '进行中'
                          ? <div className="ink-line">
                            <div className="ink-vote-all">
                              <div style={{width: items.scale}} className="ink-vote"></div>
                            </div>
                            <div className="ink-result">
                              <label className="resultLabel">{items.total}票</label>
                              <span className="resultSpan">{items.scale}</span>
                            </div>
                          </div>
                          : null
                      }
                    </div>
                  )
                })}
              </Card>
            )
          })}
        </Card>
      </Card>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancels}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Modal title={type == 1 ? '修改截止时间' : '修改公示时间'}
        visible={visible}
        onOk={onOk}
        onCancel={handleCancel}>
        <FormItem className="ink-item" label="截止时间" {...formItemLayout2}>
          {getFieldDecorator('time')(
            <DatePicker showTime="true"
              format="YYYY-MM-DD HH:mm"
              onChange={timeChange}/>
          )}
        </FormItem>
      </Modal>
    </div>
  )
}
export default connect(state => {
  return {
    viewVote: state.ViewVoteModel,
    layout: state.MainLayout
  }
})(createForm()(ViewVote));
