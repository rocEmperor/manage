import React from 'react'
import {Row, Col, Card, Icon} from 'antd'
// import {authority}from '../../util/index';

function FormulaEditWaterPrice({onAdd, items, onEdit}) {
  return (
    <Row>
      <Col span="8">
        <Card className="FormulaManagement-normal" title="水费公式" bordered={true}>
          <div className="y-icon">
            {/* authority('210202')?<Icon type="edit" onClick={onEdit}/>:null */}
            <Icon type="edit" onClick={onEdit}/>
          </div>
          <div className="y-text">
            公式：
            <div dangerouslySetInnerHTML={{__html: items.formula_desc}} />
          </div>
          <div className="y-text">计算规则: {items.calcRule}</div>
        </Card>
      </Col>
    </Row>
  )
}

export default FormulaEditWaterPrice;
