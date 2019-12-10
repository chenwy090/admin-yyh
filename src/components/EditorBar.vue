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
import { uploadFileRequest } from "@/libs/axios";
import { uploadOperationImage2AliOssURl } from "@/api/index";
import E from "wangeditor";
import allMenus from "./editorBar/menus";

const filterEmptyHtmlTag = html => {
  // console.log(1, html);
  var reg = /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/gi;
  html = html.replace(reg, "");
  // console.log(2, html);
  // <p></p><p>&nbsp;</p><p></p>

  let arr = [
    "<p>&nbsp;</p>",
    "<p>&nbsp; &nbsp;</p>",
    "<p></p><p>&nbsp;</p><p></p>"
  ];
  if (arr.includes(html)) {
    html = "";
  }
  // console.log(3, html);
  return html;
};

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
  // props: ["content"],
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    content: String,
    disabled: null
  },
  watch: {
    content(newOne, oldOne) {
      if (newOne) {
        if (newOne.indexOf("<!--") !== -1) {
          var strArr1 = newOne.split("<!--");
          var strArr2 = strArr1[1].split("-->");
          newOne = strArr1[0] + strArr2[1];
          this.$emit("on-change", newOne);
        }
      }
      this.editor.txt.text(newOne);
      // this.disabled 传1过来表示禁用
      if (this.disabled == 1) {
        this.editor.$textElem.attr("contenteditable", false);
      }
    }
  },
  mounted() {
    this.seteditor();
    this.$refs.noShow.innerHtml = "";
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      // this.editor.customConfig.pasteTextHandle = function(content) {
      //   //   // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      //   //   if (content == "" && !content) return "";
      //   //   var str = content;
      //   //   str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, "");
      //   //   str = str.replace(/<\/?[^>]*>/g, "");
      //   //   str = str.replace(/[ | ]*\n/g, "\n");
      //   //   str = str.replace(/&nbsp;/gi, "");
      //   //   console.log("****", content);
      //   //   console.log("****", str);
      //   //   return str;

      //   console.log(1, content);

      //   var reg = /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/gi;

      //   content = content.replace(reg, "");

      //   console.log(2, content);

      //   // <p></p><p>&nbsp;</p><p></p>

      //   return content;
      // };
      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "undo", // 撤销
        "redo" // 重复
      ];

      let headers = {
        "Content-Type": "multipart/form-data",
        jwttoken: this.userToken.jwttoken
      };

      this.editor.customConfig.uploadImgHeaders = headers;

      this.editor.customConfig.customUploadImg = function(files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法

        // 上传代码返回结果之后，将图片插入到编辑器中
        let fd = new FormData();
        fd.append("file", files[0]); //append方法传入formData中
        let url = "/operation/operation-info/uploadOperationImage2AliOss";
        uploadFileRequest(url, fd).then(res => {
          insert(res.image_url);
        });
      };
      // 配置服务器端地址
      // this.editor.customConfig.uploadImgServer = uploadOperationImage2AliOssURl;

      // 2M
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024;
      // 限制一次最多上传 1张图片
      this.editor.customConfig.uploadImgMaxLength = 1;
      this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
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
        }
        // customInsert: (insertImg, result, editor) => {
        //   // 图片上传成功，插入图片的回调
        //   var url = result.data;
        //   insertImg(url);
        // }
      };
      this.editor.customConfig.onchange = html => {
        html = filterEmptyHtmlTag(html);
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("on-change", this.info_); // 将内容同步到父组件中
      };
      this.editor.customConfig.onblur = html => {
        html = filterEmptyHtmlTag(html);
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
