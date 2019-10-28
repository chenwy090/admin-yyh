<template lang="html">
    <div class="editor">
        <div ref="toolbar" class="toolbar">
        </div>
        <div ref="editor" class="text">
        </div>
        <div style="width: 0px;height: 0;overflow: hidden" ref="noShow"></div>
    </div>
</template>

<script>
import { uploadOperationImage2AliOssURl } from "@/api/index";
import E from "wangeditor";
export default {
  name: "EditorBar",
  data() {
    return {
      userToken: "",
      url: uploadOperationImage2AliOssURl,
      editor: null,
      info_: null,
      uploadHeader: {
        Authorization: "Bearer" + localStorage.token,
        contentType: "multipart/form-data; charset=UTF-8"
      }
    };
  },
  props: ["content"],
  watch: {
    content(newOne, oldOne) {
      if (newOne.indexOf("<!--") !== -1) {
        var strArr1 = newOne.split("<!--");
        var strArr2 = strArr1[1].split("-->");
        newOne = strArr1[0] + strArr2[1];
        this.$emit("on-change", newOne);
      }
      this.editor.txt.text(newOne);
    }
  },
  mounted() {
    this.seteditor();
    this.$refs.noShow.innerHtml = "";
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.pasteTextHandle = function(content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        if (content == "" && !content) return "";
        var str = content;
        str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, "");
        str = str.replace(/<\/?[^>]*>/g, "");
        str = str.replace(/[ | ]*\n/g, "\n");
        str = str.replace(/&nbsp;/gi, "");
        console.log("****", content);
        console.log("****", str);
        return str;
      };
      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "underline", // 下划线
        "foreColor", // 文字颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "image", // 插入图片
        "table", // 表格
        "undo", // 撤销
        "redo" // 重复
      ];
      this.editor.customConfig.uploadImgShowBase64 = true; // base 64 存储图片
      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          var url = result.data;
          insertImg(url);
        }
      };
      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("on-change", this.info_); // 将内容同步到父组件中
      };
      this.editor.customConfig.onblur = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("on-blur", this.info_); // 将内容同步到父组件中
      };

      // 创建富文本编辑器
      this.editor.create();
    }
  },
  created() {
    this.userToken = {
      jwttoken: localStorage.getItem("jwttoken")
    };
  }
};
</script>

<style lang="less">
.editor {
  width: 100%;
  margin: 0 auto;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 500px;
}
.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
</style>
