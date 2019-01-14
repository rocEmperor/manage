import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Row, Col, Modal, Icon } from 'antd';
import './Repair.css';
const FormItem = Form.Item;

function RepairView(props) {
  const { dispatch, type, visable, data, previewImage, previewVisible } = props;

  const repair_assigns = data.repair_assigns || [];
  let length = repair_assigns.length;
  let modes = Math.ceil(length / 2);
  let arrys = new Array(modes);
  arrys.fill(1);

  const records = data.records || [];
  let len = records.length;
  let mod = Math.ceil(len / 2);
  let arr = new Array(mod);
  arr.fill(1);

  const recheck = data.reCheck_records || [];
  let lens = recheck.length;
  let mods = Math.ceil(lens / 2);
  let arrs = new Array(mods);
  arrs.fill(1);

  let star = new Array(5);
  star.fill(5);
  //布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
    },
    style: {
      marginBottom: 0
    }
  }
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 18
    },
    style: {
      marginBottom: 0
    }
  }
  //打印
  function handlePrint() {
    dispatch({
      type: 'RepairView/concat',
      payload: {
        visable: true,
      }
    });
    let div = document.createElement('div');
    setTimeout(() => {
      let newstr = document.getElementById("printPage").innerHTML;
      div.innerHTML = newstr;
      document.body.appendChild(div);
      const container = document.getElementById("root");
      container.style.display = "none";
      window.print();
      document.body.removeChild(div);
      container.style.display = "block";
      dispatch({
        type: 'RepairView/concat',
        payload: {
          visable: false,
        }
      });
    }, 300)
    return false;
  }
  //图片显示
  function handlePreview(file) {
    dispatch({
      type: 'RepairView/concat',
      payload: {
        previewImage: file,
        previewVisible: true,
      }
    });
  }
  //图片隐藏
  function handleCancel(e) {
    dispatch({
      type: 'RepairView/concat',
      payload: {
        previewVisible: false
      }
    });
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>报修管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="javascript:history.go(-1)">{type == 1 ? '报事报修' : '疑难问题'}</a></Breadcrumb.Item>
      <Breadcrumb.Item>详情</Breadcrumb.Item>
    </Breadcrumb>
    <Card id="printPage">
      {!visable ? <h3 style={{ marginTop: '0px' }}>报事报修详情</h3> : null}
      {!visable ? <Button className="prints" onClick={handlePrint.bind(this)}>打印</Button> : null}
      {visable ? <h3 style={{ marginTop: '0px', marginBottom: '10px', textAlign: 'center', }}>{data.room_address}报事报修详情</h3> : null}
      <Row>
        <Col span={12}>
          <FormItem label="订单编号" {...formItemLayout}>
            <span>{data.repair_no}</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="提交时间" {...formItemLayout}>
            <span>{data.create_at != undefined ? data.create_at : ""}</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="报修位置" {...formItemLayout}>
            <span>{data.repair_type_desc}{data.room_address ? `（${data.room_address}）` : null}</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="报修内容" {...formItemLayout2}>
            <span>{data.repair_content != undefined ? data.repair_content : ""}</span>
            {data.repair_imgs != undefined && data.repair_imgs.length != 0 ?
              <div>
                {data.repair_imgs.map((value, index) => { return <img onClick={handlePreview.bind(this, value)} className="img" key={index} src={`${value}?imageView2/0/w/80/h/80`} /> })}
              </div>
              : ""}
          </FormItem>
        </Col>
      </Row>
      {data.room_username ? <Row>
        <Col span={12}>
          <FormItem label="业主" {...formItemLayout}>
            <span>{data.room_username}</span>
          </FormItem>
        </Col>
      </Row>
        : null}
      {data.contact_mobile ? <Row>
        <Col span={12}>
          <FormItem label="联系电话" {...formItemLayout}>
            <span>{data.contact_mobile}</span>
          </FormItem>
        </Col>
      </Row>
        : null}
      <Row>
        <Col span={12}>
          <FormItem label="期望上门时间" {...formItemLayout}>
            <span>{data.expired_repair_time} {data.expired_repair_type == 1 ? '上午' : '下午'}</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="留言" {...formItemLayout}>
            <span>{data.leave_msg}</span>
          </FormItem>
        </Col>
      </Row>
      {arrys.legnth > 0 ? <h3 className="dashed" style={{ marginTop: '20px' }}>分配记录</h3> : null}
      {
        arrys.map((item, index) => {
          return (<Row key={index}>
            {repair_assigns && repair_assigns.map((items, indexs) => {
              if (indexs == index * 2 || indexs == index * 2 + 1)
                return <Col span={12} key={indexs}>
                  <FormItem label="分配状态：" {...formItemLayout}>
                    <span>{items.status}</span>
                  </FormItem>
                  <FormItem label="处理人：" {...formItemLayout}>
                    <span>{items.operator_name}（{items.group_name}）</span>
                  </FormItem>
                  <FormItem label="联系电话：" {...formItemLayout}>
                    <span>{items.operator_mobile}</span>
                  </FormItem>
                  <FormItem label="维修时间：" {...formItemLayout}>
                    <span>{items.created_at}-{items.finish_time}</span>
                  </FormItem>
                  <FormItem label="备注：" {...formItemLayout}>
                    <span>{items.remark}</span>
                  </FormItem>
                </Col>
            })}
          </Row>)
        })
      }
      <h3 className="dashed" style={{ marginTop: '20px' }}>处理内容</h3>
      <Row>
        <Col span={12}>
          <FormItem label="订单状态" {...formItemLayout}>
            <span>{data.status_desc}</span>
          </FormItem>
        </Col>
      </Row>
      {data.hard_remark ? <Row>
        <Col span={12}>
          <FormItem label="标记疑难时间：" {...formItemLayout}>
            <span>{data.hard_check_at}</span>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="标记疑难说明：" {...formItemLayout}>
            <span>{data.hard_remark}</span>
          </FormItem>
        </Col>
      </Row>
        : null}
      {
        arr.map((item, index) => {
          return (<Row key={index}>
            {records && records.map((items, indexs) => {
              if (indexs == index * 2 || indexs == index * 2 + 1)
                return <Col span={12} key={indexs}>
                  <FormItem label="处理人：" {...formItemLayout}>
                    <span>{items.operator_name}（{items.group_name}）</span>
                  </FormItem>
                  <FormItem label="联系电话：" {...formItemLayout}>
                    <span>{items.operator_mobile}</span>
                  </FormItem>
                  <FormItem label="处理时间：" {...formItemLayout}>
                    <span>{items.create_at}</span>
                  </FormItem>
                  <FormItem label="处理结果：" {...formItemLayout}>
                    <span>{items.content}</span>
                    <div>
                      {items.repair_imgs && items.repair_imgs.map((item, index) => {
                        return <img onClick={handlePreview.bind(this, item)} className="img" src={`${item}?imageView2/0/w/80/h/80`} key={index} />
                      })}
                    </div>
                  </FormItem>
                </Col>
            })}
          </Row>)
        })
      }
      {
        arrs.length > 0 && data.status != '8' && data.status != '9' ? <h3 className="dashed" style={{ marginTop: '20px' }}>复核内容</h3> : null
      }

      {
        data.status != '8' && data.status != '9'?arrs.map((item, index) => {
          return (<Row key={index}>
            {recheck && recheck.map((items, indexs) => {
              if (indexs == index * 2 || indexs == index * 2 + 1)
                return <Col span={12} key={indexs}>
                  <FormItem label="复核人：" {...formItemLayout}>
                    <span>{items.operator_name}（{items.group_name}）</span>
                  </FormItem>
                  <FormItem label="联系电话：" {...formItemLayout}>
                    <span>{items.operator_mobile}</span>
                  </FormItem>
                  <FormItem label="复核时间：" {...formItemLayout}>
                    <span>{items.create_at}</span>
                  </FormItem>
                  <FormItem label="复核结果：" {...formItemLayout}>
                    <span>{items.status_desc}</span>
                  </FormItem>
                  {items.status == 1 ?
                    <FormItem label="复核内容：" {...formItemLayout}>
                      <span>{items.content}</span>
                    </FormItem> : null
                  }
                </Col>
            })}
          </Row>)
        }):null
      }
      {(data.amount > 0 || data.other_charge > 0) && data.is_pay != 3 ?
        <div>
          <h3 className="dashed" style={{ marginTop: '20px' }}>收款记录</h3>
          <Row>
            <Col span={12}>
              <FormItem label="支付状态" {...formItemLayout}>
                <span>{data.is_pay_desc}</span>
              </FormItem>
            </Col>
          </Row>
          {
            data.is_pay == 2 ? <Row>
              <Col span={12}>
                <FormItem label="支付类型" {...formItemLayout}>
                  <span>{data.pay_type == 2 ? '线下支付' : '线上支付'}</span>
                </FormItem>
              </Col></Row>
              :null
          }
          <Row>
            <Col span={12}>
              <FormItem label="维修费用" {...formItemLayout}>
                <span>{data.amount}元</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="其它费用" {...formItemLayout}>
                <span>{data.other_charge}元</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        : null}
      {
        data.appraise && data.appraise.start_num ? <h3 className="dashed" style={{ marginTop: '20px' }}>用户评价</h3> : null
      }
      {data.appraise && data.appraise.start_num ?
        <Row>
          <Col span={12}>
            <FormItem label="用户打分：" {...formItemLayout}>
              {
                star.map((item, index) => {
                  if (data.appraise && index + 1 > data.appraise.start_num) {
                    return <Icon key={index} className="starN" type="star" />
                  } else {
                    return <Icon key={index} className="star" type="star" />
                  }
                })
              }
            </FormItem>
            <FormItem label="评价内容：" {...formItemLayout}>
              <div>
                {
                  data.appraise && data.appraise.appraise_labels && data.appraise.appraise_labels.map((item, index) => {
                    return <span className="appraise" key={index}>{item}</span>
                  })
                }
              </div>
              <div>{data.appraise && data.appraise.content ? data.appraise.content : null}</div>
            </FormItem>
          </Col>
        </Row>
        : null
      }
    </Card>
    <Modal visible={previewVisible} footer={null} onCancel={handleCancel.bind(this)}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.RepairView,
    loading: state.loading.models.RepairView
  };
}
export default connect(mapStateToProps)(Form.create()(RepairView));
