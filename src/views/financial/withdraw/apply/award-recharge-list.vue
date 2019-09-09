<template>
  <Row>
    <Form ref="searchForm" :label-width="80" :model="searchForm" inline>
      <FormItem>
        <ButtonGroup>
          <Button type="primary" @click="excelExport()">导出上个月记录</Button>
        </ButtonGroup>
        <ButtonGroup style="margin-left: 20px;">
          <Button type="primary" @click="excelExportU()">U贝报表下载</Button>
        </ButtonGroup>
      </FormItem>
    </Form>
  </Row>
</template>
<script>
import { financialWithdrawApplyAwardRechargeDownload } from "@/api/sys";
import { getRequest } from "@/libs/axios";
export default {
  data() {
    return {};
  },
  methods: {
      excelExportU(){
          getRequest("/report/download/ubay/report").then(res => {
              console.log(res);
              const content = res.data;
              let fileName = 'U贝报表';
              // const blob = new Blob([content], { type: "application/vnd.ms-excel" });
              if ("download" in document.createElement("a")) {
                  // 非IE下载
                  const elink = document.createElement("a");
                  elink.download = decodeURI(fileName);
                  elink.style.display = "none";
                  elink.href = content;
                  document.body.appendChild(elink);
                  elink.click();
                  URL.revokeObjectURL(elink.href); // 释放URL 对象
                  document.body.removeChild(elink);
              } else {
                  // IE10+下载
                  navigator.msSaveBlob(content, fileName);
              }
          });
      },
    excelExport() {
      financialWithdrawApplyAwardRechargeDownload().then(res => {
        const content = res.data;
        let fileName = res.headers["filename"];
        const blob = new Blob([content], { type: "application/vnd.ms-excel" });
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = decodeURI(fileName);
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
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
