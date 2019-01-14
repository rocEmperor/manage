import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Table, Popconfirm } from 'antd';
import AddModal from "./componment/addModal.js"
import "./componment/modal.less"
import { author } from '../../../utils/util';

function Consumables(props) {
  const { dispatch, loading, list, params, modalShow, data, edit, materialUnit, materialType } = props;

  //表格
  const tableProps = {
    columns: [{
      title: '材料分类',
      dataIndex: 'cate_name',
      key: 'cate_name',
    }, {
      title: '材料名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '单价（元）',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '单位',
      dataIndex: 'price_unit_desc',
      key: 'price_unit_desc',
    }, {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        return <div>
          {author('edit') ?<a className="mr1" onClick={editInfo.bind(this, record)}>编辑</a>:null}
          <Popconfirm title="确定要删除么？" onConfirm={removeInfo.bind(this, record)}>
            {author('delete') ?<a className="table-operating">删除</a>:null}
          </Popconfirm>
        </div>
      }
    }],
    dataSource: list,
    pagination: false,
    rowKey: record => record.id,
    loading: loading
  }
  function addList() {
    dispatch({
      type: 'Consumables/concat',
      payload: {
        modalShow: true,
        edit: false
      }
    })
  }
  //编辑耗材
  function editInfo(record) {
    const arr = []
    arr.push(record)
    dispatch({
      type: 'Consumables/concat',
      payload: {
        data: arr,
        edit: true,
        modalShow: true
      }
    })
  }
  //删除耗材
  function removeInfo(record) {
    dispatch({
      type: 'Consumables/getDeleteMaterial',
      payload: {
        material_id: record.id
      }
    })
  }
  function handleOk(list) {
    if (edit) {//编辑
      dispatch({
        type: 'Consumables/getEditMaterial',
        payload: {
          ...list["0"]
        }
      })
    } else { //新增
      dispatch({
        type: 'Consumables/getAddMaterial',
        payload: {
          community_id: params.community_id,
          list: list
        }
      })
    }
  }
  function handleCancel() {
    dispatch({
      type: 'Consumables/concat',
      payload: {
        modalShow: false,
        data: [],
      }
    })
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>报修管理</Breadcrumb.Item>
      <Breadcrumb.Item>耗材管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      {author('add') ?<Button type="primary" onClick={addList.bind(this)}>新增耗材</Button>:null}
      <Table className="mt1" {...tableProps} />
      <AddModal
        visible={modalShow}
        handleOk={handleOk.bind(this)}
        handleCancel={handleCancel.bind(this)}
        data={data}
        edit={edit}
        materialUnit={materialUnit}
        materialType={materialType} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.Consumables,
    loading: state.loading.models.Consumables
  };
}
export default connect(mapStateToProps)(Form.create()(Consumables));
