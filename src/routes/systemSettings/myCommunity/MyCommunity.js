import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Table } from 'antd';

function MyCommunity(props) {
  const { loading, list } = props;
  // 表格配置项
  const tableProps = {
    columns: [{
      title: '小区名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '小区地址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '物业电话',
      dataIndex: 'link_phone',
      key: 'link_phone',
    }, {
      title: '开通时间',
      dataIndex: 'create_at',
      key: 'create_at',
    }, {
      title: '企业账户',
      dataIndex: 'alipay_account',
      key: 'alipay_account',
    }, {
      title: '开通服务',
      dataIndex: 'services',
      key: 'services',
    }],
    dataSource: list,
    rowKey: record => record.id,
    loading: loading
  };

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>系统设置</Breadcrumb.Item>
        <Breadcrumb.Item>我的小区</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Table className="mt1" {...tableProps}/>
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.MyCommunity
  };
}
export default connect(mapStateToProps)(Form.create()(MyCommunity));
