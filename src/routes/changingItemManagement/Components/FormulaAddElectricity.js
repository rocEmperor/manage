import React from 'react'
import {Col, Card, Icon} from 'antd'
// import {authority}from '../../util/index';

function FormulaAddElectricity({items, onEdit}) {
  return (
    <Col span="8">
      <Card className="FormulaManagement-normal" title="固定电价" bordered={true}>
        <div className="y-icon">
          {/* authority('210202')?<Icon type="edit" onClick={onEdit}/>:null */}
          <Icon type="edit" onClick={onEdit}/>
        </div>
        <p className="y-text">{items.formula_desc ? items.formula_desc : ''}</p>
      </Card>
    </Col>
  )
}

export default FormulaAddElectricity
