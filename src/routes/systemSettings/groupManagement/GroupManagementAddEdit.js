import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Button, message } from 'antd';
import Menus from '../../../components/Menus/index';
import SearchAdd from './components/SearchAdd.js';
let hasSubmit = false;
function GroupManagementAddEdit(props) {
  const { loading,dispatch, form, id, info, menus, menuChecked,section_checked,disabled,departmentList,infoSendType,groupList,select_value,unfoldList } = props;
  /**
   * 同步复选框选中项
   * @param  {Object} data
   */
  function checkAddMenus(id, data) {
    dispatch({
      type: 'GroupManagementAddEdit/concat',
      payload: { menuChecked: data }
    });
  }
  /**
   * 提交表单
   */
  function submit(e) {
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      let arr = [];
      if (Object.keys(menuChecked).length === 0) {
        if (id) {
          info.menu_list.map(vv => {
            let obj = {};
            obj.id = vv.id;
            obj.children = [];
            if (vv.children) {
              vv.children.map(v => {
                obj.children.push(v.id);
              })
            }
            arr.push(obj);
          });
        } else {
          message.info("请选择菜单权限！");
          return;
        }
      } else {
        menus.map(vv => {
          let obj = {};
          if (menuChecked[vv.id]) {
            obj.id = vv.id;
            obj.children = [];
            vv.children ? vv.children.map(v => {
              if (menuChecked[v.id]) {
                obj.children.push(v.id);
              }
            }) : ''
            arr.push(obj);
          }
        });
      }
      if (!hasSubmit) {
        hasSubmit = true;
        if (!id) {
          dispatch({
            type: 'GroupManagementAddEdit/getAddManage',
            payload: {
              parent_id:values.parent_name,
              name: values.name,
              see_limit:values.see_limit==false?"0":values.department,
              see_group_id:values.see_group_id,
              menus: arr
            },
            callback: () => {
              hasSubmit = false
              window.location.href = "#/groupManagement";
              window.scrollTo(0, 0);
            },
            err: () => {hasSubmit = false}
          });
        } else {
          dispatch({
            type: 'GroupManagementAddEdit/getEditManage',
            payload: {
              group_id: id,
              name: values.name,
              parent_id:values.parent_name,
              see_limit:values.see_limit==false?"0":values.department,
              see_group_id:values.see_group_id,
              menus: arr
            },
            callback: () => {
              hasSubmit = false
              window.location.href = "#/groupManagement";
              window.scrollTo(0, 0)
            },
            err: () => {hasSubmit = false}
          });
        }
      }
    })
  }
  /**
   * 返回部门管理页面
   */
  function handleBack() {
    history.back();
  }
  const all={
    from:form,
    id,
    info,
    dispatch,
    groupList,
    section_checked,
    disabled,
    departmentList,
    infoSendType,
    select_value,
    unfoldList,
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>系统设置</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/groupManagement">部门管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <SearchAdd {...all} />
    </Card>
    <Row>
      <Col span={24}>
        <Card className="y-card" style={{ marginTop: 20 }} >
          <h4 className="y-card-title">菜单权限</h4>
          <Menus allMenus={menus} id={'menu'} infoMenu={info.menu_list} callback={checkAddMenus.bind(this)} />
        </Card>
      </Col>
    </Row>
    <div style={{ marginTop: 20 }}>
      <Button type="primary" onClick={submit.bind(this)} loading={loading}>保存</Button>
      <Button onClick={handleBack.bind(this)} style={{ marginLeft: '10px' }}>取消</Button>
    </div>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.GroupManagementAddEdit,
    loading: state.loading.models.GroupManagementAddEdit
  };
}
export default connect(mapStateToProps)(Form.create()(GroupManagementAddEdit));
