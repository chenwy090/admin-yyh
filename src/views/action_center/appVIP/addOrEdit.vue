<template>
  <Card>
    <!--  -->
    <Form :label-width="120">
      <FormItem label="投放方式：">
        <RadioGroup v-model="form.prizeType">
          <Radio :label="1" :disabled="addOrEdit == 3">优惠券</Radio>
          <Radio :label="2" :disabled="addOrEdit == 3" style="margin-left:20px">U贝</Radio>
        </RadioGroup>
      </FormItem>

      <storeForm
        :disabled="addOrEdit == 3"
        :pushRange.sync="form.pushRange"
        :shopRequestList.sync="form.shopRequestList"
      ></storeForm>

      <FormItem label="投放时间：">
        <DatePicker
          transfer
          type="daterange"
          placeholder="请选择投放时间"
          @on-change="[form.startTime, form.endTime] = $event"
          v-model="form.time"
          :disabled="addOrEdit == 3"
          style="width: 200px"
        >
        </DatePicker>
      </FormItem>

      <template v-if="form.prizeType == 1">
        <FormItem label="优惠券：">
          <Card class="couponsList">
            <!-- <Icon class="removeCouponsList" slot="extra" @click="removeCouponsList(index)" type="md-close" /> -->
            <!-- couponsList -->
            <div>
              <Button :disabled="addOrEdit == 3" @click="selectCoupon()">选择优惠券</Button>
              <span v-if="form.coupons.couponId">【{{ form.coupons.couponName }}】</span>
            </div>

            <div style="padding:5px 0;" v-if="couponList">
              <Table :columns="columns" :data="couponList"> </Table>
            </div>

            <div>
              优惠券详情副标题：
              <Input :disabled="addOrEdit == 3" v-model="form.coupons.subTitle" />
            </div>
            <div>
              优惠券详情大图：
              <template v-if="addOrEdit == 3">
                <img style="height: 120px;display: block;" :src="form.coupons.couponUrl" />
              </template>
              <template v-if="addOrEdit != 3">
                <uploadImg
                  :disabled="addOrEdit == 3"
                  :uploadImg="form.coupons.couponUrl"
                  @handleSuccess="url => (form.coupons.couponUrl = url)"
                ></uploadImg>
              </template>
            </div>
          </Card>
        </FormItem>
      </template>

      <template v-if="form.prizeType == 2">
        <FormItem label="每人获得U贝数量：">
          <Input
            :disabled="addOrEdit == 3"
            v-model="form.ubayInfo.amountEach"
            placeholder="请输入每人获得U贝数量"
            style="width:200px"
          >
            <span slot="append">U贝</span>
          </Input>
        </FormItem>

        <FormItem label="发放份数：">
          <InputNumber :disabled="addOrEdit == 3" v-model="form.ubayInfo.totalAmount"></InputNumber>
        </FormItem>
      </template>

      <FormItem>
        <Button @click="goback">返回</Button>

        <Button v-if="addOrEdit != 3" style="margin-left:10px" type="success" @click="save">保存</Button>
      </FormItem>
    </Form>

    <CouponList
      v-if="showCouponList"
      :showCouponList.sync="showCouponList"
      @seclectedTr-event="selectedCouponItem"
    ></CouponList>
  </Card>
</template>
<script>
import * as vip from "@/api/vip";
import storeForm from "@/components/storeForm/storeForm";
import uploadImg from "@/components/uploadImg";
import CouponList from "./components/CouponList";
export default {
  components: { storeForm, uploadImg, CouponList },
  props: ["id", "addOrEdit"],
  data() {
    return {
      form: {
        prizeType: 1,
        pushRange: 0,
        shopRequestList: [],
        coupons: {
          couponId: "",
          couponName: "",
          couponType: "",
          couponUrl: "",
          priority: 1,
          subTitle: "",
        },
        ubayInfo: {
          amountEach: 0,
          totalAmount: 0,
        },
      },
      couponsList: [],
      showCouponList: false,
      selectCouponData: null,

      columns: [
        // 优惠券列表、
        {
          title: "优惠券ID",
          align: "center",
          minWidth: 140,
          key: "couponId",
        },
        {
          title: "优惠券名称",
          align: "center",
          minWidth: 240,
          key: "couponName",
        },
        {
          title: "领券量",
          align: "center",
          minWidth: 120,
          key: "receiveCount",
        },
        {
          title: "剩余量",
          align: "center",
          minWidth: 120,
          key: "receiveCount",
        },
        {
          title: "核销量",
          align: "center",
          minWidth: 120,
          key: "useCount",
        },
      ],
      couponList: null,
    };
  },
  mounted() {
    if (this.id) {
      vip.exclusiveSelectById(this.id).then(res => {
        console.info(res);
        if (res.isSuccess) {
          let form = res.data;
          form.shopRequestList = res.data.shops;
          form.time = [form.startTime, form.endTime];
          delete form.shopInfos;
          delete form.shops;
          this.form = form;
          this.couponList = [form.coupons];
        }
      });
    }
  },
  methods: {
    goback() {
      this.$emit("changeStatus", false);
    },
    selectCoupon() {
      this.showCouponList = true;
    },
    selectedCouponItem(item) {
      this.form.coupons.couponId = item.id;
      this.form.coupons.couponType = item.couponType;
      this.form.coupons.couponName = item.name;
      this.form.coupons.subTitle = item.name;
    },
    save() {
      let body = JSON.parse(JSON.stringify(this.form));
      delete body.time;
      switch (body.prizeType) {
        case 1:
          delete body.ubayInfo;
          break;
        case 2:
          delete body.coupons;
          break;
      }

      if (body.id) {
        vip.exclusiveEdit(body).then(res => {
          if (res.isSuccess) {
            this.goback();
            this.$Message.success("修改成功！");
          } else {
            this.$Message.error(res.msg);
          }
        });
      } else {
        vip.exclusiveAdd(body).then(res => {
          if (res.isSuccess) {
            this.goback();
            this.$Message.success("新增成功！");
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.couponsList {
  width: 800px;
  margin-top: 1vh;
}
.removeCouponsList {
  margin-top: -30px;
  cursor: pointer;
  margin-right: -10px;
}
</style>
