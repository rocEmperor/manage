import React from 'react'
import {Row, Col, Card, Icon, Modal, message} from 'antd'
// import {authority}from '../../../utils/util';

function FormulaDisplays({items, onAdd, onDelete}) {
  let buttonStatus = true;
  function formulaDeleteConfirm (value) {
    Modal.confirm({
      title: '确认删除该公式？',
      onOk() {
        if (buttonStatus) {
          buttonStatus = false
          setTimeout(() => buttonStatus = true, 2000);
          return new Promise((resolve, reject) => {
            onDelete(value.id, resolve, reject)
          }).catch(() => message.warn('Oops errors!'))
        }
      }
    });
  }

  return (
    <Row>
      {/* authority('210203')?
        <Col span="8">
          <Card className="FormulaManagement-add">
            <Icon type="plus" onClick={onAdd}/>
          </Card>
        </Col>:null */}
      <Col span="8">
        <Card className="FormulaManagement-add">
          <Icon type="plus" onClick={onAdd} />
        </Card>
      </Col>
      {items.map((value, index) => {
        return (
          <Col key={index} span="8">
            <Card className="FormulaManagement-normal" title={value.name} bordered={true}>
              <div className="y-icon">
                {/*
                  authority('210201')
                    ? <Icon type="delete" onClick={() => formulaDeleteConfirm(value)} />
                    : null
                */}
                <Icon type="delete" onClick={() => formulaDeleteConfirm(value)} />
              </div>
              <p className="y-text">公式：{value.formula}</p>
              <p className="y-text">计算规则：{value.calcRule}</p>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default FormulaDisplays
