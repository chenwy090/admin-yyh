<template>
  <div>
    <div v-if="loading">
       <i-col class="demo-spin-col" span="8">
                <Spin fix>正在检测冲突券，请稍等...</Spin>
       </i-col>
    </div>
      
    <ul >
      <li  style="list-style:none;margin-top:10px;font-size:1.2em"
       v-for="(item,index) in listData"
              :key="index"
              :value="item">
       <label for="index">backCode:</label><span>{{index}}</span> 
       <p><label for="index">冲突券</label><span>（相同渠道位置、相同时间、相同门店）：</span>  </p>        
     <Table 
      border
      :columns="tableColumns"
      sortable="custom"
      ref="table"
      :data="item"
      :highlight-row="true"
      @on-current-change="selectedTr"
     >
       </Table>
      </li>
    </ul>
    <Modal
                v-model="showOrder"
                title="调整排序"
                width="1000"
                footer-hide
                :closable="true"
                :mask-closable="false"
        >
       <div label="排序数值：" :label-width="120">
        <Input style="width:60%"  placeholder="请输入数字" v-model="orderBy" clearable/>
         <ButtonGroup>
          <Button type="primary" class="submit" @click="checkOrder">确定</Button>
        </ButtonGroup>
       </div>
      </Modal>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/libs/axios";
export default {
  data() {
    return {
      recommendId:null,
      loading:true,
      orderBy:null,
      showOrder:false,
      TableLoading: false,
      totalSize: 0,
      pageNum: 1,
      pageSize: 10,
      listData: [],
      tableColumns: [
         {
          title: "序号",
          type: "index",
        },
        {
          title: "券名称",
          //width: 150,
          key: "campName"
        },
         {
          title: "投放位置",
          key: "distributeLocation",
          render: (h, params) => {
                            let location = params.row.distributeLocation;
                        
                            return h('span',location + "号位");
                        }
        },
        {
          title: "投放渠道",
          key: "distributeChannel",
          //width: 150,
          render: (h, params) => {
                            let channel = params.row.distributeChannel + "";
                            let channelTxt = '';
                            switch(channel){
                              case "1": 
                                  channelTxt = "要优惠详情页";
                                  break;
                              case "2": 
                                  channelTxt = "要优惠领券成功页";
                                  break;
                              case "3": 
                                  channelTxt = "团员拼团成功页";
                                  break;
                              case "4": 
                                  channelTxt = "团员拼团失败页";
                                  break;
                              case "5": 
                                  channelTxt = "团长拼团成功页";
                                  break;
                              case "6": 
                                  channelTxt = "团长拼团失败页";
                                  break;
                               case "7": 
                                  channelTxt = "领优惠领券成功页";
                                  break;
                            }
                            return h('span',channelTxt);
                        }
        },
        {
          title: "投放时间",
          //width: 200,
          key: "distributeStartDate",
          render: (h, params) => {
                            let row = params.row;
                            return h('span',row.distributeStartDate+' -- '+row.distributeEndDate);
                        }
        },
        {
          title: "投放门店",
          key: "shops",
          ellipsis:true,
          //width: 300,
        },
        {
          title: "优惠力度",
          key: "promotion",
          //width: 100,
        },
        {
          title: "排序",
          key: "orderBy",
        },
         {
          title: "操作",
           render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.orderItem(params.row);
                    }
                  }
                },
                "排序"
              )
            ]);
          }
        }
      ],
    };
  },
  methods: {
     loadData: function() {
      postRequest(
        "/couponrecommend/conflict/listConflict?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize).then(res => {
        this.TableLoading = false;
        if (res.code == 200) {
          this.listData = res.data;
          this.$Message.success("数据加载完成！")
        } else {
          this.msgErr(res.msg); 
        }
        this.loading = false;
        
      });
    },
    selectedTr: function(currentRow, oldCurrentRow) {
      this.$emit("seclectedTr-event", currentRow.campId, currentRow.name);
    },
    changeCurrent: function(current) {
      if (this.searchForm.pageNum != current) {
        this.searchForm.pageNum = current;
        this.loadData();
      }
    },
    orderItem: function(data){
      this.showOrder = true;
      console.log(data);
      this.recommendId = data.recommendId;
      //this.orderBy = data.orderBy;
    },
    checkOrder:function(){
      var param = {};
      param.recommendId = this.recommendId;
      param.orderBy = this.orderBy;
      param.id = this.recommendId;
      var r = /^\+?[1-9][0-9]*$/;　　//正整
      if(!r.test(this.orderBy)){
          this.$Message.error("请输入正整数")
          return
      }
      postRequest(
        "/couponrecommend/updateOrderBy",param).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.msg)
          this.orderBy = '';
          this.loadData();
        } else {
          this.msgErr(res.msg); 
        }
      });
    },
  },
  mounted: function() {
      this.TableLoading = true;
      this.pageNum = 1;
      this.loadData();
  }
};
</script>

