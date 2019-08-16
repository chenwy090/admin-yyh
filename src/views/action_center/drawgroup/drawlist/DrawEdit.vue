<template>
  <div class="draw-edit">
    <!-- 查看 开奖结果 -->
    <Modal
      v-model="modalShow"
      :title="title"
      width="1000"
      footer-hide
      :closable="true"
      :mask-closable="false"
      :styles="{top: '20px'}"
    >
      <div v-if="modalShow" class="draw-content">
        <Form :label-width="30">
          <FormItem>
            <RadioGroup v-model="groupType">
              <Radio
                v-for="item in groupTypeList"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <keep-alive>
          <component
            :is="compName"
            :groupType="groupType"
            @changeComp="changeComp"
            @closeFormModal-event="closeFormModal"
          ></component>
        </keep-alive>
      </div>
    </Modal>
  </div>
</template>
<script>
import MultiGroup from "./MultiGroup";
import SingleGroup from "./SingleGroup";
export default {
  name: "draw-edit",
  components: {
    [MultiGroup.name]: MultiGroup,
    [SingleGroup.name]: SingleGroup
  },
  props: {
    id: [String, Number],
    // action: "add", //新增 add、修改 edit
    action: {
      type: Object,
      default: function() {
        return { type: "add" };
      }
    }
  },
  watch: {
    modalShow() {
      let groupTypeName = this.groupType == 2 ? "多人团" : "单人团";
      this.title = `新增抽奖-${groupTypeName}`;
    },
    groupType(val, oldVal) {
      let groupTypeName = this.groupType == 2 ? "多人团" : "单人团";
      this.title = `新增抽奖-${groupTypeName}`;
      console.log(111, this.groupType);
    },
    action: {
      handler(val, oldVal) {
        this.modalShow = true;
        console.log("watch:action", this.action);
        let { type = "add", data } = this.action;
        if (type == "add") {
          this.title = "新增抽奖";
        } else {
          //edit
          this.title = "修改抽奖";
        }
      },
      deep: true
    }
  },
  computed: {
    compName() {
      return this.groupType == 2 ? MultiGroup.name : SingleGroup.name;
    }
  },
  data() {
    return {
      title: "新增抽奖",
      modalShow: false, //
      // compName: MultiGroup.name,
      groupType: 2,
      groupTypeList: [
        {
          value: 2,
          label: "多人团"
        },
        {
          value: 1,
          label: "单人团"
        }
      ]
    };
  },
  created() {},
  methods: {
    changeComp(name) {
      this.compName = name;
    },
    closeFormModal() {
      this.modalShow = false;
    }
  }
};
</script>
<style scoped>
.draw-content {
  width: 800px;
  margin: 0 auto;
  border: 1px solid red;
  overflow: hidden;
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