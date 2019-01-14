import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {

  const Login = dynamic({
    app,
    models: () => [
      import('./models/Login'),
    ],
    component: () => import('./components/Login/Login.js'),
  });

  const Register = dynamic({
    app,
    models: () => [
      import('./models/Register'),
    ],
    component: () => import('./components/Register/Register.js'),
  });

  const Container = dynamic({
    app,
    models: () => [
      import('./models/MainLayout'),
    ],
    component: () => import('./components/MainLayout/MainLayout.js'),
  });

  const IndexPage = dynamic({
    app,
    component: () => import('./routes/IndexPage'),
  });

  const CompanyManagement = dynamic({
    app,
    models: () => [
      import('./models/companyManagement/CompanyManagementModel'),
    ],
    component: () => import('./routes/companyManagement/CompanyManagement.js'),
  });
  /********************首页**************************/
  const HomePage = dynamic({
    app,
    models: () => [
      import('./models/homePage/HomePageModel'),
    ],
    component: () => import('./routes/homePage/HomePage.js')
  });


  /********************小区管理**************************/
  /*==房屋管理==*/
  const HouseManagement = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/HouseManagementModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/communityManagement/HouseManagement.js'),
  });
  /*==添加房屋==*/
  const AddHouse = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/AddHouseModel'),
    ],
    component: () => import('./routes/communityManagement/AddHouse.js'),
  });
  /*==住户管理==*/
  const ResidentsManage = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ResidentsManageModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/communityManagement/ResidentsManage.js'),
  });
  /*==住户管理详情 --- 迁出&迁入详情==*/
  const ResidentsViewOne = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ResidentsViewOneModel')
    ],
    component: () => import('./routes/communityManagement/ResidentsViewOne.js'),
  });
  /*==住户管理详情 --- 未通过&待审核详情==*/
  const ResidentsViewTwo = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ResidentsViewTwoModel')
    ],
    component: () => import('./routes/communityManagement/ResidentsViewTwo.js'),
  });
  /*==住户新增编辑==*/
  const ResidentsAdd = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ResidentsAddModel'),
    ],
    component: () => import('./routes/communityManagement/ResidentsAdd.js'),
  });
  /*==水表管理==*/
  const MeterReadingManager = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/MeterReadingManagerModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/communityManagement/MeterReadingManager.js'),
  });
  /*==水表新增==*/
  const MeterReadingAdd = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/MeterReadingAddModel'),
    ],
    component: () => import('./routes/communityManagement/MeterReadingAdd.js'),
  });
  /*==电表管理==*/
  const ElectricityManage = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ElectricityManageModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/communityManagement/ElectricityManage.js'),
  });
  /*==电表新增==*/
  const ElectricityReadingAdd = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ElectricityReadingAddModel'),
    ],
    component: () => import('./routes/communityManagement/ElectricityReadingAdd.js'),
  });
  /*==公摊项目管理==*/
  const ProjectManagement = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ProjectManagementModel'),
    ],
    component: () => import('./routes/communityManagement/ProjectManagement.js'),
  });
  /*==公摊项目新增编辑==*/
  const ProjectManagementAdd = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ProjectManagementAddModel'),
    ],
    component: () => import('./routes/communityManagement/ProjectManagementAdd.js'),
  });
  /*==业主信息变更==*/
  const RightInfoChange = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/RightInfoChangeModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/communityManagement/RightInfoChange.js'),
  });
  /*==业主信息详情==*/
  const ChangerView = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/ChangerViewModel'),
    ],
    component: () => import('./routes/communityManagement/ChangerView.js'),
  });
  /*==标签管理==*/
  const Tags = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/TagsModel'),
    ],
    component: () => import('./routes/communityManagement/Tags.js'),
  });



  /********************报事管理**************************/
  //报事管理-业主投诉
  const ComplaintManagement = dynamic({
    app,
    models: () => [
      import('./models/dispatchManagement/complaintManagement/ComplaintManagementModel'),
    ],
    component: () => import('./routes/dispatchManagement/complaintManagement/ComplaintManagement.js'),
  });
  //报事管理-查看
  const ComplaintView = dynamic({
    app,
    models: () => [
      import('./models/dispatchManagement/complaintManagement/ComplaintViewModel'),
    ],
    component: () => import('./routes/dispatchManagement/complaintManagement/ComplaintView.js'),
  });

  //门禁管理>门禁设备管理
  const DeviceManagement = dynamic({
    app,
    models: () => [
      import('./models/deviceManagement/DeviceManagementModel'),
    ],
    component: () => import('./routes/deviceManagement/DeviceManagement.js'),
  });
  //门禁管理>出入记录
  const DeviceLog = dynamic({
    app,
    models: () => [
      import('./models/deviceManagement/DeviceLogModel'),
    ],
    component: () => import('./routes/deviceManagement/DeviceLog.js'),
  });
  //统计报表>单小区数据报表
  const SingleCommunity = dynamic({
    app,
    models: () => [
      import('./models/statisticalReport/singleCommunity/SingleCommunityModel'),
    ],
    component: () => import('./routes/statisticalReport/singleCommunity/SingleCommunity.js'),
  });
  //统计报表>小区概况对比表
  const CommunityCompare = dynamic({
    app,
    models: () => [
      import('./models/statisticalReport/communityCompare/CommunityCompareModel'),
    ],
    component: () => import('./routes/statisticalReport/communityCompare/CommunityCompare.js'),
  });

  //物业服务-办事指南
  const CommunityGuide = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/CommunityGuideModel'),
    ],
    component: () => import('./routes/propertyServices/CommunityGuide.js')
  });
  //物业服务-新增指南
  const AddGuide = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/AddGuideModel'),
    ],
    component: () => import('./routes/propertyServices/AddGuide.js')
  });
  //物业服务-小区包裹
  const PackageManagement = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/PackageManagementModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/propertyServices/PackageManagement.js')
  });
  //物业服务-新增包裹
  const PackageAdd = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/PackageAddModel'),
    ],
    component: () => import('./routes/propertyServices/PackageAdd.js')
  });
  //阳光工作栏
  const SunNotice = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/SunNoticeModel'),
    ],
    component: () => import('./routes/propertyServices/SunNotice.js')
  });
  //新增阳光工作栏
  const AddNotice = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/AddNoticeModel'),
    ],
    component: () => import('./routes/propertyServices/AddNotice.js')
  });
  //查看小区公告
  const ShowNotice = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/ShowNoticeModel'),
    ],
    component: () => import('./routes/propertyServices/ShowNotice.js')
  });
  //阳光工作栏详情
  const EditNotice = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/EditNoticeModel'),
    ],
    component: () => import('./routes/propertyServices/EditNotice.js')
  });
  //消息管理
  const NewsManager = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/NewsManagerModel'),
    ],
    component: () => import('./routes/propertyServices/NewsManager.js')
  });
  //新增消息
  const AddNews = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/AddNewsModel'),
    ],
    component: () => import('./routes/propertyServices/AddNews.js')
  });
  //编辑
  const EditNews = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/EditNewsModel'),
    ],
    component: () => import('./routes/propertyServices/EditNews.js')
  });
  //垃圾发放记录
  const GiveRecord = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/GiveRecordModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/propertyServices/GiveRecord.js')
  });
  //垃圾检查记录
  const CheckRecord = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/CheckRecordModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/propertyServices/CheckRecord.js')
  });
  //垃圾检查记录
  const CheckDetail = dynamic({
    app,
    models: () => [
      import('./models/propertyServices/CheckDetailModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/propertyServices/CheckDetail.js')
  });
  
  
  //详情
  // const ViewNews = dynamic({
  //   app,
  //   models: () => [
  //   import('./models/propertyServices/ViewNewsModel'),
  //   ],
  //   component: () => import('./routes/propertyServices/ViewNews.js')
  // });
  //停车管理-停车场设备管理
  const CarEquipManagement = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/CarEquipManagementModel.js'),
    ],
    component: () => import('./routes/parkingManagement/CarEquipManagement.js'),
  });

  //停车管理-在库车辆
  const GetInManagement = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/GetInManagementModel.js'),
    ],
    component: () => import('./routes/parkingManagement/GetInManagement.js'),
  });

  //停车管理-出库记录
  const GetOutManagement = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/GetOutManagementModel.js'),
    ],
    component: () => import('./routes/parkingManagement/GetOutManagement.js'),
  });

  //停车管理-收费规则设置
  const ConfigFeeRule = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/ConfigFeeRuleModels.js'),
    ],
    component: () => import('./routes/parkingManagement/ConfigFeeRule.js'),
  });

  //停车管理-车位管理
  const CarportManagement = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/CarportManagementModels.js'),
      import('./models/Community')
    ],
    component: () => import('./routes/parkingManagement/CarportManagement.js'),
  });
  //停车管理-车位管理-新增/编辑
  const CarportManagementAddEdit = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/CarportManagementAddEditModels.js'),
    ],
    component: () => import('./routes/parkingManagement/CarportManagementAddEdit.js'),
  });
  //停车管理-车位管理-查看
  const CarportManagementView = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/CarportManagementViewModels.js'),
    ],
    component: () => import('./routes/parkingManagement/CarportManagementView.js'),
  });
  //停车管理-车位管理-车辆登记
  const CarportManagementRegister = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/CarportManagementRegisterModels.js'),
    ],
    component: () => import('./routes/parkingManagement/CarportManagementRegister.js'),
  });

  //停车管理-车主管理
  const CarOwnerManagement = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/CarOwnerManagementModels.js'),
    ],
    component: () => import('./routes/parkingManagement/CarOwnerManagement.js'),
  });

  //停车管理-车主管理-新增编辑车主
  const AddCarOwner = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/AddCarOwnerModels.js'),
    ],
    component: () => import('./routes/parkingManagement/AddCarOwner.js'),
  });

  //停车场概况
  const ParkingInformation = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/ParkingInformationModels.js'),
    ],
    component: () => import('./routes/parkingManagement/ParkingInformation.js'),
  });
  /** 停车管理-车场管理 */
  const ParkingLotManagement = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/ParkingLotManagementModel.js'),
    ],
    component: () => import('./routes/parkingManagement/ParkingLotManagement.js'),
  });
  /** 停车管理-车场管理-新增/编辑 */
  const ParkingLotManagementAddEdit = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/ParkingLotManagementAddEditModel.js'),
    ],
    component: () => import('./routes/parkingManagement/ParkingLotManagementAddEdit.js'),
  });

  //       --------------------  租房管理 ----------------------
  // 租房房源管理
  const HouseSourceManagement = dynamic({
    app,
    models: () => [
      import('./models/rentalHouseManagement/HouseSourceManagementModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/rentalHouseManagement/HouseSourceManagement.js')
  });
  // 租房房源管理 -- 详情页
  const HouseSourceDetails = dynamic({
    app,
    models: () => [
      import('./models/rentalHouseManagement/HouseSourceDetailsModel.js'),
    ],
    component: () => import('./routes/rentalHouseManagement/HouseSourceDetails.js')
  });
  // 租房房源管理 -- 发布/编辑房源
  const AddRentalHouse = dynamic({
    app,
    models: () => [
      import('./models/rentalHouseManagement/AddRentalHouseModel.js'),
    ],
    component: () => import('./routes/rentalHouseManagement/AddRentalHouse.js')
  });

  // 租房房源管理 -- 预约看房管理
  const OrderRoomManagement = dynamic({
    app,
    models: () => [
      import('./models/rentalHouseManagement/OrderRoomManagementModel.js'),
    ],
    component: () => import('./routes/rentalHouseManagement/OrderRoomManagement.js')
  });

  // 租房房源管理 -- 租房收益
  const RentalIncome = dynamic({
    app,
    models: () => [
      import('./models/rentalHouseManagement/RentalIncomeModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/rentalHouseManagement/RentalIncome.js')
  });

  // 租房房源管理 -- 预约看房详情
  const ViewOrderRoom = dynamic({
    app,
    models: () => [
      import('./models/rentalHouseManagement/ViewOrderRoomModel.js'),
    ],
    component: () => import('./routes/rentalHouseManagement/ViewOrderRoom.js')
  });
  // 租房房源管理 -- 预约看房签约
  const SignRentalHouse = dynamic({
    app,
    models: () => [
      import('./models/rentalHouseManagement/SignRentalHouseModel.js'),
    ],
    component: () => import('./routes/rentalHouseManagement/SignRentalHouse.js')
  });

  //巡更管理>巡更记录
  const PatrolRecord = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolRecord/PatrolRecordModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolRecord/PatrolRecord.js'),
  });
  //巡更管理/巡更记录/详情
  const PatrolRecordView = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolRecord/PatrolRecordViewModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolRecord/PatrolRecordView.js'),
  });
  //巡更管理/巡更点管理
  const PatrolPoints = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolPoints/PatrolPointsModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolPoints/PatrolPoints.js'),
  });
  //巡更管理/巡更点管理/新增编辑
  const PatrolPointsAddEdit = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolPoints/PatrolPointsAddEditModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolPoints/PatrolPointsAddEdit.js'),
  });
  //巡更管理/巡更线路管理
  const PatrolLine = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolLine/PatrolLineModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolLine/PatrolLine.js'),
  });
  //巡更管理/巡更线路管理/新增编辑
  const PatrolLineAddEdit = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolLine/PatrolLineAddEditModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolLine/PatrolLineAddEdit.js'),
  });
  //巡更管理/巡更计划管理
  const PatrolPlan = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolPlan/PatrolPlanModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolPlan/PatrolPlan.js'),
  });
  //巡更管理/巡更计划管理/新增
  const PatrolPlanAdd = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolPlan/PatrolPlanAddModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolPlan/PatrolPlanAdd.js'),
  });
  //巡更管理/巡更计划管理/编辑
  const PatrolPlanEdit = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolPlan/PatrolPlanEditModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolPlan/PatrolPlanEdit.js'),
  });
  //巡更管理/巡更计划管理/查看
  const PatrolPlanView = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolPlan/PatrolPlanViewModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolPlan/PatrolPlanView.js'),
  });
  //巡更管理/数据报表
  const PatrolData = dynamic({
    app,
    models: () => [
      import('./models/patrolManagement/patrolData/PatrolDataModels.js'),
    ],
    component: () => import('./routes/patrolManagement/patrolData/PatrolData.js'),
  });
  //系统设置>我的小区
  const MyCommunity = dynamic({
    app,
    models: () => [
      import('./models/systemSettings/myCommunity/MyCommunityModels.js'),
    ],
    component: () => import('./routes/systemSettings/myCommunity/MyCommunity.js'),
  });
  //系统设置>部门管理
  const GroupManagement = dynamic({
    app,
    models: () => [
      import('./models/systemSettings/groupManagement/GroupManagementModels.js'),
    ],
    component: () => import('./routes/systemSettings/groupManagement/GroupManagement.js'),
  });
  //系统设置>部门管理>新增编辑
  const GroupManagementAddEdit = dynamic({
    app,
    models: () => [
      import('./models/systemSettings/groupManagement/GroupManagementAddEditModels.js'),
    ],
    component: () => import('./routes/systemSettings/groupManagement/GroupManagementAddEdit.js'),
  });
  //系统设置>员工管理
  const UserManagement = dynamic({
    app,
    models: () => [
      import('./models/systemSettings/userManagement/UserManagementModels.js'),
    ],
    component: () => import('./routes/systemSettings/userManagement/UserManagement.js'),
  });
  //系统设置>员工管理>新增编辑
  const UserManagementAddEdit = dynamic({
    app,
    models: () => [
      import('./models/systemSettings/userManagement/UserManagementAddEditModels.js'),
    ],
    component: () => import('./routes/systemSettings/userManagement/UserManagementAddEdit.js'),
  });
  //系统设置>日志管理
  const LogManagement = dynamic({
    app,
    models: () => [
      import('./models/systemSettings/logManagement/LogManagementModels.js'),
    ],
    component: () => import('./routes/systemSettings/logManagement/LogManagement.js'),
  });
  //系统管理>数据删除
  const DataDelete = dynamic({
    app,
    models: () => [
      import('./models/systemSettings/dataDelete/DataDeleteModels.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/systemSettings/dataDelete/DataDelete.js'),
  });
  //系统设置>收款密码设置
  const CollectsPassword = dynamic({
    app,
    models: () => [
      import('./models/systemSettings/collectsPassword/CollectsPasswordModels.js'),
    ],
    component: () => import('./routes/systemSettings/collectsPassword/CollectsPassword.js'),
  });

  //报修管理/报修管理
  // const Repair = dynamic({
  //   app,
  //   models: () => [
  //     import('./models/serviceManagement/RepairModel.js'),
  //     import('./models/Community'),
  //   ],
  //   component: () => import('./routes/serviceManagement/Repair.js'),
  // });
  const Repair = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/repair/RepairModels.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/repairManagement/repair/Repair.js'),
  });
  //报修管理/报修管理/新增
  const RepairAdd = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/repair/RepairAddModels.js'),
    ],
    component: () => import('./routes/repairManagement/repair/RepairAdd.js'),
  });
  //报修管理/报修管理/详情
  const RepairView = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/repair/RepairViewModels.js'),
    ],
    component: () => import('./routes/repairManagement/repair/RepairView.js'),
  });
  //报修管理/报修管理/改派&分配
  const RepairAllocation = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/repair/RepairAllocationModel.js'),
    ],
    component: () => import('./routes/repairManagement/repair/RepairAllocation.js'),
  });
  //报修管理/报修管理/标记完成
  const RepairSign = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/repair/RepairSignModel.js'),
    ],
    component: () => import('./routes/repairManagement/repair/RepairSign.js'),
  });
  //报修管理/报修管理/添加记录
  const RepairAppend = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/repair/RepairAppendModel.js'),
    ],
    component: () => import('./routes/repairManagement/repair/RepairAppend.js'),
  });
  //报修管理/报修管理/添加记录
  const Hard = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/hard/HardModels.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/repairManagement/hard/Hard.js'),
  });
  //报修管理>耗材管理
  const Consumables = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/consumables/ConsumablesModels.js'),
    ],
    component: () => import('./routes/repairManagement/consumables/Consumables.js'),
  });
  //报修管理/报修类别
  const RepairType = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/repairType/RepairTypeModels.js'),
    ],
    component: () => import('./routes/repairManagement/repairType/RepairType.js'),
  });
  //报修管理/报修统计
  const RepairCount = dynamic({
    app,
    models: () => [
      import('./models/repairManagement/repairCount/RepairCountModels.js'),
    ],
    component: () => import('./routes/repairManagement/repairCount/RepairCount.js'),
  });
  //问题
  const Question = dynamic({
    app,
    models: () => [
      import('./models/question/QuestionModels.js'),
    ],
    component: () => import('./routes/question/Question.js'),
  });
  // 业委会管理 --- 业委会管理页面
  const KarmaManagement = dynamic({
    app,
    models: () => [
      import('./models/karmaManagement/KarmaManagementModel.js'),
    ],
    component: () => import('./routes/karmaManagement/KarmaManagement.js'),
  });
  // 业委会管理 --- 新增/编辑业委会管理页面
  const KarmaAdd = dynamic({
    app,
    models: () => [
      import('./models/karmaManagement/KarmaAddModel.js'),
    ],
    component: () => import('./routes/karmaManagement/KarmaAdd.js'),
  });
  // 业委会管理 --- 新增/编辑业委会成员
  const KarmaUserAdd = dynamic({
    app,
    models: () => [
      import('./models/karmaManagement/KarmaUserAddModel.js'),
    ],
    component: () => import('./routes/karmaManagement/KarmaUserAdd.js'),
  });
  // 业委会管理 --- 业委会成员管理
  const KarmaUserManagement = dynamic({
    app,
    models: () => [
      import('./models/karmaManagement/KarmaUserManagementModel.js'),
    ],
    component: () => import('./routes/karmaManagement/KarmaUserManagement.js'),
  });
  // 政务通知 --- 政务通知页面
  const GovernmentNotice = dynamic({
    app,
    models: () => [
      import('./models/governmentNotice/GovernmentNoticeModel.js'),
    ],
    component: () => import('./routes/governmentNotice/GovernmentNotice.js'),
  });
  // 政务通知 --- 政务通知详情页
  const GovernmentNoticeView = dynamic({
    app,
    models: () => [
      import('./models/governmentNotice/GovernmentNoticeViewModel.js'),
    ],
    component: () => import('./routes/governmentNotice/GovernmentNoticeView.js'),
  });
  // 计费管理 --- 计费项目管理
  const ChangingItemManagement = dynamic({
    app,
    models: () => [
      import('./models/changingItemManagement/ChangingItemManagementModel.js'),
    ],
    component: () => import('./routes/changingItemManagement/ChangingItemManagement.js'),
  });
  // 计费管理 --- 新增/编辑计费项目管理
  const ChangingItemAdd = dynamic({
    app,
    models: () => [
      import('./models/changingItemManagement/ChangingItemAddModel.js'),
    ],
    component: () => import('./routes/changingItemManagement/ChangingItemAdd.js'),
  });
  // 计费管理 --- 计费公式管理
  const FormulaManagement = dynamic({
    app,
    models: () => [
      import('./models/changingItemManagement/FormulaManagementModel.js'),
    ],
    component: () => import('./routes/changingItemManagement/FormulaManagement.js'),
  });
  
  // 投票管理
  const Vote = dynamic({
    app,
    models: () => [
      import('./models/vote/VoteModel.js'),
    ],
    component: () => import('./routes/vote/Vote.js'),
  });
  // 投票管理---新增投票
  const AddVote = dynamic({
    app,
    models: () => [
      import('./models/vote/AddVoteModel.js'),
      import('./models/vote/ComponentModel.js'),
    ],
    component: () => import('./routes/vote/AddVote.js'),
  });
  // 投票管理---详情页
  const ViewVote = dynamic({
    app,
    models: () => [
      import('./models/vote/ViewVoteModel.js'),
    ],
    component: () => import('./routes/vote/ViewVote.js'),
  });
  // 投票管理---投票结果详情页
  const VoteInfo = dynamic({
    app,
    models: () => [
      import('./models/vote/VoteInfoModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/vote/VoteInfo.js'),
  });
  // 投票管理---查看公示结果
  const ShowResultView = dynamic({
    app,
    models: () => [
      import('./models/vote/ShowResultViewModel.js'),
    ],
    component: () => import('./routes/vote/ShowResultView.js'),
  });
  // 投票管理---新增公示结果
  const AddShowResult = dynamic({
    app,
    models: () => [
      import('./models/vote/AddShowResultModel.js'),
    ],
    component: () => import('./routes/vote/AddShowResult.js'),
  });
  // 投票管理---线下数据录入
  const DoVote = dynamic({
    app,
    models: () => [
      import('./models/vote/DoVoteModel.js'),
    ],
    component: () => import('./routes/vote/DoVote.js'),
  });
  // 投票管理---编辑公示结果
  const EditShowResult = dynamic({
    app,
    models: () => [
      import('./models/vote/EditShowResultModel.js'),
    ],
    component: () => import('./routes/vote/EditShowResult.js'),
  });
  // 收费管理---票据模版管理
  const Template = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/TemplateManagementModel.js'),
    ],
    component: () => import('./routes/chargingManagement/TemplateManagement.js'),
  });
  // 收费管理 --- 票据模版第一步新增
  const AddTemplateOne = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/AddTemplateOneModel.js'),
    ],
    component: () => import('./routes/chargingManagement/AddTemplateOne.js'),
  });
  // 收费管理 --- 票据模版第二步新增
  const AddTemplateTwo = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/AddTemplateTwoModel.js'),
    ],
    component: () => import('./routes/chargingManagement/AddTemplateTwo.js'),
  });
  // 收费管理---账单管理列表
  const BillManagement = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/BillManagementModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/chargingManagement/BillManagement.js'),
  });
  // 收费管理---新增账单
  const BillsAdd = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/BillsAddModel.js'),
    ],
    component: () => import('./routes/chargingManagement/BillsAdd.js'),
  });
  // 收费管理---生成账单
  const GenerateBill = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/GenerateBillModel.js'),
    ],
    component: () => import('./routes/chargingManagement/GenerateBill.js'),
  });
  // 收费管理---账单管理-账单类型列表
  const BillsType = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/BillsTypeModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/chargingManagement/BillsType.js'),
  });
  // 收费管理---催款单打印
  const ReminderPrint = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/ReminderPrintModel.js'),
      import('./models/Community')
    ],
    component: () => import('./routes/chargingManagement/ReminderPrint.js'),
  });
  // 收费管理---收款收据打印
  const ReceiptPrint = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/ReceiptPrintModel.js'),
    ],
    component: () => import('./routes/chargingManagement/ReceiptPrint.js'),
  });
  // 收费管理--- 收费明细管理
  const ChargingDetailManagement = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/ChargingDetailManagementModel.js'),
      import('./models/Community')
    ],
    component: () => import('./routes/chargingManagement/ChargingDetailManagement.js'),
  });
  // 收费管理--- 账单管理详情页
  const BillsView = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/BillsViewModel.js')
    ],
    component: () => import('./routes/chargingManagement/BillsView.js'),
  });
  // 收费管理--- 账单管理--- 线下收款
  const Collections = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/CollectionsModel.js'),
      import('./models/Community')
    ],
    component: () => import('./routes/chargingManagement/Collections.js'),
  });
  //收费管理--- 公摊账期管理
  const PublicAccountManagement = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/PublicAccountManagementModel.js'),
    ],
    component: () => import('./routes/chargingManagement/PublicAccountManagement.js'),
  });
  //收费管理--- 公摊账期管理---查看数据
  const PublicAccountManagementViewData = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/PublicAccountManagementViewDataModel.js'),
    ],
    component: () => import('./routes/chargingManagement/PublicAccountManagementViewData.js'),
  });
  //收费管理--- 公摊账期管理---新增抄水表
  const AddWaterMeter = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/AddWaterMeterModel.js'),
    ],
    component: () => import('./routes/chargingManagement/AddWaterMeter.js'),
  });
  //收费管理--- 公摊账期管理---账单
  const PublicAccountManagementView = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/PublicAccountManagementViewModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/chargingManagement/PublicAccountManagementView.js'),
  });
  //收费管理--- 收银台
  const CashierDesk = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/CashierDeskModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/chargingManagement/CashierDesk.js'),
  });
  //收费管理--- 收银台 --- 收款记录
  const GatheringRecord = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/GatheringRecordModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/chargingManagement/GatheringRecord.js'),
  });
  //收费管理--- 收款复核
  const GatheringCheck = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/GatheringCheckModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/chargingManagement/GatheringCheck.js'),
  });
  //收费管理--- 公摊账期管理---账单
  const Verification = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/VerificationModel.js'),
    ],
    component: () => import('./routes/chargingManagement/Verification.js'),
  });
  //设备管理-设备分类
  const DeviceClassify = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/deviceClassify/DeviceClassifyModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/deviceClassify/DeviceClassify.js'),
  });
  //设备管理-设备分类-新增/编辑
  const DeviceClassifyAddEdit = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/deviceClassify/DeviceClassifyAddEditModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/deviceClassify/DeviceClassifyAddEdit.js'),
  });
  //设备管理-设备台账
  const DeviceAccount = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/deviceAccount/DeviceAccountModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/deviceAccount/DeviceAccount.js'),
  });
  //设备管理-设备台账-新增/编辑
  const DeviceAccountAddEdit = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/deviceAccount/DeviceAccountAddEditModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/deviceAccount/DeviceAccountAddEdit.js'),
  });
  //设备管理-设备台账-查看
  const DeviceAccountShow = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/deviceAccount/DeviceAccountShowModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/deviceAccount/DeviceAccountShow.js'),
  });
  //设备管理-设备保养登记
  const DeviceRegister = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/deviceRegister/DeviceRegisterModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/deviceRegister/DeviceRegister.js'),
  });
  //设备管理-设备保养登记-新增/编辑
  const DeviceRegisterAddEdit = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/deviceRegister/DeviceRegisterAddEditModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/deviceRegister/DeviceRegisterAddEdit.js'),
  });
  //设备管理-设备保养登记-查看
  const DeviceRegisterShow = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/deviceRegister/DeviceRegisterShowModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/deviceRegister/DeviceRegisterShow.js'),
  });

  // 设备管理-重大事故记录
  const AccidentRecord = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/accidentRecord/AccidentRecordModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/accidentRecord/AccidentRecord.js'),
  });
  // 设备管理-重大事故记录-新增
  const AccidentRecordAdd = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/accidentRecord/AccidentRecordAddModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/accidentRecord/AccidentRecordAdd.js'),
  });
  // 设备管理-重大事故记录-详情
  const AccidentRecordView = dynamic({
    app,
    models: () => [
      import('./models/equipmentManagement/accidentRecord/AccidentRecordViewModel.js'),
    ],
    component: () => import('./routes/equipmentManagement/accidentRecord/AccidentRecordView.js'),
  });

  // 设备巡检 --- 巡检点管理
  const InspectPointManagement = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectPointManagementModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectPointManagement.js'),
  });

  const InspectPointAdd = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectPointAddModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectPointAdd.js'),
  });

  const InspectLineManagement = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectLineManagementModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectLineManagement.js'),
  });

  const InspectLineAdd = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectLineAddModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectLineAdd.js'),
  });

  const InspectPlanManagement = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectPlanManagementModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectPlanManagement.js'),
  });

  const InspectPlanAdd = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectPlanAddModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectPlanAdd.js'),
  });
  const InspectPlanManagementView = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectPlanManagementViewModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectPlanManagementView.js'),
  });

  const OutlierData = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/OutlierDataModel.js'),
    ],
    component: () => import('./routes/deviceInspect/OutlierData.js'),
  });

  const OutlierDataView = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/OutlierDataViewModel.js'),
    ],
    component: () => import('./routes/deviceInspect/OutlierDataView.js'),
  });

  const InspectRecord = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectRecordModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectRecord.js'),
  });

  const InspectRecordView = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectRecordViewModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectRecordView.js'),
  });
  const InspectReport = dynamic({
    app,
    models: () => [
      import('./models/deviceInspect/InspectReportModel.js'),
    ],
    component: () => import('./routes/deviceInspect/InspectReport.js'),
  });

  //数据大盘---数据大盘
  const Dashboard = dynamic({
    app,
    models: () => [
      import('./models/dashboard/DashboardModel.js'),
    ],
    component: () => import('./routes/dashboard/Dashboard.js'),
  });

  //数据大盘---小区概况
  const CommunityData = dynamic({
    app,
    models: () => [
      import('./models/dashboard/CommunityDataModel.js'),
    ],
    component: () => import('./routes/dashboard/CommunityData.js'),
  });

  //数据大盘---人行数据概况
  const PersonData = dynamic({
    app,
    models: () => [
      import('./models/dashboard/PersonDataModel.js'),
    ],
    component: () => import('./routes/dashboard/PersonData.js'),
  });

  //数据大盘---车行数据概况
  const CarData = dynamic({
    app,
    models: () => [
      import('./models/dashboard/CarDataModel.js'),
    ],
    component: () => import('./routes/dashboard/CarData.js'),
  });
  // 智能门禁-智能门禁管理
  const DoorManagement = dynamic({
    app,
    models: () => [
      import('./models/entranceGuard/DoorManagementModel.js'),
    ],
    component: () => import('./routes/entranceGuard/DoorManagement.js'),
  });

  // 智能门禁-智能门禁新增
  const DoorAdd = dynamic({
    app,
    models: () => [
      import('./models/entranceGuard/DoorAddModel.js'),
    ],
    component: () => import('./routes/entranceGuard/DoorAdd.js'),
  });

  // 停车管理-车辆新增

  const CarOwnerAdd = dynamic({
    app,
    models: () => [
      import('./models/parkingManagement/CarOwnerAddModels.js'),
    ],
    component: () => import('./routes/parkingManagement/CarOwnerAdd.js'),
  });

  // 智能门禁-门禁管理列表
  const DoorCardManagement = dynamic({
    app,
    models: () => [
      import('./models/entranceGuard/DoorCardManagementModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/entranceGuard/DoorCardManagement.js'),
  });

  // 智能门禁-访客留影
  const VisitorAlbum = dynamic({
    app,
    models: () => [
      import('./models/entranceGuard/VisitorAlbumModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/entranceGuard/VisitorAlbum.js'),
  });

  // 智能门禁-开门记录
  const OpenRecord = dynamic({
    app,
    models: () => [
      import('./models/entranceGuard/OpenRecordModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/entranceGuard/OpenRecord.js'),
  });

  // 智能门禁-门卡管理-普通卡授权
  const DoorCardAddNormal = dynamic({
    app,
    models: () => [
      import('./models/entranceGuard/DoorCardAddNormalModel.js'),
    ],
    component: () => import('./routes/entranceGuard/DoorCardAddNormal.js'),
  });

  // 智能门禁-门卡管理-管理卡授权
  const DoorCardAddManage = dynamic({
    app,
    models: () => [
      import('./models/entranceGuard/DoorCardAddManageModel.js'),
    ],
    component: () => import('./routes/entranceGuard/DoorCardAddManage.js'),
  });
  /*--------------- 报表查询 ------------------------*/
  const ChargesCollectableDetailed = dynamic({
    app,
    models: () => [
      import('./models/statisticalReport/chargesCollectableDetailed/ChargesCollectableDetailedModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/statisticalReport/chargesCollectableDetailed/ChargesCollectableDetailed.js'),
  });
  const ChargeMonthlyStatement = dynamic({
    app,
    models: () => [
      import('./models/statisticalReport/chargeMonthlyStatement/ChargeMonthlyStatementModel.js'),
    ],
    component: () => import('./routes/statisticalReport/chargeMonthlyStatement/ChargeMonthlyStatement.js'),
  });
  const ChargeYearly = dynamic({
    app,
    models: () => [
      import('./models/statisticalReport/chargeYearly/ChargeYearlyModel.js'),
    ],
    component: () => import('./routes/statisticalReport/chargeYearly/ChargeYearly.js'),
  });
  const CollectionChannelsStatistics = dynamic({
    app,
    models: () => [
      import('./models/statisticalReport/collectionChannelsStatistics/CollectionChannelsStatisticsModel.js'),
    ],
    component: () => import('./routes/statisticalReport/collectionChannelsStatistics/CollectionChannelsStatistics.js'),
  });
  /*---------------------------------------抄表管理 -------------------------*/
  const DashboardManage = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/DashboardManageModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/communityManagement/DashboardManage.js'),
  });
  const DashboardMeterManageAdd = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/DashboardMeterManageAddModel'),
    ],
    component: () => import('./routes/communityManagement/DashboardMeterManageAdd.js'),
  });
  const DashboardElectrictyManageAdd = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/DashboardElectrictyManageAddModel'),
    ],
    component: () => import('./routes/communityManagement/DashboardElectrictyManageAdd.js'),
  });
  const DashboardProjectManageAdd = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/DashboardProjectManageAddModel'),
    ],
    component: () => import('./routes/communityManagement/DashboardProjectManageAdd.js'),
  });
  const ReadingManagement = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/ReadingManagementModel'),
    ],
    component: () => import('./routes/chargingManagement/ReadingManagement.js'),
  });
  const LoggingData = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/LoggingDataModel'),
    ],
    component: () => import('./routes/chargingManagement/LoggingData.js'),
  });
  const AddMeterReading = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/AddMeterReadingModel'),
    ],
    component: () => import('./routes/chargingManagement/AddMeterReading.js'),
  });
  const LoggingView = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/LoggingViewModel'),
    ],
    component: () => import('./routes/chargingManagement/LoggingView.js'),
  });
  const MeterReadingSystem = dynamic({
    app,
    models: () => [
      import('./models/chargingManagement/MeterReadingSystemModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/chargingManagement/MeterReadingSystem.js'),
  });

  /*---------------------------------------  楼宇管理 -------------------------*/
  const BuildingManagement = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/BuildingManagementModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/communityManagement/BuildingManagement.js'),
  });
  /*------ 新增编辑楼宇 -------*/
  const AddEditBuilding = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/AddEditBuildingModel'),
    ],
    component: () => import('./routes/communityManagement/AddEditBuilding.js'),
  });
  /*------ 批量新增编辑楼宇 -------*/
  const BatchAddEditBuildingOne = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/BatchAddEditBuildingOneModel'),
    ],
    component: () => import('./routes/communityManagement/BatchAddEditBuildingOne.js'),
  });
  const BatchAddEditBuildingTwo = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/BatchAddEditBuildingTwoModel'),
    ],
    component: () => import('./routes/communityManagement/BatchAddEditBuildingTwo.js'),
  });
  /*---------------------------------------  区域管理 -------------------------*/
  const AreaManagement = dynamic({
    app,
    models: () => [
      import('./models/communityManagement/AreaManagementModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/communityManagement/AreaManagement.js'),
  });

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Container>
          <Route path="/indexPage" component={IndexPage} />
          <Route path="/companyManagement" component={CompanyManagement} />
          <Route path="/houseManagement" component={HouseManagement} />
          <Route path="/addHouse" component={AddHouse} />
          <Route path="/homePage" component={HomePage} />

          <Route path="/residentsManage" component={ResidentsManage} />
          <Route path="/residentsAdd" component={ResidentsAdd} />
          <Route path="/residentsViewOne" component={ResidentsViewOne} />
          <Route path="/residentsViewTwo" component={ResidentsViewTwo} />

          <Route path="/meterReadingManager" component={MeterReadingManager} />
          <Route path="/meterReadingAdd" component={MeterReadingAdd} />

          <Route path="/electricityManage" component={ElectricityManage} />
          <Route path="/electricityReadingAdd" component={ElectricityReadingAdd} />

          <Route path="/tags" component={Tags} />

          <Route path="/projectManagement" component={ProjectManagement} />
          <Route path="/projectManagementAdd" component={ProjectManagementAdd} />

          <Route path="/rightInfoChange" component={RightInfoChange} />
          <Route path="/changerView" component={ChangerView} />
          <Route path="/complaintManagement" component={ComplaintManagement} />
          <Route path="/complaintView" component={ComplaintView} />

          <Route path="/deviceManagement" component={DeviceManagement} />
          <Route path="/deviceLog" component={DeviceLog} />
          <Route path="/singleCommunity" component={SingleCommunity} />
          <Route path="/communityCompare" component={CommunityCompare} />

          <Route path="/communityGuide" component={CommunityGuide} />
          <Route path="/addGuide" component={AddGuide} />
          <Route path="/packageManagement" component={PackageManagement} />
          <Route path="/packageAdd" component={PackageAdd} />
          <Route path="/sunNotice" component={SunNotice} />
          <Route path="/addNotice" component={AddNotice} />
          <Route path="/showNotice" component={ShowNotice} />
          <Route path="/editNotice" component={EditNotice} />
          <Route path="/newsManager" component={NewsManager} />
          <Route path="/addNews" component={AddNews} />
          <Route path="/editNews" component={EditNews} />
          <Route path="/giveRecord" component={GiveRecord} />
          <Route path="/checkRecord" component={CheckRecord} />
          <Route path="/checkDetail" component={CheckDetail} />
          
          <Route path="/parkingInformation" component={ParkingInformation} />
          <Route path="/carEquipManagement" component={CarEquipManagement} />
          <Route path="/getInManagement" component={GetInManagement} />
          <Route path="/getOutManagement" component={GetOutManagement} />
          <Route path="/configFeeRule" component={ConfigFeeRule} />
          <Route path="/carportManagement" component={CarportManagement} />
          <Route path="/carportManagementAdd" component={CarportManagementAddEdit} />
          <Route path="/carportManagementEdit" component={CarportManagementAddEdit} />
          <Route path="/carportManagementView" component={CarportManagementView} />
          <Route path="/carportManagementRegister" component={CarportManagementRegister} />
          <Route path="/carOwnerManagement" component={CarOwnerManagement} />
          <Route path="/addCarOwner" component={AddCarOwner} />
          <Route path="/parkingLotManagement" component={ParkingLotManagement} />
          <Route path="/parkingLotManagementAdd" component={ParkingLotManagementAddEdit} />
          <Route path="/parkingLotManagementEdit" component={ParkingLotManagementAddEdit} />

          <Route path="/rentalHouseManagement" component={HouseSourceManagement} />
          <Route path="/houseSourceDetails" component={HouseSourceDetails} />
          <Route path="/addRentalHouse" component={AddRentalHouse} />
          <Route path="/orderRoomManagement" component={OrderRoomManagement} />
          <Route path="/viewOrderRoom" component={ViewOrderRoom} />
          <Route path="/rentalIncome" component={RentalIncome} />
          <Route path="/signRentalHouse" component={SignRentalHouse} />

          <Route path="/patrolRecord" component={PatrolRecord} />
          <Route path="/patrolRecordView" component={PatrolRecordView} />
          <Route path="/patrolPoints" component={PatrolPoints} />
          <Route path="/patrolPointsAdd" component={PatrolPointsAddEdit} />
          <Route path="/patrolPointsEdit" component={PatrolPointsAddEdit} />
          <Route path="/patrolLine" component={PatrolLine} />
          <Route path="/patrolLineAdd" component={PatrolLineAddEdit} />
          <Route path="/patrolLineEdit" component={PatrolLineAddEdit} />
          <Route path="/patrolPlan" component={PatrolPlan} />
          <Route path="/patrolPlanAdd" component={PatrolPlanAdd} />
          <Route path="/patrolPlanEdit" component={PatrolPlanEdit} />
          <Route path="/patrolPlanView" component={PatrolPlanView} />
          <Route path="/patrolData" component={PatrolData} />
          <Route path="/myCommunity" component={MyCommunity} />
          <Route path="/groupManagement" component={GroupManagement} />
          <Route path="/groupManagementAdd" component={GroupManagementAddEdit} />
          <Route path="/groupManagementEdit" component={GroupManagementAddEdit} />
          <Route path="/userManagement" component={UserManagement} />
          <Route path="/userManagementAdd" component={UserManagementAddEdit} />
          <Route path="/userManagementEdit" component={UserManagementAddEdit} />
          <Route path="/logManagement" component={LogManagement} />
          <Route path="/dataDelete" component={DataDelete} />
          <Route path="/collectsPassword" component={CollectsPassword} />

          <Route path="/hard" component={Hard} />
          <Route path="/consumables" component={Consumables} />
          <Route path="/repairType" component={RepairType} />
          <Route path="/repairCount" component={RepairCount} />
          <Route path="/question" component={Question} />

          <Route path="/karmaManagement" component={KarmaManagement} />
          <Route path="/karmaAdd" component={KarmaAdd} />
          <Route path="/karmaUserAdd" component={KarmaUserAdd} />
          <Route path="/karmaUserManagement" component={KarmaUserManagement} />

          <Route path="/governmentNotice" component={GovernmentNotice} />
          <Route path="/governmentNoticeView" component={GovernmentNoticeView} />

          <Route path="/changingItemManagement" component={ChangingItemManagement} />
          <Route path="/changingItemAdd" component={ChangingItemAdd} />
          <Route path="/formulaManagement" component={FormulaManagement} />

          <Route path="/vote" component={Vote} />
          <Route path="/addVote" component={AddVote} />
          <Route path="/viewVote" component={ViewVote} />
          <Route path="/voteInfo" component={VoteInfo} />
          <Route path="/showResultView" component={ShowResultView} />
          <Route path="/addShowResult" component={AddShowResult} />
          <Route path="/doVote" component={DoVote} />
          <Route path="/editShowResult" component={EditShowResult} />

          <Route path="/printTemplate" component={Template} />
          <Route path="/addTemplateOne" component={AddTemplateOne} />
          <Route path="/addTemplateTwo" component={AddTemplateTwo} />
          <Route path="/billManage" component={BillManagement} />
          <Route path="/billsAdd" component={BillsAdd} />
          <Route path="/generateBill" component={GenerateBill} />
          <Route path="/billsType" component={BillsType} />
          <Route path="/billManagement" component={PublicAccountManagement} />
          <Route path="/publicAccountManagementViewData" component={PublicAccountManagementViewData} />
          <Route path="/publicAccountManagementView" component={PublicAccountManagementView} />
          <Route path="/verification" component={Verification} />
          <Route path="/addWaterMeter" component={AddWaterMeter} />
          <Route path="/cashierDesk" component={CashierDesk} />
          <Route path="/gatheringCheck" component={GatheringCheck} />
          <Route path="/gatheringRecord" component={GatheringRecord} />

          <Route path="/printLetter" component={ReminderPrint} />
          <Route path="/printCharge" component={ReceiptPrint} />
          <Route path="/chargeDetailManagement" component={ChargingDetailManagement} />

          <Route path="/billsView" component={BillsView} />
          <Route path="/collections" component={Collections} />

          <Route path="/repair" component={Repair} />
          <Route path="/repairAdd" component={RepairAdd} />
          <Route path="/repairView" component={RepairView} />
          <Route path="/repairSign" component={RepairSign} />
          <Route path="/repairAppend" component={RepairAppend} />
          <Route path="/repairAllocation" component={RepairAllocation} />

          <Route path="/deviceClassify" component={DeviceClassify} />
          <Route path="/deviceClassifyAdd" component={DeviceClassifyAddEdit} />
          <Route path="/deviceClassifyEdit" component={DeviceClassifyAddEdit} />
          <Route path="/deviceAccount" component={DeviceAccount} />
          <Route path="/deviceAccountAdd" component={DeviceAccountAddEdit} />
          <Route path="/deviceAccountEdit" component={DeviceAccountAddEdit} />
          <Route path="/deviceAccountShow" component={DeviceAccountShow} />
          <Route path="/deviceRegister" component={DeviceRegister} />
          <Route path="/deviceRegisterAdd" component={DeviceRegisterAddEdit} />
          <Route path="/deviceRegisterEdit" component={DeviceRegisterAddEdit} />
          <Route path="/deviceRegisterShow" component={DeviceRegisterShow} />

          <Route path="/accidentRecord" component={AccidentRecord} />
          <Route path="/accidentRecordAdd" component={AccidentRecordAdd} />
          <Route path="/accidentRecordView" component={AccidentRecordView} />


          <Route path="/inspectPointManagement" component={InspectPointManagement} />
          <Route path="/inspectPointAdd" component={InspectPointAdd} />
          <Route path="/inspectLineManagement" component={InspectLineManagement} />
          <Route path="/inspectLineAdd" component={InspectLineAdd} />
          <Route path="/inspectPlanManagement" component={InspectPlanManagement} />
          <Route path="/inspectPlanAdd" component={InspectPlanAdd} />
          <Route path="/inspectPlanManagementView" component={InspectPlanManagementView} />

          <Route path="/outlierData" component={OutlierData} />
          <Route path="/outlierDataView" component={OutlierDataView} />
          <Route path="/inspectRecord" component={InspectRecord} />
          <Route path="/inspectRecordView" component={InspectRecordView} />
          <Route path="/inspectReport" component={InspectReport} />

          <Route path="/dashboard" component={Dashboard} />
          <Route path="/communityData" component={CommunityData} />
          <Route path="/personData" component={PersonData} />
          <Route path="/carData" component={CarData} />

          <Route path="/carOwnerAdd" component={CarOwnerAdd} />
          <Route path="/doorManagement" component={DoorManagement} />
          <Route path="/doorAdd" component={DoorAdd} />
          <Route path="/doorCardManagement" component={DoorCardManagement} />
          <Route path="/visitorAlbum" component={VisitorAlbum} />
          <Route path="/openRecord" component={OpenRecord} />
          <Route path="/doorCardAddNormal" component={DoorCardAddNormal} />
          <Route path="/doorCardAddManage" component={DoorCardAddManage} />

          <Route path="/chargesCollectableDetailed" component={ChargesCollectableDetailed} />
          <Route path="/chargeMonthlyStatement" component={ChargeMonthlyStatement} />
          <Route path="/chargeYearly" component={ChargeYearly} />
          <Route path="/collectionChannelsStatistics" component={CollectionChannelsStatistics} />

          <Route path="/dashboardManage" component={DashboardManage} />
          <Route path="/dashboardMeterManageAdd" component={DashboardMeterManageAdd} />
          <Route path="/dashboardElectrictyManageAdd" component={DashboardElectrictyManageAdd} />
          <Route path="/dashboardProjectManageAdd" component={DashboardProjectManageAdd} />
          <Route path="/readingManagement" component={ReadingManagement} />
          <Route path="/loggingData" component={LoggingData} />
          <Route path="/addMeterReading" component={AddMeterReading} />
          <Route path="/loggingView" component={LoggingView} />
          <Route path="/meterReadingSystem" component={MeterReadingSystem} />

          <Route path="/buildingManagement" component={BuildingManagement} />
          <Route path="/areaManagement" component={AreaManagement} />
          <Route path="/editBuilding" component={AddEditBuilding} />
          <Route path="/addBuilding" component={AddEditBuilding} />
          <Route path="/batchAddBuildingOne" component={BatchAddEditBuildingOne} />
          <Route path="/batchEditBuildingOne" component={BatchAddEditBuildingOne} />
          <Route path="/batchAddBuildingTwo" component={BatchAddEditBuildingTwo} />
          <Route path="/batchEditBuildingTwo" component={BatchAddEditBuildingTwo} />
          {/* <Route path="/hard" component={Hard} /> */}

        </Container>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
