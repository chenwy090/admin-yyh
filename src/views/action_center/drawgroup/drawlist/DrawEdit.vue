<template>
  <div class="draw-edit">
    <!-- 查看 开奖结果 -->
    <Modal
      v-model="modalShow"
      :title="title"
      width="800"
      footer-hide
      :closable="true"
      :mask-closable="false"
      :styles="{top: '20px'}"
    >
      <div v-if="modalShow" class="draw-content">
        <Form :label-width="30">
          <FormItem>
            <RadioGroup v-model="groupType" @on-change="radioGroupChange">
              <Radio
                v-for="item in groupTypeOptions"
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
import { postRequest, getRequest } from "@/libs/axios";
import { mapState } from "vuex";
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
      let title = this.action.type == "add" ? "新增抽奖" : "修改抽奖";
      this.title = `${title}-${groupTypeName}`;
    },
    groupType(val, oldVal) {
      let groupTypeName = this.groupType == 2 ? "多人团" : "单人团";
      let title = this.action.type == "add" ? "新增抽奖" : "修改抽奖";
      this.title = `${title}-${groupTypeName}`;
      this.$store.commit("g_setData", {
        groupType: this.groupType
      });
    },
    action: {
      handler(val, oldVal) {
        this.modalShow = true;
        let { type = "add", groupType, data } = this.action;
        this.groupType = groupType;
        if (type == "add") {
          this.title = "新增抽奖";
        } else {
          //edit
          this.title = "修改抽奖";
          this.$store.commit("g_setData", {
            drawType: "edit",
            groupType: this.groupType,
            drawData: data
          });
        }
      },
      deep: true
    }
  },
  computed: {
    groupTypeOptions() {
      return this.groupTypeList.filter(item => {
        if (this.action.type == "add") {
          return item;
        } else {
          return item.value == this.groupType;
        }
      });
    },
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
      ],
      data: {}
    };
  },
  created() {},
  methods: {
    changeComp(name) {
      this.compName = name;
    },

    closeFormModal() {
      this.modalShow = false;
      this.$emit("refresh");
    },
    radioGroupChange(groupType) {
      this.$store.commit("g_setData", {
        drawType: "add_cache",
        groupType
      });
    }
  }
};
</script>
<style scoped>
.draw-content {
  width: 750px;
  margin: 0 auto;
  /* border: 1px solid red; */
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