import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, message, Card, Row, Col, Input, Button, Select, Table, DatePicker, Popconfirm, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { noData, download, getCommunityId, author } from '../../utils/util';
import ExImport from '../../components/ExImport/';
const { RangePicker } = DatePicker;


const FormItem = Form.Item;
const Option = Select.Option;


function CarOwnerManagement(props) {
  const { dispatch, loading, form, list, lists, selectedRowKeys, selectedIds, disabledTime, params, totals, car_id, car_port_num, car_num, show, visible, showrRenewal, is_reset, lotOption, lotAreaOption } = props;

  const { getFieldDecorator } = form;

  /**
   * 点击菜单更新数据
  */
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'CarOwnerManagementModels/concat',
      payload: {
        is_reset: false,
      }
    });
  }

  /**
   * 停车场选择显示停车区域列表
   * @param {*} params 停车场val
   */
  function lotOptionChange(params) {
    form.setFieldsValue({ lot_area_id: undefined });
    dispatch({
      type: 'CarOwnerManagementModels/getLotAreaList',
      payload: { lot_id: params, community_id: getCommunityId() }
    });
  }

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    },
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let selectedId = [];
      for (let i = 0; i < selectedRows.length; i++) {
        selectedId.push(selectedRows[i].id);
      }
      dispatch({
        type: 'CarOwnerManagementModels/concat',
        payload: {
          selectedRowKeys: selectedRowKeys,
          selectedIds: selectedId
        }
      })

    }
  };
  const tableProps = {
    columns: [{
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      render: noData,
    }, {
      title: '车牌',
      dataIndex: 'car_num',
      key: 'car_num',
      render: noData,
    }, {
      title: '车位号',
      dataIndex: 'car_port_num',
      key: 'car_port_num',
      render: noData,
    }, {
      title: '停车场',
      dataIndex: 'lot_name',
      key: 'lot_name',
      render: noData,
    }, {
      title: '停车区域',
      dataIndex: 'lot_area_name',
      key: 'lot_area_name',
      render: noData,
    }, {
      title: '车主姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      render: noData,
    }, {
      title: '车主电话',
      dataIndex: 'user_mobile',
      key: 'user_mobile',
      render: noData,
    }, {
      title: '停车卡号',
      dataIndex: 'park_card_no',
      key: 'park_card_no',
      render: noData,
    }, {
      title: '关联房产',
      dataIndex: 'room_address',
      key: 'room_address',
      render: noData,
    }, {
      title: '当前状态',
      dataIndex: 'status_label',
      key: 'status_label',
      render: noData,
    }, {
      title: '续费记录',
      dataIndex: 'renew_record',
      key: 'renew_record',
      render: (text, record) => {
        function TableItemTime() {
          return (
            <div>
              {
                author('renewView') ? <a onClick={() => { renewViewModal(record) }}>查看</a> : null
              }
            </div>
          )
        }
        return TableItemTime()
      }
    }, {
      title: '开始时间',
      dataIndex: 'carport_rent_start',
      key: 'carport_rent_start',
      render: noData,
    }, {
      title: '结束时间',
      dataIndex: 'carport_rent_end',
      key: 'carport_rent_end',
      render: noData,
    }, {
      title: '操作',
      dataIndex: 'make',
      key: 'make',
      render: (text, record) => {
        let link = `/carOwnerAdd?id=${record.id}`
        function TableItemTime() {
          return (
            <div>
              {
                author('edit') ? <Link to={link} className="ml1"> 编辑</Link> : null
              }
              {
                author('delete') ?
                  <Popconfirm title="删除后不可恢复，是否确认删除" trigger="click" onConfirm={() => { OwneDelete(record) }} >
                    <a className="ml1" >{record.renew_record == 0 ? '' : '删除'}</a>
                  </Popconfirm> : null
              }
              {
                author('renew') && record.car_port_status != 1 ? <a className="ml1" onClick={() => { RenewalModal(record) }}>续费</a> : null
              }
            </div>
          )
        }
        return TableItemTime()
      }
    }],
    dataSource: list,
    pagination: {
      showTotal: (total, range) => `共 ${totals} 条`,
      defaultCurrent: 1,
      current: params.page,
      defaultPageSize: 10,
      total: totals,
      onChange: (page, size) => { dispatch({ type: 'CarOwnerManagementModels/getOwnerList', payload: { ...params, page } }) },
    },
    rowKey: (record, index) => index,
    loading: loading,
    rowSelection: rowSelection

  }

  function handSearch() {
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: getCommunityId(),
        lot_id: values.lot_id,
        lot_area_id: values.lot_area_id,
        car_num: values.car_num,
        park_card_no: values.park_card_no,
        car_port_num: values.car_port_num,
        status: values.status,
        user_name: values.user_name,
        user_mobile: values.user_mobile,
      };
      if (values.date && values.date.length > 0) {
        param.carport_rent_start = values.date ? values.date[0].format('YYYY-MM-DD') : '';
        param.carport_rent_end = values.date ? values.date[1].format('YYYY-MM-DD') : '';
      } else {
        param.carport_rent_start = '';
        param.carport_rent_end = '';
      }
      dispatch({
        type: 'CarOwnerManagementModels/getOwnerList', payload: { ...param }
      });
      dispatch({
        type: 'CarOwnerManagementModels/concat',
        payload: {
          selectedRowKeys: [],
          selectedIds: []
        }
      })
    })
  }

  function handleReset(e) {
    form.resetFields();
    const param = {
      page: 1,
      rows: 10,
      community_id: getCommunityId(),
      lot_id: '',
      lot_area_id: '',
      car_num: '',
      park_card_no: '',
      car_port_num: '',
      status: '',
      user_name: '',
      user_mobile: '',
      carport_rent_start: '',
      carport_rent_end: ''
    }
    dispatch({
      type: 'CarOwnerManagementModels/getOwnerList', payload: param
    });
    dispatch({
      type: 'CarOwnerManagementModels/concat',
      payload: {
        lotAreaOption:[]
      }
    })
  }

  function OwneDelete(record) {
    dispatch({
      type: 'CarOwnerManagementModels/getOwneDelete', payload: {
        user_carport_id: record.id,
        community_id: getCommunityId()
      }
    });
  }

  const modalColumns = [{
    title: '车牌',
    dataIndex: 'car_num',
    key: 'car_num',

  }, {
    title: '车位号',
    dataIndex: 'car_port_num',
    key: 'car_port_num',
  }, {
    title: '续费日期',
    dataIndex: 'created_at',
    key: 'created_at',
  }, {
    title: '续费至',
    dataIndex: 'carport_rent_end',
    key: 'carport_rent_end',
  }, {
    title: '费用（元）',
    dataIndex: 'carport_rent_price',
    key: 'carport_rent_price',
  }]


  const tableModal = {
    rowKey: record => record.id,
    loading: loading,
    columns: modalColumns,
    dataSource: lists
  }

  function handleHidden(params) {
    dispatch({
      type: 'CarOwnerManagementModels/concat', payload: {
        show: false,
        showrRenewal: false
      }
    })
    props.form.resetFields();
  }
  // 不可选择日期
  function disabledDate(current) {
    if(new Date(disabledTime).getTime() < new Date().getTime()){
      return current && current.valueOf() < Date.now() - 86400000;
    }else{
      return current && current.valueOf() < (new Date(disabledTime).getTime() + 86400000);
    }
  }
  //显示上传弹框
  function showInModal() {
    dispatch({
      type: 'CarOwnerManagementModels/concat',
      payload: {
        visible: true,
      }
    });
  }
  //隐藏上传弹框
  function hideModalVisible() {
    dispatch({
      type: 'CarOwnerManagementModels/concat',
      payload: {
        visible: false,
      }
    });
    handleReset();
  }
  // 批量导入中的下载模板
  function downFiles() {
    dispatch({
      type: 'CarOwnerManagementModels/downFiles',
      payload: {
        "community_id": getCommunityId()
      }, callback(data) {
        download(data);
      }
    });
  }
  // 导出文件
  function handleExport() {
    dispatch({
      type: 'CarOwnerManagementModels/carOwnerExportData',
      payload: {
        "community_id": sessionStorage.getItem("communityId"),
        lot_id: params.lot_id,
        lot_area_id: params.lot_area_id,
        car_num: params.car_num,
        park_card_no: params.park_card_no,
        car_port_num: params.car_port_num,
        status: params.status,
        user_name: params.user_name,
        user_mobile: params.user_mobile,
        carport_rent_start: params.carport_rent_start,
        carport_rent_end: params.carport_rent_end
      }, callback(data) {
        download(data);
      }
    });
  }
  //续费
  function RenewalModal(record) {
    dispatch({
      type: 'CarOwnerManagementModels/concat',
      payload: {
        showrRenewal: true,
        car_num: record.car_num,
        car_port_num: record.car_port_num,
        car_id: record.id,
        disabledTime: record.carport_rent_end
      }
    });

  }
  //查看续费记录
  function renewViewModal(record) {
    let param = {
      community_id: getCommunityId(),
      user_carport_id: record.id
    }
    dispatch({
      type: 'CarOwnerManagementModels/concat',
      payload: {
        show: true,
      }
    });
    dispatch({
      type: 'CarOwnerManagementModels/renewList',
      payload: param
    });
  }
  // 车辆续费 
  function handleOk() {
    form.validateFields(['expired', 'modalArea'], (err, values) => {
      dispatch({
        type: 'CarOwnerManagementModels/getOwneRenew',
        payload: {
          carport_rent_end: values.expired ? values.expired.format('YYYY-MM-DD') : '',
          carport_rent_price: values.modalArea,
          user_carport_id: car_id
        },callback(){
          props.form.resetFields(['expired','modalArea']);
        }
      });
    })
  }
  // 批量删除
  function carSelDel() {
    if (selectedRowKeys.length == 0) {
      message.error('请选择至少一条数据删除');
    } else {
      dispatch({
        type: 'CarOwnerManagementModels/carSelDel', payload: {
          community_id: params.community_id,
          user_carport_ids: selectedIds
        }
      });
    }
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>停车管理</Breadcrumb.Item>
        <Breadcrumb.Item>车辆管理</Breadcrumb.Item>
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
              <FormItem label="车牌号" {...formItemLayout}>
                {getFieldDecorator('car_num')(<Input type="text" placeholder="请输入车牌号" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="停车卡号" {...formItemLayout}>
                {getFieldDecorator('park_card_no')(<Input type="text" placeholder="请输入停车卡号" />
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
              <FormItem label="车辆状态" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择车辆状态" notFoundContent="没有数据">
                    <Option key="1" value="1">有效</Option>
                    <Option key="2" value="2">过期</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车主姓名" {...formItemLayout}>
                {getFieldDecorator('user_name')(<Input type="text" placeholder="请输入车主姓名" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车主电话" {...formItemLayout}>
                {getFieldDecorator('user_mobile')(<Input type="text" placeholder="请输入车主电话" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="有效期" {...formItemLayout2}>
                {getFieldDecorator('date')(<RangePicker style={{ width: '96%' }}/>
                )}
              </FormItem>
            </Col>

            <Col span={6} style={{ paddingLeft: '35px' }} className="fr">
              <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        {author('add') ? <Link to="/carOwnerAdd"><Button type="primary">新增车辆</Button></Link> : null}
        {author('import') ? <Button type="primary" style={{ marginLeft: "15px" }} onClick={showInModal.bind(this)}>批量导入</Button> : null}
        {author('export') ? <Button type="primary" style={{ marginLeft: "15px" }} onClick={handleExport.bind(this)}>导出</Button> : null}
        {author('selDelete') ? <Button type="primary" style={{ marginLeft: "15px" }} onClick={carSelDel.bind(this)}>批量删除</Button> : null}
        <Table className="mt1" {...tableProps} />

        <ExImport id={'communitys'} visible={visible} callback={hideModalVisible.bind(this)} importUrl="/wisdompark/car-manage/import" downUrl={downFiles.bind(this)} />
        <Modal title="续费记录详情" visible={show} footer={null} onCancel={handleHidden}>
          <Table className="mt1" {...tableModal} />
        </Modal>

        <Modal title="续费" visible={showrRenewal} onCancel={handleHidden} onOk={handleOk.bind(this)}>
          <FormItem label="车主姓名:" {...formItemLayout}>
            <span>{car_num}</span>
          </FormItem>

          <FormItem label="车位号:" {...formItemLayout}>
            <span>{car_port_num}</span>
          </FormItem>

          <FormItem label="有效期至" {...formItemLayout} >
            {getFieldDecorator('expired', {
              rules: [{ required: true, message: '请选择有效期至' }]
            })(<DatePicker placeholder="请选择有效期至" disabledDate={disabledDate} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="费用">
            {getFieldDecorator('modalArea', {
              rules: [{ required: true, message: '请输入费用', whitespace: true }],
            })(<Input type="num" maxLength={5} placeholder="请输入费用" addonAfter="元" />)}
          </FormItem>
        </Modal>
      </Card>
    </div>
  )
}


function mapStateToProps(state) {
  return {
    ...state.CarOwnerManagementModels,
    loading: state.loading.models.CarOwnerManagementModels
  };
}
export default connect(mapStateToProps)(Form.create()(CarOwnerManagement));