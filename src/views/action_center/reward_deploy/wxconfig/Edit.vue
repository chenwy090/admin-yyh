<template>
  <!-- Withdrawal - switch -->
  <div class="wxconfig-edit">
    <!--修改 提现-开关 对话框-->
    <!-- v-model="showEdit" -->
    <Modal
      v-model="showEdit"
      :title="action.title"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="700"
    >
      <Form ref="form" label-position="right" :model="formDynamic" :label-width="120">
        <FormItem prop="items" :rules="{ required: true, validator: validateWxList }">
          <Row>
            <Col span="12">
              <Button type="dashed" long size="small" @click="handleAdd" icon="md-add">添加微信号</Button>
            </Col>
          </Row>
        </FormItem>

        <!-- _id: Matth.random(),
        wxnumber: '',
        qrcodeImgUrl: '',
        defaultQrcodeImgUrlList: [],-->
        <!-- :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}" -->
        <FormItem
          v-for="(item, index) in formDynamic.items"
          :key="index"
          :label="`微信号.${index+1}: `"
          :prop="`items.${index}.wxnumber`"
          :rules="{required: true,  validator: validateEmpty('请输入微信号')}"
        >
          <Row>
            <Col span="12">
              <Input type="text" v-model.trim="item.wxnumber" placeholder="请输入微信号"></Input>
            </Col>
            <Col span="8">
              <UploadImage
                label="微信二维码："
                :fileUploadType="'qrcodeImgUrl'"
                :defaultList="item.defaultQrcodeImgUrlList"
                @remove="removeQrcodeImgUrl(index)"
                @uploadSuccess="qrcodeImgUrlUploadSuccess($event,index)"
              ></UploadImage>
            </Col>
            <Col span="4" offset="1">
              <Button @click="handleRemove(index)">删除</Button>
            </Col>
          </Row>
        </FormItem>
        <!-- <FormItem
          label="微信号:"
          prop="wxnumber"
          :rules="{required: true,  validator: validateEmpty('请输入标题')}"
        >
          <Input style="width:80%" v-model="formData.wxnumber" placeholder="请输入标题" clearable />
        </FormItem>-->
        <!-- qrCode -->
      </Form>
      <div slot="footer">
        <Button type="error" @click="handleSubmit('form')">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '@/libs/util'
import { postRequest } from '@/libs/axios'
import createFormData from './createFormData'

import UploadImage from './UploadImage'

export default {
  name: 'wxconfig-edit',
  components: { UploadImage },
  props: {
    showEdit: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Object,
      default: () => ({
        _id: Math.random(),
        title: '添加微信号',
        type: 'edit', //add/edit/detail/audit
        data: {},
      }),
    },
  },
  watch: {
    action: {
      handler() {
        let { type, data } = this.action
        // this.isShow = true;
        console.log('watch action')
        // 新增
        if (type == 'add') {
          this.url = '/activityInfo/add'
          this.formData = createFormData()
        } else {
          //edit 修改
          this.url = '/activityInfo/edit'
          this.formData = JSON.parse(JSON.stringify(data))
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      ruleValidate: {},
      modal: {
        levelName: '提现-开关',
        isopen: false,
      },
      isShow: true,
      formData: createFormData(),
      formDynamic: {
        items: [
          {
            _id: Math.random(),
            wxnumber: '',
            qrcodeImgUrl: '',
            defaultQrcodeImgUrlList: [],
          },
        ],
      },
    }
  },
  created() {},
  methods: {
    removeQrcodeImgUrl() {
      console.log('removeQrcodeImgUrl', index)

      let item = this.formData.items[index]
      item.qrcodeImgUrl = ''
      item.defaultQrcodeImgUrlList = []
      this.formData.items.splice(index, 1, item)
    },
    qrcodeImgUrlUploadSuccess({ imgUrl }, index) {
      console.log('qrcodeImgUrlUploadSuccess', imgUrl, index)
      let item = this.formData.items[index]
      item.qrcodeImgUrl = imgUrl
      item.defaultQrcodeImgUrlList = [{ imgUrl }]
      this.formData.items.splice(index, 1, item)
    },
    closeDialog() {
      //关闭对话框清除表单数据
      console.log('closeDialog')
      this.isShow = false
      this.$emit('update:showEdit', false)
    },

    handleAdd() {
      this.formDynamic.items.push({
        _id: Math.random(),
        wxnumber: '',
        qrcodeImgUrl: '',
        defaultQrcodeImgUrlList: [],
      })
    },
    handleRemove(index) {
      this.formDynamic.items.splice(index, 1)
      // this.$emit("del", index);
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.msgOk('数据验证成功!')
          let oForm = JSON.parse(JSON.stringify(this.formData))
          let { code, msg } = await postRequest(this.url, oForm)

          if (code == 200) {
            this.msgOk('保存成功')
            // 关闭对话框
            this.closeDialog()
            //刷新列表数据
            this.$emit('refresh')
          } else {
            this.msgErr(msg)
          }
        } else {
          this.msgErr('数据验证失败,请检查表单!')
        }
      })
    },
    validateEmpty(msg, len = 20) {
      return function(rule, value, callback) {
        value += ''
        value = value.trim()
        if (value == '') {
          return callback(msg)
        }
        let length = util.getByteLen(value)
        if (length > len * 2) {
          return callback(`最多只能输入${len}个汉字`)
        }
        callback()
      }
    },
    validateWxList(rule, value, callback) {
      console.log('validateWxList', rule, value)
      if (!value.length) {
        return callback('请添加微信号')
      }
      callback()
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      })
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      })
    },
  },
}
</script>

<style scoped>
h3 {
  display: inline-block;
  border: 1px solid #d8d3d3;
  padding: 5px 10px;
  margin: 10px 0;
}
</style>


