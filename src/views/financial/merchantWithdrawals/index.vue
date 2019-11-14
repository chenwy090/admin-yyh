<template>
  <Card :bordered="false" style="margin-bottom:2px">
    <Tabs type="card" v-model="compName">
      <TabPane v-for="tab in tabs" :key="tab.id" :label="tab.label" :name="tab.compName"></TabPane>
    </Tabs>
    <keep-alive>
      <component :is="compName"></component>
    </keep-alive>
  </Card>
</template>
<script>
import { getRequest, postRequest } from "@/libs/axios";

import columns from "./columns";
// 单店
import SingleStore from "./SingleStore";
// 多店
import MultiStore from "./MultiStore";

export default {
  name: "merchant-withdrawals",
  provide() {
    return {
      // 下载
      download: this.download,
      // 全局提示
      msgOk: this.msgOk,
      msgErr: this.msgErr
    };
  },
  components: { SingleStore, MultiStore },
  watch: {
    compName() {
      console.log("watch:compName", this.compName);
    }
  },
  data() {
    return {
      compName: "single-store",
      tabs: [
        {
          id: Math.random(),
          name: "xxx",
          merchantType: 0,
          label: "商户(单店)",
          compName: "single-store"
        },
        {
          id: Math.random(),
          name: "xxx",
          merchantType: 1,
          label: "商户(多店)",
          compName: "multi-store"
        }
      ]
    };
  },
  methods: {
    async download(url) {
      // const res = await downloadSteam(url);
      const res = await getRequest(url);

      const content = res.data;

      const { filename } = res.headers;

      const blob = new Blob([content], { type: "application/vnd.ms-excel" });
      const oA = document.createElement("a");
      if ("download" in oA) {
        // 非IE下载
        oA.download = decodeURI(filename);
        oA.style.display = "none";
        oA.href = URL.createObjectURL(blob);
        document.body.appendChild(oA);
        oA.click();
        URL.revokeObjectURL(oA.href); // 释放URL 对象
        document.body.removeChild(oA);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, filename);
      }
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
