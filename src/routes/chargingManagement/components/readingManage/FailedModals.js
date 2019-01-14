import React from 'react';
import { Table, Button, Form, Modal } from 'antd';
import { getCommunityId } from '../../../../utils/util';
class FailedModals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  hideModal(e) {
    let { dispatch } = this.props;
    dispatch({
      type: 'MeterReadingSystemModel/concat',
      payload: {
        visible:false,
      }
    });
  }
  handleSure(roomId,param) {
    let { dispatch,type,ID,params } = this.props;
    let query={
      visible:false,
    }
    params.bill_type=type;
    params.cycle_id = ID;
    params.community_id = getCommunityId();
    dispatch({
      type: 'MeterReadingSystemModel/concat',
      payload:query
    })
    dispatch({
      type: 'MeterReadingSystemModel/getMeterReadingList',
      payload:params,
    })
  }
  render() {
    let { visible, default_count, success_count,error_list,error_count } = this.props;
    const columns = [{
      title: '苑/期/区',
      dataIndex: 'group',
      key: 'group',
    }, {
      title: '幢',
      dataIndex: 'building',
      key: 'building',
    }, {
      title: '单元',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '室',
      dataIndex: 'room',
      key: 'room',
    },{
      title: '收费面积',
      dataIndex: 'charge_area',
      key: 'charge_area',
    },{
      title: '失败原因',
      dataIndex: 'error_info',
      key: 'error_info',
    },];
    const footer = <div>
      <Button type="primary" className="mr1" onClick={this.handleSure.bind(this)}>确定</Button>
    </div>
    return (
      <Modal title="失败账单信息"
        visible={visible}
        maskClosable={true}
        onCancel={this.hideModal.bind(this)}
        footer={footer}
        wrapClassName="ink-model">
        <p style={{ marginTop: 10, textAlign: 'center' }}>
          账单共计{default_count}成功{success_count}条, 失败{error_count}条
        </p>
        {/* <p style={{ marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>
          失败原因:账单被锁定,请稍后重试
        </p>
        <p style={{ marginTop: 10, fontWeight: 'bold' }}>
          锁定账单明细:
        </p> */}
        <Table columns={columns}
          dataSource={error_list}
          size="small"
          rowKey={record => record.id}
          pagination={false} />
      </Modal>
    )
  }
}

export default Form.create()(FailedModals);
