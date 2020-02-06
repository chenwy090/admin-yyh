<template>
	<Modal
    v-model="isShow"
    :closable="true"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="900"
    title="优惠券列表"
    @on-cancel="closeDialog"
  >
  	<Alert type="warning">请点击选择优惠券类型，按搜索，选择需要的优惠券</Alert>
		<Form ref="searchForm" :model="searchForm" :label-width="100">
      <FormItem label="优惠券类型：" style="display:inline-block">
        <!-- <Input style="width:200px" v-model="couponSearchData.couponType" placeholder="请输入" clearable /> -->
        <!-- 优惠券类型1：周边券、2：商超券 -->
        <Select v-model="searchForm.couponType" style="width:200px"  @on-change="optionChange">
          <!-- <Option value="2">超市券</Option>
          <Option value="1">周边券</Option>-->

          <Option v-for="item in couponTypeList" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="优惠券名称：" style="display:inline-block">
        <Input style="width:200px" v-model="searchForm.name" placeholder="请输入" clearable />
      </FormItem>
      <FormItem class="br" :label-width="10"  style="display:inline-block">
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
        <!-- <Button icon="md-refresh" @click="reset1">重置</Button> -->
      </FormItem>
    </Form>
    <Card :bordered="false" style="margin-bottom:2px">
    	<Table
	      border
	      ref="selection"
	      :columns="tableColumns"
	      :data="tableData"
	      :highlight-row="true"
	      :loading="loading"
	    ></Table>
    	<Row type="flex" justify="end" class="page">
	        <!-- show-total 显示总数 共{{ total }}条 -->
	        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
	        <Page
	          show-total
	          show-elevator
	          :current="page.pageNum"
	          :page-size="page.pageSize"
	          :total="page.total"
	          @on-change="changeCurrent"
	        ></Page>
      	</Row>
    </Card>
		<div slot="footer">
			<Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      <Button type="primary" @click="handleSubmit">确认</Button>
      
    </div>
	</Modal>
