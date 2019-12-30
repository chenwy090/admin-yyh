// 商户预充值列表 商户类型 、 商户名称、 预充值余额（元）、 剩余U贝、 创建时间
export default [{
    title: "操作",
    align: "center",
    width: 200,
    fixed: "left",
    slot: "action"
},
// {
//     title: "序号",
//     type: 'index',
//     width: 80,
//     align: 'center'
// },
{
    title: "任务ID",
    key: "id",
    align: "center",
    width: 120
},
{
    title: "任务名称",
    key: "name",
    align: "center",
    width: 120
},
{
    title: "预计消耗U贝",
    key: "anticipatedUbay",
    align: "center",
    width: 120
},

{
    title: "有效期",
    key: "startTimeAndEndTime",
    align: "center",
    minWidth: 170,
},
{
    title: "审核",
    key: "statusName",
    align: "center",
    minWidth: 140,
},
{
    title: "状态",
    key: "isStopName",
    align: "center",
    minWidth: 140,
},
{
    title: "创建时间",
    key: "gmtCreate",
    align: "center",
    minWidth: 150
},
{
    title: "操作人",
    key: "createBy",
    align: "center",
    minWidth: 140
},
]
// 资金明细列表
export const udataColumns = [
// {
//     title: "序号",
//     type: 'index',
//     width: 60,
//     align: 'center'
// },
{
    title: "用户ID",
    key: "userId",
    align: "center",
    width: 120
},
{
    title: "用户昵称",
    key: "userNickName",
    align: "center",
    width: 120
},
{
    title: "手机",
    key: "telphone",
    align: "center",
    width: 120
},

{
    title: "优惠券名称",
    key: "couponTitle",
    align: "center",
    minWidth: 100
},
// merchantType
{
    title: "商户类型",
    key: "merchantTypeName",
    align: "center",
    minWidth: 140
},
{
    title: "名称",
    key: "merchantNameText",
    align: "center",
    minWidth: 140
},
// awardType
{
    title: "奖励类型",
    key: "awardTypeName",
    align: "center",
    minWidth: 140
}, {
    title: "获得U贝",
    key: "awardUbay",
    align: "center",
    minWidth: 140
}, {
    title: "创建时间",
    key: "gmtCreate",
    align: "center",
    minWidth: 140
},
]