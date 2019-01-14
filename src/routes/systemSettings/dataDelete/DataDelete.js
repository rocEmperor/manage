import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Select, DatePicker, Button, Popconfirm, Table, message, Row, Col } from 'antd';
const Option = Select.Option;
import { author } from '../../../utils/util';
import Community from '../../../components/Community/Community.js';


function DataDelete(props) {
  const { dispatch, loading, form, values, costType, list, paginationTotal,
    params, selectedRowKeys, selectedIds, is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'DataDelete/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let selectedId = [];
      for (let i = 0; i < selectedRows.length; i++) {
        selectedId.push(selectedRows[i].id);
      }
      dispatch({
        type: 'DataDelete/concat',
        payload: {
          selectedRowKeys: selectedRowKeys,
          selectedIds: selectedId
        }
      })

    }
  };
  // 表格配置项
  const tableProps = {
    columns: [{
      title: '小区名称',
      dataIndex: 'community_name',
      key: 'community_name',
      render: renderColumns
    }, {
      title: '苑/期/区',
      dataIndex: 'address',
      key: 'address',
      render: renderColumns
    }, {
      title: '缴费项目',
      dataIndex: 'cost_name',
      key: 'cost_name',
      render: renderColumns
    }, {
      title: '账单日期',
      dataIndex: 'acct_period',
      key: 'acct_period',
      render: renderColumns
    }, {
      title: '缴费金额（元）',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
      render: renderColumns
    }, {
      title: '数据状态',
      dataIndex: 'status',
      key: 'status',
      render: renderColumns
    }, {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <span>
            <Popconfirm title="确定要删除这条数据吗？" onConfirm={removeData.bind(this, record)}>
              <a className="table-operating">删除</a>
            </Popconfirm>
          </span>
        )
      }
    }],
    dataSource: list,
    pagination: {
      total: paginationTotal ? Number(paginationTotal) : '',
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 10,
      showTotal: (total, range) => `共有 ${paginationTotal} 条`,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'DataDelete/getDelBillList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading,
    rowSelection: rowSelection
  };

  /**
   * 判断数据是否有效
   * @param  {string} text
   * @return {string}
   */
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  /**
   * 删除
   * @param  {Object} record
   */
  function removeData(record) {
    let arr = [];
    arr.push(record.id);
    dispatch({
      type: 'DataDelete/getDelBillCheck', payload: {
        community_id: params.community_id,
        bill_ids: arr
      }
    });
  }
  /**
   * 删除全部数据
   */
  function delAllData() {
    dispatch({
      type: 'DataDelete/getDelBillAll', payload: {
        community_id: params.community_id,
        group: params.group,
        building: params.building,
        costList: params.costList,
        room: params.room,
        unit: params.unit,
        acct_period: params.acct_period,
        status: params.status
      }
    });
  }
  /**
   * 批量删除
   */
  function selDel() {
    if (selectedRowKeys.length == 0) {
      message.error('请选择至少一条数据删除');
    } else {
      dispatch({
        type: 'DataDelete/getDelBillCheck', payload: {
          community_id: params.community_id,
          bill_ids: selectedIds
        }
      });
    }
  }
  /**
   * 搜索
   */
  function handSearch() {
    form.validateFields((err, values) => {
      params.status = values.status;
      let acct_period;
      if (values.date) {
        acct_period = values.date.format('YYYY-MM-DD');
        delete values.date;
      } else {
        delete values.date;
      }
      dispatch({
        type: 'DataDelete/getDelBillList', payload: { ...params, ...values, acct_period, page: 1 }
      });
    })
  }
  /**
   * 重置
   */
  function handleReset() {
    form.resetFields();
    dispatch({
      type: 'DataDelete/concat',
      payload: {
        buildingData: [],
        unitData: [],
        roomData: [],
        status: 1,
        query: {
          community_id: sessionStorage.getItem("communityId"),
          group: '',
          building: '',
          unit: '',
        }
      }
    })
    form.validateFields((err, values) => {
      const payload = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        group: '',
        building: '',
        unit: '',
        room: '',
        costList: [],
        acct_period: '',
        status: 1
      }
      dispatch({
        type: 'DataDelete/getDelBillList', payload
      });
    })
  }
  // 获取最新的小区id
  function getNewCommunityId(val) {
    params.community_id = val;
  }
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
  };
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>系统管理</Breadcrumb.Item>
      <Breadcrumb.Item>数据删除</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Community form={form} getNewCommunityId={getNewCommunityId.bind(this)} allDatas={{ community: { label: '小区名称' }, group: {}, building: {}, unit: {}, room: {} }} />
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="账单日期：" style={{ marginBottom: '10px' }} {...formItemLayout}>
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="收费项目" style={{ marginBottom: '10px' }} {...formItemLayout}>
              {getFieldDecorator('costList', { initialValue: values })(
                <Select mode="multiple" placeholder="请选择收费项目">
                  {costType.map((value, index) => {
                    return <Option key={index} value={value.key}>{value.label}</Option>
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="数据状态" style={{ marginBottom: '10px' }} {...formItemLayout}>
              {getFieldDecorator('status', { initialValue: '1' })(
                <Select placeholder="请选择数据状态">
                  <Option key="1" value="1">线上未缴</Option>
                  <Option key="6" value="6">发布失败</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <div style={{ textAlign: 'right', paddingRight: '2%' }}>
            <Button type="primary" onClick={handSearch} className="mr1">查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </div>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      <div>
        {author('deleteAll') ? <Popconfirm title="确定要删除全部数据吗？" onConfirm={delAllData}>
          <Button type="primary" className="mr1">全部删除</Button>
        </Popconfirm> : null}
        {author('deleteBatch') ? <Popconfirm title="确定要删除已选的数据吗？" onConfirm={selDel}><Button>批量删除</Button></Popconfirm> : null}
      </div>
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.DataDelete
  };
}
export default connect(mapStateToProps)(Form.create()(DataDelete));