</template>
<script>
	import { postRequest, getRequest } from "@/libs/axios";
	import { getCampaginListData } from "@/api/sys";
	export default{
		props: {
		    action: {
		      type: Object,
		      // 对象或数组默认值必须从一个工厂函数获取
		      default: () => ({ type: "add" })
		    }
		},
		watch: {
	    action: {
	      handler(val, oldVal) {
	        let { type, data } = this.action;
	        if(type == 'add'){
	        	this.isShow = true;
	        	this.choice = {
			        id: "",
			        name: "",
			      };
	        	this.search();
	        	// this.yhqDetail = false;
	        	// //this.daterange = [];
	        	// this.currentChoose = "";
	        	// this.yhqTitle = '增加优惠券';
	        	// this.url= "/browsing/templateCoupon/add";
	        }
	        
	      },
	      deep: true
	    }
		},
		computed: {
	    tableColumns() {
	      return this.searchForm.couponType == 2 ? this.columns1 : this.columns2;
	    },
	  },
		data(){
			return{
				isShow:false,
				searchForm: {
	        couponType: 1, //优惠券类型1：周边券、2：商超券
	        name: "",
	      },
	      loading:false,
	      //优惠券类型1：周边券、2：商超券/ 超市券 //优惠券类型 1：超市券 2：周边券
	      // couponType
	      couponTypeList: [{
          value: 1,
          label: "超市券",
        },{
          value: 2,
          label: "周边券",
        }],
        currentChoose:'',
        currentTableRow:{},
        tableData: [],
	      choice: {
	        id: "",
	        name: "",
	      },
				// 优惠券类型1：周边券、2：商超券  超市券
	      columns1: [
	        {
	          title: "选择",
	          key: "chooseTemplateId",
	          width: 70,
	          align: "center",
	          render: (h, params) => {
	            let id = params.row.templateId;
	            let name = params.row.title;
	            let flag = false;
	            if (this.choice.id == id) {
	              flag = true;
	            } else {
	              flag = false;
	            }
	            let self = this;
	            return h("div", [
	              h("Radio", {
	                props: {
	                  value: flag,
	                },
	                on: {
	                  "on-change": () => {
	                    self.choice.id = id;
	                    self.choice.name = name;
	                  },
	                },
	              }),
	            ]);
	          },
	        },
	        {
	          title: "优惠券ID",
	          align: "center",
	          minWidth: 140,
	          key: "templateId",
	        },
	        {
	          title: "优惠券名称",
	          align: "center",
	          minWidth: 140,
	          key: "title",
	        }
	      ],
	      // 超市券2
	      columns2: [
	        {
	          title: "选择",
	          key: "chooseCampId",
	          width: 70,
	          align: "center",
	          render: (h, params) => {
	            let id = params.row.campId;
	            let name = params.row.name;
	            let flag = false;
	            if (this.choice.id == id) {
	              flag = true;
	            } else {
	              flag = false;
	            }
	            let self = this;
	            return h("div", [
	              h("Radio", {
	                props: {
	                  value: flag,
	                },
	                on: {
	                  "on-change": () => {
	                    self.choice.id = id;
	                    self.choice.name = name;
	                  },
	                },
	              }),
	            ]);
	          },
	        },
	        {
	          title: "优惠券ID",
	          align: "center",
	          minWidth: 140,
	          key: "campId",
	        },
	        {
	          title: "优惠券名称",
	          align: "center",
	          minWidth: 140,
	          key: "name",
	        }
	      ],
		    page: {
		        pageNum: 1, //页码
		        pageSize: 10, //每页数量
		        total: 0 //数据总数
		    },
			}
		},
		methods:{
			closeDialog(){
				this.isShow = false;
			},
			handleSubmit(){
				
				if (this.choice.id) {
					this.isShow = false;
	        this.choice.couponType = this.searchForm.couponType;
	        this.$emit("addPaymentCouponId", this.choice);
	      } else {
	        this.msgErr("至少选一个商户");
	      }
			},
			optionChange() {
	      this.tableData = [];
	      this.searchForm.name = "";
	      this.page.pageNum = 1;
	      this.choice.couponType = this.searchForm.couponType;
	      this.search();
	    },
			search() {
				this.choice =  {
	        id: "",
	        name: "",
	      };
	      if (!this.searchForm.couponType) {
	        return this.msgErr("请选择优惠券类型");
	      }

	      let url = "";
	      let data = {};

	      // 优惠券类型2：周边券、1：商超券
	      switch (this.searchForm.couponType) {
	        case 2:
	          url = "/merchantCouponTemplate/backList";
	          data = {
	            //isActivityCoupon: null,
	            templateStatus: "进行中",
	            title: this.searchForm.name,
	            //requestFrom: "choujiangtuan",
	          };
	          break;
	        case 1:
	          url = "/campagin/list";
	          data = {
	            isEffective: 1,
	            campType: 57,
	            status: 1,
	            sendChannel: 1,
	            name: this.searchForm.name,
	          };
	          break;
	      }

	      this.loading = true;
	      getCampaginListData(url, data, this.page.pageNum).then(res => {
	        if (res.code == 200) {
	          this.tableData = res.data.records;
	          // this.banner_page_req.start = res.data.current; //分页查询起始记录
	          this.page.pageNum = res.data.current; //分页查询起始记录
	          this.page.total = res.data.total; //列表总数
	          this.page.pageSize = res.data.size; //每页数据
	        } else {
	          this.$Message.error(res.code + " 数据加载失败!", 3);
	        }
	        this.loading = false;
	      });
	    },
			changeCurrent(current) {
	      // var self = this;
	      // self.banner_page_req.start = current * self.banner_page_req.limit - self.banner_page_req.limit;
	      this.page.pageNum = current;
	      this.search();
	    },
	    msgOk(txt) {
	      this.$Message.info({
	        content: txt,
	        duration: 3,
	      });
	    },

	    msgErr(txt) {
	      this.$Message.error({
	        content: txt,
	        duration: 3,
	      });
	    },
		}
	}
</script>
