<template>
  <Card>
    <p style="width:75%">
      <Alert type="warning" show-icon>Tip : 保存之后才生效</Alert>
    </p>
    <p style="margin-top: 2%;">
      <Form ref="formDynamic">
        <Timeline pending>
          <TimelineItem
            v-for="(item, index) in formDynamic"
            :key="index"
            :prop=" index + '.value'"
            :rules="{required: true}"
            style="margin-bottom:10px;"
          >
            <Card :bordered="false">
              <Row>
                <Col span="22">
                  <div style="margin-bottom: 10px;display: flex; width: 700px">
                    <p style="padding-right: 10px;width: 75px;">问题{{index+1}}</p>
                    <i-input
                      type="text"
                      v-model="item.question"
                      placeholder="请输入问题..."
                      style="width: 500px"
                    ></i-input>
                  </div>
                  <div style="margin-bottom: 10px;display: flex; width: 700px">
                    <p style="padding-right: 10px;width: 75px;">答案{{index+1}}</p>
                    <i-input
                      type="textarea"
                      v-model="item.answer"
                      placeholder="请输入答案..."
                      :style="{width:'500px'}"
                      :autosize="{minRows: 4,maxRows: 10}"
                    ></i-input>
                  </div>
                </Col>
                <Col span="2">
                  <Button type="error" @click="handleRemove(index)" v-if="formDynamic.length >1">删除</Button>
                </Col>
              </Row>
            </Card>
          </TimelineItem>
        </Timeline>
        <FormItem>
          <Button type="success" @click="handleAdd" icon="md-add">新增问题</Button>
        </FormItem>
        <FormItem>
          <Button long type="primary" @click="handleSubmit('formDynamic')">保存问题</Button>
        </FormItem>
      </Form>
    </p>
  </Card>
</template>
<script>
  import { getHelpCenterList, addHelpCenterInfo } from "@/api/sys";
  export default {
    data() {
      return {
        formDynamic: [{ question: "", answer: "", id: 0 }],
        deleteid: [], // 删除数组
        // id: 0 //新增默认id
      };
    },
    created: function() {
      this.getHelpCenterList();
    },
    methods: {
      // 获取问题列表
      getHelpCenterList() {
        //测试数据
        // let data = [
        //   { question: "97", answer: "97", id: 97 },
        //   { question: "98", answer: "98", id: 98 },
        //   { question: "99", answer: "99", id: 99 }
        // ]
        // this.formDynamic = data;
        // return
        getHelpCenterList().then(res => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              let data = res.data
              let arr = []
              for (let i = 0; i < data.length; i++) {
                let obj = {
                  id:data[i].id,
                  question:data[i].question,
//                  answer:data[i].answer.replace(/\\n/g,"\n")
                    answer:data[i].answer
                }
                arr.push(obj)
              }
              this.formDynamic = arr;
              // this.id = res.data.id;
            } else {
              this.formDynamic = [{ question: "", answer: "", id: 0 }];
            }
          }else{
            this.msgErr(res.msg)
          }
        });
      },

      // 保存问题
      handleSubmit() {
        if (this.formDynamic.length > 100) {
          return this.$Message.error("不能超过100个问题", 3);
        }

        for (var i = 0; i < this.formDynamic.length; i++) {
          var resultIndex = i + 1;
          if (this.formDynamic[i].question === "" || this.formDynamic[i].question === " ") {
            this.$Message.error("第 " + resultIndex + "条问题为空！");
            return;
          }
          if (this.formDynamic[i].answer === "" || this.formDynamic[i].answer === " ") {
            this.$Message.error("第 " + resultIndex + "条答案为空！");
            return;
          }
        }

        let arr = []
        for (let i = 0; i < this.formDynamic.length; i++) {
          const obj = {
            id:this.formDynamic[i].id,
            question:this.formDynamic[i].question,
//            answer:this.formDynamic[i].answer.replace(/\t/g, "").replace(/\n/g, "\\n")
              answer:this.formDynamic[i].answer

          }
          arr.push(obj)
        }

        // console.log(arr);
        // return

        var reqParams = {
          // id: this.id,
          edit: arr,
          deleteid: this.deleteid
        }
        // console.log(json);
        // return
        addHelpCenterInfo(reqParams).then(res => {
          if (res.code == 200) {
            this.$Message.info("问题保存成功！");
            this.getHelpCenterList();
          } else {
            // this.$Message.error(res.msg);
            this.$Message.error('000');
          }
        });
      },

      // 添加问题
      handleAdd() {
        if (this.formDynamic.length >= 100) {
          return this.$Message.error("不能超过100个问题");
        } else {
          this.formDynamic.push({
            question: "",
            answer: "",
            id: 0
          });
        }
      },

      // 删除
      handleRemove(index) {
        // console.log(index);
        for (let i = 0; i < this.formDynamic.length; i++) {
          if(this.formDynamic[i].id != 0) {
            if(i == index) {
              console.log(i);
              this.deleteid.push(this.formDynamic[i].id)
              // console.log(this.formDynamic[i].id);
            }
          }
        }
        console.log(this.deleteid);
        this.formDynamic.splice(index, 1);
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

      //   -------------------------------------------------------------------
    }
  };
</script>



