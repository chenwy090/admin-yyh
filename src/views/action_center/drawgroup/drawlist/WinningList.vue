<template>
  <div class="winningList">
    <!-- 查看 开奖结果 -->
    <Modal v-model="modalDetail" :closable="true" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>查看开奖结果</span>
      </p>
      <div class="table-box">
        <Table border :columns="columns" :data="tableData">
          <template slot-scope="{ row }" slot="logistics">
            <!-- `prize_type` tinyint(2) NOT NULL DEFAULT '0' COMMENT '奖品类型1:实物、2：优惠券、3：U贝', -->
            <!-- prizeType 1 实物需要编辑 3 普通 不需要编辑地址 -->
            <Button
              type="success"
              size="small"
              style="margin-right: 5px"
              :disabled="row.prizeType != 1? true:false"
              @click="showLogistics(row)"
            >编辑</Button>
          </template>
        </Table>
        <!-- 填写物流信息 -->
        <Modal v-model="modalLogistics" :closable="true" width="400">
          <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>填写物流信息</span>
          </p>
          <div>
            <Form
              label-position="left"
              ref="formLogistics"
              :model="logistics"
              :rules="ruleLogisticsValidate"
              :label-width="90"
            >
              <FormItem label="物流公司：" prop="logisticsName">
                <Input v-model="logistics.logisticsName" type="text" placeholder="物流公司"></Input>
              </FormItem>
              <FormItem label="物流单号：" prop="logisticsOrderNo">
                <Input v-model="logistics.logisticsOrderNo" type="text" placeholder="物流单号"></Input>
              </FormItem>
            </Form>
          </div>
          <div slot="footer">
            <Button type="error" size="large" @click="updateLogistics('formLogistics')">确认</Button>
            <Button @click="cancelUpdateLogistics('formLogistics')" style="margin-left: 8px">取消</Button>
          </div>
        </Modal>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  queryWinningList,
  updateLogistics //更新物流
} from "@/api/sys";
import { detailColumns } from "./columns";

export default {
  name: "winning-list",
  props: {
    modalWinningList: [Boolean, Number],
    id: [String, Number]
  },
  watch: {
    modalWinningList() {
      console.log(this.modalWinningList, this.id);
      this.modalDetail = true;
      this.queryResult(this.id);
    }
  },
  data() {
    return {
      modalDetail: false, // 查看
      modalLogistics: false, //物流
      logistics: {
        winningId: "",
        logisticsId: "",
        logisticsName: "",
        logisticsOrderNo: ""
      },
      ruleLogisticsValidate: {
        logisticsName: [
          {
            required: true,
            message: "物流公司不能为空",
            trigger: "blur"
          }
        ],
        logisticsOrderNo: [
          {
            required: true,
            message: "物流单号不能为空",
            trigger: "blur"
          }
        ]
      },
      loading: false, //列表加载动画
      columns: detailColumns,
      tableData: [] //查看中奖
    };
  },
  created() {},
  methods: {
    async queryResult(drawId) {
      this.modalDetail = true;
      const res = await queryWinningList({ drawId });
      if (res.code == 200) {
        // `is_awards` tinyint(2) NOT NULL DEFAULT '2' COMMENT '1: 大奖、2：普通奖',
        //  1: 大奖、2：普通奖
        let arr = res.data.map(item => {
          if (item.isAwards == 1) {
            item.prize = "大奖";
          } else {
            item.prize = "普通奖";
          }
          return item;
        });
        this.tableData = arr;
      } else {
        this.msgErr(res.msg);
      }
    },
    showLogistics(row) {
      this.modalLogistics = true;
      Object.keys(this.logistics).forEach(name => {
        this.logistics[name] = row[name];
      });
    },
    cancelUpdateLogistics(name) {
      this.modalLogistics = false;
      this.$nextTick(() => {
        this.$refs[name].resetFields();
      });
    },
    updateLogistics(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          updateLogistics(this.logistics).then(res => {
            if (res.code == 200) {
              this.msgOk("更新物流信息成功");
              //刷新列表
              this.queryResult(this.id);
            } else {
              this.msgErr(res.msg);
            }
            this.cancelUpdateLogistics(name);
          });
        }
      });
    },
    showTotalPlayer(id) {
      this.modalTotalPlayer = true;
      this.id = id;
      this.queryTotalPlayerTableList();
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    }
  }
};
</script>
<style scoped>
.underline {
  text-decoration: underline;
}
.table-box {
  min-height: 100px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.marginLeft20 {
  margin-left: 20px;
}
</style>