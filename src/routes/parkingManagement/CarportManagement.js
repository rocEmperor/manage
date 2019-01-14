import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, message, Select, Table, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import ExImport from '../../components/ExImport/';
import { download, author, noData, getCommunityId } from '../../utils/util';
import Community from '../../components/Community/Community.js';

function CarportManagement(props) {
  const { dispatch, loading, form, list, is_reset, selectedIds, typeOption, statusOption, params, totals, visible, lotOption, lotAreaOption, selectedRowKeys } = props;
  
  const { getFieldDecorator } = form;

  /**
   * 点击菜单更新数据
  */
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'CarportManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /**
   * 布局
  */
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let selectedId = [];
      for (let i = 0; i < selectedRows.length; i++) {
        selectedId.push(selectedRows[i].id);
      }
      dispatch({
        type: 'CarportManagement/concat',
        payload: {
          selectedRowKeys: selectedRowKeys,
          selectedIds: selectedId
        }
      })

    }
  };
  /**
   * 表格
  */
  const tableProps = {
    columns: [{
      title: '编号',
      dataIndex: 'tid',
      key: 'tid',
      render: noData
    }, {
      title: '停车场',
      dataIndex: 'lot_name',
      key: 'lot_name',
      render: noData
    }, {
      title: '停车区域',
      dataIndex: 'lot_area_name',
      key: 'lot_area_name',
      render: noData
    }, {
      title: '车位号',
      dataIndex: 'car_port_num',
      key: 'car_port_num',
      render: noData
    }, {
      title: '车位类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record, index) => {
        return record.type?record.type.name:''
      } 
    }, {
      title: '车位状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        return record.status?record.status.name:''
      }
    }, {
      title: '车位面积（m²）',
      dataIndex: 'car_port_area',
      key: 'car_port_area',
      render: noData
    }, {
      title: '关联房产',
      dataIndex: 'room_address',
      key: 'room_address',
      render: noData,
      width: '25%'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        let link1 = `/carportManagementRegister?id=${record.id}`;
        let link2 = `/carportManagementView?id=${record.id}`;
        let link3 = `/carportManagementEdit?id=${record.id}`;
        function TableItemTime() {
          return (
            <div>
              {author('edit') ? '' : null}
              <Link to={link1} className="mr1">车辆登记</Link>
              <Link to={link2} className="mr1">查看</Link>
              <Link to={link3} className="mr1">编辑</Link>
              <Popconfirm title="删除后不可恢复，是否确认删除" trigger="click" onConfirm={() => { CarportDel(record) }} >
                <a>删除</a>
              </Popconfirm>
            </div>
          )
        }
        return TableItemTime()
      }
    }],
    dataSource: list,
    pagination: {
      showTotal: (total, range) => `共 ${totals} 条`,
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 10,
      total: totals,
      onChange: (page, size) => { dispatch({ type: 'CarportManagement/getCarportList', payload: { ...params, page } }) },
    },
    rowKey: (record, index) => index,
    loading: loading,
    rowSelection: rowSelection
  }
  /**
   * 查询
   */
  function handSearch() {
    form.validateFields((err, values) => {
      const payload = { ...params, ...values, page: 1 }
      dispatch({
        type: 'CarportManagement/getCarportList', payload
      });
      dispatch({
        type: 'CarportManagement/concat',
        payload: {
          selectedRowKeys: [],
          selectedIds: []
        }
      })
    })
  }
  /**
   * 重置
   * @param {*} e
   */
  function handleReset(e) {
    form.resetFields();
    const payload = {
      page: 1,
      rows: 10,
      community_id: getCommunityId(),
      lot_id: "",
      lot_area_id: "",
      car_port_type: "",
      car_port_num: "",
      car_port_status: "",
      room_name: "",
      room_mobile: "",
      building: "",
      group: "",
      room: "",
      unit: ""
    }
    dispatch({
      type: 'CarportManagement/getCarportList', payload
    });
    const params = {
      unitData:[],
      roomData:[],
      buildingData:[],
    };
    dispatch({
      type: 'CommunityModel/concat',
      payload: params
    });
  }
  /**
   * 批量删除
   */
  // 批量删除
  function batchDelete() {
    if (selectedRowKeys.length == 0) {
      message.error('请选择至少一条数据删除');
    } else {
      dispatch({
        type: 'CarportManagement/portSelDel', payload: {
          community_id: params.community_id,
          id: selectedIds.join()
        }
      });
    }
  }
  /**
   * 停车场选择显示停车区域列表
   * @param {*} params 停车场val
   */
  function lotOptionChange(params) {
    form.setFieldsValue({ lot_area_id: undefined });
    dispatch({
      type: 'CarportManagement/getLotAreaList',
      payload: { lot_id: params, community_id: getCommunityId() }
    });
  }
  /**
   * 显示上传弹框
   */
  function showModalImport() {
    dispatch({
      type: 'CarportManagement/concat',
      payload: {
        visible: true
      }
    });
  }
  /**
   * 隐藏上传弹框
   */
  function hideModalVisible() {
    form.resetFields(['community_ids']);
    dispatch({
      type: 'CarportManagement/concat',
      payload: {
        visible: false
      }
    });
    handleReset();
  }
  /**
   * 删除
   * @param {*} record 
   */
  function CarportDel(record) {
    dispatch({
      type: 'CarportManagement/getCarportDel', payload: {
        id: record.id,
        community_id: getCommunityId()
      }
    });
  }

  // 导出
  function handleExport() {
    dispatch({
      type: 'CarportManagement/carExport',
      payload: { ...params },
      callback(data) {
        download(data);
      }
    });
  }
  // 下载模板
  function downFiles() {
    dispatch({
      type: 'CarportManagement/downModel',
      payload: {
        community_id: sessionStorage.getItem("communityId")
      }, callback(data) {
        download(data);
      }
    })
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>停车管理</Breadcrumb.Item>
        <Breadcrumb.Item>车位管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="停车场" {...formItemLayout}>
                {getFieldDecorator('lot_id')(
                  <Select placeholder="请选择停车场" notFoundContent="没有数据" onChange={lotOptionChange.bind(this)} showSearch optionFilterProp="children">
                    {lotOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="停车区域" {...formItemLayout}>
                {getFieldDecorator('lot_area_id')(
                  <Select placeholder="请选择停车区域" notFoundContent="没有数据" showSearch optionFilterProp="children">
                    {lotAreaOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车位类型" {...formItemLayout}>
                {getFieldDecorator('car_port_type')(
                  <Select placeholder="请选择车位类型" notFoundContent="没有数据">
                    {typeOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车位号" {...formItemLayout}>
                {getFieldDecorator('car_port_num')(<Input type="text" placeholder="请输入车位号" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车位状态" {...formItemLayout}>
                {getFieldDecorator('car_port_status')(
                  <Select placeholder="请选择车位状态" notFoundContent="没有数据">
                    {statusOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="产权人" {...formItemLayout}>
                {getFieldDecorator('room_name')(<Input type="text" placeholder="请输入产权人" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="联系电话" {...formItemLayout}>
                {getFieldDecorator('room_mobile')(<Input type="text" placeholder="请输入联系电话" />
                )}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{ group: { label: "关联房产" }, building: {}, unit: {}, room: {} }} />
            <Col span={6} style={{ textAlign: 'right', paddingRight: '35px' }}>
              <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Link to="/carportManagementAdd">
          <Button type="primary">新增车位</Button>
        </Link>
        <Button type="primary" style={{ marginLeft: "15px" }} onClick={showModalImport.bind(this)}>批量导入</Button>
        <Button type="primary" style={{ marginLeft: "15px" }} onClick={handleExport.bind(this)}>导出</Button>
        <Button type="primary" style={{ marginLeft: "15px" }} onClick={batchDelete.bind(this)}>批量删除</Button>
        <Table className="mt1" {...tableProps} />
        <ExImport id={'communitys'} visible={visible} callback={hideModalVisible.bind(this)} importUrl="/wisdompark/backend-carport/import" downUrl={downFiles.bind(this)} />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.CarportManagement,
    loading: state.loading.models.CarportManagement
  };
}
export default connect(mapStateToProps)(Form.create()(CarportManagement));