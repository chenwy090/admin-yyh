<template>
  <div>
    <Card>
      123
    </Card>
  </div>
</template>
<script>
  import { getSettlementAccount, editSettlementAccount } from "@/api/sys";
  import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
  } from "@/libs/axios";
  import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
  import { formatDate, checkImageWH, checkImage, uniqueArray } from "@/libs/date";

  export default {
    name: "addSettlementAccount",
    props: {
      id: null,
      businessCustomer: null
    },
    data() {
      return {
        userInfo: "",
        addEdit: null, // 1新增 2编辑
        bsUploadList: [],
        url: uploadOperationImage2AliOssURl,
        form: {
          basicId: "",
          account: "",
          name: "",
          type: "",
          mobile: "",
          openBank: "",
          cardType: null
        }
      };
    },
    created: function() {
      
    },
    mounted() {},
    methods: {

      // 返回
      goback() {
        this.$emit("changeStatus", false);
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

<style>

</style>
