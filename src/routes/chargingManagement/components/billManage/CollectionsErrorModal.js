import React from 'react';
import { Table, Button, Form, Modal } from 'antd';
import { getCommunityId } from '../../../../utils/util';

let queryList = {
  community_id: getCommunityId(),
  group: '',
  building: '',
  unit: '',
  room_id: ''
};

class Lock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  hideModal(e) {
    let { props } = this.props;
    props.dispatch({
      type: 'CollectionsModel/visibleChange',
      payload: {
        name: 'hide',
        type: 3
      }
    });
  }
  handleSure(roomId,params) {
    let { props } = this.props;
    props.dispatch({
      type: 'CollectionsModel/visibleChange',
      payload: {
        name: 'hide',
        type: 3
      }
    });
    queryList.room_id = roomId;
    queryList.group = params.group;
    queryList.building = params.building;
    queryList.unit = params.unit;
    queryList.room = params.room;
    props.dispatch({
      type: 'CollectionsModel/getList',
      payload: queryList
    });
    props.dispatch({
      type: 'CollectionsModel/concat',
      payload: {
        page: 1,
        loading: false,
        submitLoading: false,
        totals: 0,
        data: [],
        info: [],
        visible: false,
        visible2: false,
        visible1: false,
        selectedRows: [],
        info2: [],
        bill_list: [],
        selectedNum: 0,
        selectedRowKeys: [],
        selectDataSource: [],
        flag: false,
        lockArr: [],
        success_count: 0,
        defeat_count: 0,
      }
    })
  }
  render() {
    let { visible, lockArr, defeat_count, success_count, roomId, queryList } = this.props;
    const columns = [{
      title: '缴费项目',
      dataIndex: 'cost_type',
      key: 'cost_type'
    }, {
      title: '账单生成时间',
      dataIndex: 'release_day',
      key: 'release_day'
    }, {
      title: '账期',
      dataIndex: 'acct_period',
      key: 'acct_period'
    }, {
      title: '应缴金额',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
    }, {
      title: '账单状态',
      dataIndex: 'status',
      key: 'status',
    }];
    const footer = <div>
      <Button type="primary" className="mr1" onClick={this.handleSure.bind(this, roomId,queryList)}>确定</Button>
    </div>
    return (
      <Modal title="锁定账单"
        visible={visible}
        maskClosable={true}
        onCancel={this.hideModal.bind(this)}
        footer={footer}
        wrapClassName="ink-model">
        <p style={{ marginTop: 10, textAlign: 'center' }}>
          线下收款成功{success_count}条, 失败{parseInt(defeat_count - success_count)}条
        </p>
        <p style={{ marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>
          失败原因:账单被锁定,请稍后重试
        </p>
        <p style={{ marginTop: 10, fontWeight: 'bold' }}>
          锁定账单明细:
        </p>
        <Table columns={columns}
          dataSource={lockArr}
          size="small"
          rowKey={record => record.bill_id}
          pagination={false} />
      </Modal>
    )
  }
}

export default Form.create()(Lock);
