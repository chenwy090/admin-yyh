<template>
  <Card>
    <!--  -->
    <Form :label-width="120">
      <FormItem label="投放方式：">
        <RadioGroup v-model="form.prizeType">
          <Radio :label="1">优惠券</Radio>
          <Radio :label="2" style="margin-left:20px">U贝</Radio>
        </RadioGroup>
      </FormItem>

      <storeForm :pushRange.sync="form.pushRange" :shopRequestList.sync="form.shopRequestList"></storeForm>

      <FormItem label="投放时间：">
        <DatePicker
          transfer
          type="daterange"
          placeholder="请选择投放时间"
          @on-change="[form.startTime, form.endTime] = $event"
          v-model="form.time"
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
              <Button @click="selectCoupon()">选择优惠券</Button>
              <span v-if="form.coupons.couponId">【{{ form.coupons.couponName }}】</span>
            </div>
            <div>
              优惠券详情副标题：
              <Input v-model="form.coupons.subTitle" />
            </div>
            <div>
              优惠券详情大图：
              <!-- couponUrl -->
              <uploadImg
                :uploadImg="form.coupons.couponUrl"
                @handleSuccess="url => (form.coupons.couponUrl = url)"
              ></uploadImg>
            </div>
          </Card>
        </FormItem>
      </template>

      <template v-if="form.prizeType == 2">
        <FormItem label="每人获得U贝数量：">
          <Input placeholder="请输入每人获得U贝数量" style="width:200px">
            <span slot="append">U贝</span>
          </Input>
        </FormItem>

        <FormItem label="发放份数：">
          <InputNumber></InputNumber>
        </FormItem>
      </template>

      <FormItem>
        <Button @click="goback">返回</Button>

        <Button style="margin-left:10px" type="success" @click="save">保存</Button>
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
import CouponList from "@/views/CMS/contentArea/publish/CouponList";
export default {
  components: { storeForm, uploadImg, CouponList },
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
      },
      couponsList: [],
      showCouponList: false,
      selectCouponData: null,
    };
  },
  mounted() {},
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
    },
    save() {
      let body = JSON.parse(JSON.stringify(this.form));
      delete body.time;
      console.info(body);
      vip.exclusiveAdd(body).then(res => {
        if (res.isSuccess) {
          this.goback();
          this.$Message.success("新增成功！");
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.couponsList {
  width: 400px;
  margin-top: 1vh;
}
.removeCouponsList {
  margin-top: -30px;
  cursor: pointer;
  margin-right: -10px;
}
</style>
