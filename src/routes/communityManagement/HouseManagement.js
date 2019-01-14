import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Breadcrumb, Table, Select, Popconfirm, Card, Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import { noData, download } from '../../utils/util';
import Community from '../../components/Community/Community.js';
import ExImport from '../../components/ExImport/';
import { getCommunityId, author } from '../../utils/util';

function HouseManagement(props) {
  let { dispatch, form, list, floorList, liftList, totals, params, loading, visible, visible1, all_area, is_reset, labelType } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'HouseManagementModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /**
   * 查询表格数据
   * @param  {Object} params
   */
  function reload(params) {
    dispatch({
      type: 'HouseManagementModel/getList',
      payload: params,
    });
  }
  /**
   * 删除数据
   * @param  {Object} text
   */
  function removeInfo(text) {
    dispatch({
      type: 'HouseManagementModel/removeInfo',
      payload: {
        out_room_id: text.out_room_id
      },
      callback: () => {
        form.validateFields((err, values) => {
          const param = values;
          param.page = 1;
          param.rows = 10;
          param.community_id = getCommunityId();
          reload(param);
        });
      }
    });
  }
  /**
   * 导出文件
   */
  function handleExport() {
    // let ids = selectedRowKeys;
    form.validateFields((err, values) => {
      let param = values;
      param.community_id = getCommunityId();
      dispatch({
        type: 'HouseManagementModel/houseExport',
        payload: param,
        callback(data){
          download(data);
        }
      });
      // window.open(exportUrl);
      dispatch({
        type: 'HouseManagementModel/concat',
        payload: {
          visible2: false,
          selectedNum: 0,
          selectedRowKeys: [],
        }
      });
    });
  }
  /**
   * 批量导入中的下载模板
   */
  function downFiles() {
    dispatch({
      type: 'HouseManagementModel/downFiles',
      payload: {
        "community_id": getCommunityId()
      },callback(data){
        download(data);
      }
    });
  }
  /**
   * 显示弹框
   * @param  {Number} val
   * val = 1  批量导入弹框
   * val = 2  导出弹框
   * val = 3  数据订正弹框
   */
  function showModal(val) {
    if (val == 1) {
      dispatch({
        type: 'HouseManagementModel/concat',
        payload: {
          visible: true
        }
      });
    } else if (val == 2) {
      dispatch({
        type: 'HouseManagementModel/concat',
        payload: {
          visible2: true
        }
      });
    } else if (val == 3) {
      dispatch({
        type: 'HouseManagementModel/concat',
        payload: {
          visible1: true
        }
      });
    }

  }


  /**
   * 隐藏弹框
   */
  function hideModalVisible() {
    dispatch({
      type: 'HouseManagementModel/concat',
      payload: {
        visible: false,
        visible2: false,
        visible1: false
      }
    });
    handleReset()
  }
  /**
   * 查询
   */
  function handleSubmit() {
    form.validateFields((err, values) => {
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.community_id = getCommunityId();
      reload(param);
    });
    dispatch({
      type: 'HouseManagementModel/concat',
      payload: {
        selectedNum: 0,
      }
    });
  }
  /**
   * 重置
   */
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: getCommunityId(),
        group: [],
        unit: [],
        room: [],
        building: [],
        property_type: "",
        status: "",
        room_label_id:[]
      };
      reload(param);
    });
    dispatch({
      type: 'HouseManagementModel/concat',
      payload: {
        selectedNum: 0,
      }
    });
    const params = {
      unitData: [],
      roomData: [],
      buildingData: [],
    };
    dispatch({
      type: 'CommunityModel/concat',
      payload: params
    });
  }
  /**
   * 切换页码
   * @param  {Number} page
   */
  function handlePaginationChange(page, size) {
    const param = { ...params, page };
    reload(param);
  }
  /**
   * 楼道号与电梯号选择
   * @param  {String} e
   * @param  {String} val
   * e = 1 楼道号
   * e = 2 电梯编号
   */
  function handleFloorListChange(e, val) {
    if (e == 1) {
      floorList.map(item => {
        if (item.name == val) {
          dispatch({
            type: 'HouseManagementModel/concat',
            payload: {
              floor_shared_id: item.id
            }
          })
        }
      })
    } else if (e == 2) {
      liftList.map(item => {
        if (item.name == val) {
          dispatch({
            type: 'HouseManagementModel/concat',
            payload: {
              lift_shared_id: item.id
            }
          })
        }
      })
    }
  }
  /**
   * 表格排序
   * @param  {Object} sorter
   */
  function tableChanges(pagination, filters, sorter) {
    form.validateFields((err, values) => {
      let { group, unit, room, building, property_type, status } = values;
      if (Object.keys(sorter).length != 0) {
        dispatch({
          type: 'HouseManagementModel/getList',
          payload: {
            community_id: sessionStorage.getItem("communityId"),
            page: params.page,
            rows: 10,
            group,
            unit,
            room,
            building,
            property_type,
            status,
            order_sort: (sorter.order.indexOf('descend') > -1 ? 'desc' : 'asc')
          },
        });
      }
    })
  }
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  };
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `总面积${all_area}㎡，共${totals}条`,
    defaultCurrent: 1
  };
  // 表格列配置
  const columns = [{
    title: '苑/期/区',
    dataIndex: 'group',
    key: 'group',
    render: noData,
    sorter: true,
  }, {
    title: '幢',
    dataIndex: 'building',
    key: 'building',
    render: noData,
  }, {
    title: '单元',
    dataIndex: 'unit',
    key: 'unit',
    render: noData,
  }, {
    title: '室',
    dataIndex: 'room',
    key: 'room',
    render: noData,
  }, {
    title: '楼段系数',
    dataIndex: 'floor_coe',
    key: 'floor_coe',
    render: noData,
  }, {
    title: '楼道号',
    dataIndex: 'floor_shared_id',
    key: 'floor_shared_id',
    render: noData,
  }, {
    title: '电梯编号',
    dataIndex: 'lift_shared_id',
    key: 'lift_shared_id',
    render: noData,
  }, {
    title: '物业类型',
    dataIndex: 'property_type',
    key: 'property_type',
    render: noData,
  }, {
    title: '房屋状态',
    dataIndex: 'status',
    key: 'status',
    render: noData,
  }, {
    title: '收费面积',
    dataIndex: 'charge_area',
    key: 'charge_area',
    render: (text) => {
      return <span>{`${text}m²`}</span>
    },
  }, {
    title: '备注',
    dataIndex: 'intro',
    key: 'intro',
    render: (text, record) => {
      if (text) {
        return (<span>{text.length > 10 ? text.substring(0, 10) + '...' : text}</span>)
      } else {
        return (<span>-</span>)
      }
    },
  }, {
    title: '操作',
    key: 'action3',
    render: (text, record) => {
      let link = `/addHouse?id=${record.out_room_id}`;
      return (
        <span>
          <Link to={link} className="table-operating">编辑</Link>
          {author('delete') ? <Popconfirm title="确定要删除这个房屋数据么？" onConfirm={removeInfo.bind(this, text)}>
            <a className="table-operating" style={{ marginLeft: '10px' }}>删除</a>
          </Popconfirm> : null}
        </span>
      )

    },
  }];
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>房屋管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
            <Col span={6}>
              <FormItem label="物业类型：" {...formItemLayout}>
                {getFieldDecorator('property_type')(
                  <Select placeholder="请选择物业类型">
                    <Option value="">全部</Option>
                    <Option value="1">住宅</Option>
                    <Option value="2">商用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="房屋状态：" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择房屋状态">
                    <Option value="">全部</Option>
                    <Option value="1">已售</Option>
                    <Option value="2">未售</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="楼道号:" {...formItemLayout}>
                {getFieldDecorator('floor_shared_id')(
                  <Select className="select-150 mr-5"
                    optionFilterProp="children"
                    showSearch
                    placeholder="请选择楼道号"
                    onChange={handleFloorListChange.bind(this, "1")}
                  >
                    <Option value="">全部</Option>
                    {floorList ? floorList.map((item) => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="电梯编号:" {...formItemLayout}>
                {getFieldDecorator('lift_shared_id')(
                  <Select className="select-150 mr-5"
                    optionFilterProp="children"
                    showSearch
                    placeholder="请选择电梯编号"
                    onChange={handleFloorListChange.bind(this, "2")}
                  >
                    <Option value="">全部</Option>
                    {liftList ? liftList.map((item) => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="房屋标签：" {...formItemLayout}>
                {getFieldDecorator('room_label_id')(
                  <Select
                    optionFilterProp="children"
                    showSearch
                    mode="multiple"
                    placeholder="请选择房屋标签"
                  >
                    {labelType ? labelType.map((item) => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={5} offset={19}>
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        {author('add') ? <Link to="/addHouse"><Button type="primary"><Icon type="plus" />新增房屋</Button></Link> : null}
        {author('batchLeadingIn') ? <Button type="primary" style={{ marginLeft: '10px' }} onClick={showModal.bind(this, 1)}>批量导入</Button> : null}
        <ExImport
          id={'communitys'}
          visible={visible}
          callback={hideModalVisible.bind(this)}
          importUrl="/property/house/import"
          downUrl={downFiles.bind(this)}
        />
        <ExImport
          id={'dataRepair'}
          visible={visible1}
          communityId={sessionStorage.getItem("communityId")}
          callback={hideModalVisible.bind(this)}
          export={handleExport.bind(this)}
          importUrl="/property/house/import-repair"
        />
        {author('export') ? <Button type="primary" style={{ marginLeft: '10px' }} onClick={handleExport.bind(this)}>导出</Button> : null}
        {author('dataCorrection') ? <Button type="primary" style={{ marginLeft: '10px' }} onClick={showModal.bind(this, 3)}>数据订正</Button> : null}
        <Table
          dataSource={list}
          onChange={tableChanges.bind(this)}
          columns={columns}
          loading={loading}
          rowKey={record => record.id}
          pagination={pagination}
          style={{marginTop: "10px"}}
        />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.HouseManagementModel,
    loading: state.loading.models.HouseManagementModel,
  };
}
export default connect(mapStateToProps)(Form.create()(HouseManagement));
