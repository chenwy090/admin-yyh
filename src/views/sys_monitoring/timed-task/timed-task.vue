<template>
  <div>
    <Card>
          <Row class="operation">
   
          <Button type="primary" icon="md-add" @click="addTimed()">新增</Button>
    
          </Row>
    <Table :columns="columns1" :data="data1">
      <template slot-scope="{ row }" slot="action">
        <Button type="success" size="small" style="margin-right:5px;" @click="suspend(row)">暂停</Button>
        <Button type="warning" size="small" style="margin-right:5px;" @click="recover(row)">恢复</Button>
        <Button type="primary" size="small" style="margin-right:5px;" @click="edit(row)">编辑</Button>
        <Button type="error" size="small" style="margin-right:5px;" @click="delTimed(row)">删除</Button>
      </template>
    </Table>


   <Row type="flex" justify="end" class="page">
  <!-- 分页 -->
    <Page
      :total="totalSize"
      show-total
      show-elevator
      @on-change="changeCurrent"
      style="float: right"
      :current.sync="current"
    ></Page>
    <!-- 分页 -->
</Row>
    <!-- 新增\编辑弹框 -->
    <Modal v-model="addDisplay" :title="add_edit == 1 ? '新增':'编辑'"  :mask-closable="false" footer-hide>
      <Form ref="addForm" :model="addForm"  :label-width="120">
        <FormItem label="cronExpression" style="display:block">
          <Input type="text" v-model="addForm.cronExpression" placeholder="Username" />
        </FormItem>
        <FormItem label="jobClassName" v-if="add_edit == 1" style="display:block">
          <Input type="text" v-model="addForm.jobClassName" placeholder="jobClassName" />
        </FormItem>
        <FormItem label="jobGroupName" v-if="add_edit == 1" style="display:block">
          <Input type="text" v-model="addForm.jobGroupName" placeholder="jobGroupName" />
        </FormItem>


    <div>
        <Button type="text" @click="addDisplay=false"> 取消</Button>
        <Button type="primary" @click="addEditTimed">保存</Button>
    </div>

      
      </Form>
    </Modal>
    <!-- 新增弹框 -->
  

   </Card> 
  </div>
</template>
<script>
  import { addTimed, getTimedList, delTimed, suspendTimed, recoverTimed, editTimed } from "@/api/sys";
  export default {
    name: "timed-task",
    data() {
      return {
        columns1: [ //列表字段显示
          {
            title: "操作",
            width: 250,
            fixed: 'left',
            slot: "action",
             align: 'center',
          },
          {
            title: "CRON_EXPRESSION",
            key: "CRON_EXPRESSION",
              width: 250,
          },
          {
            title: "JOB_CLASS_NAME",
            key: "JOB_CLASS_NAME",
              width: 250,
          },
          {
            title: "JOB_GROUP",
            key: "JOB_GROUP",
              width: 150,
          },
          {
            title: "JOB_NAME",
            key: "JOB_NAME",
              width: 250,
          },
          {
            title: "TIME_ZONE_ID",
            key: "TIME_ZONE_ID",
              width: 250,
          },
          {
            title: "TRIGGER_GROUP",
            key: "TRIGGER_GROUP",
              width: 150,
          },
          {
            title: "TRIGGER_NAME",
            key: "TRIGGER_NAME",
              width: 250,
          },
        ],
        data1: [], // 列表数据
        addDisplay: false, // 新增显示
        addForm: {      //新增form
          cronExpression: '', //0 0/1 * * * ?
          jobClassName: '', //com.zex.core.job.HelloJob
          jobGroupName: '',
        },
        current: 1, //当前页码
        totalSize: 0, //总条数
        add_edit: '', // 1：新增 2：编辑
      };
    },
    created: function () {
      this.getList()
    },
    methods: {
// 渲染列表
      getList() {
        getTimedList(this.current).then( res => {
          //console.log(res);
          if (res.code == 200) {
            this.data1 = res.data.records
            // 分页
            this.current = res.data.current
            this.totalSize = res.data.total
          } else {
            this.msgErr(res.msg)
          }
        })
      },

// 分页
      changeCurrent(current) {
          this.current = current
          this.getList()
      },

// 新增
      addTimed() {
        this.add_edit = 1
        this.addDisplay = true
      },

// 编辑
      edit(row) {
        this.add_edit = 2

        this.addDisplay = true

        // 传值
        this.addForm.cronExpression = row.CRON_EXPRESSION
        this.addForm.jobClassName = row.JOB_CLASS_NAME
        this.addForm.jobGroupName = row.JOB_GROUP

      },


// 新增和编辑 发送请求
      addEditTimed() {
        if(this.add_edit == 1) {
          // 新增
          let cronExpression = this.addForm.cronExpression
          let jobClassName = this.addForm.jobClassName
          let jobGroupName = this.addForm.jobGroupName

          addTimed(cronExpression, jobClassName, jobGroupName).then( res => {
            if (res.code == 200) {
              this.getList()
              this.reset()
              this.msgOk('新增成功')
            } else {
              this.msgErr(res.msg)
            }
          })

        } else if (this.add_edit == 2) {
          // 编辑
          let cronExpression = this.addForm.cronExpression
          let jobClassName = this.addForm.jobClassName
          let jobGroupName = this.addForm.jobGroupName

          editTimed(cronExpression, jobClassName, jobGroupName).then( res => {
            if (res.code == 200) {
              this.getList()
              this.reset()
              this.msgOk('编辑成功')
            } else {
              this.msgErr(res.msg)
            }
          })

        }
      },

// 清空新增编辑form
      reset() {
        this.addForm.cronExpression = ''
        this.addForm.jobClassName = ''
        this.addForm.jobGroupName = ''

        this.addDisplay = false
      },

// 删除
      delTimed(row){
        //console.log(row);
        let jobClassName = row.JOB_CLASS_NAME
        let jobGroupName = row.JOB_GROUP

        this.$Modal.confirm({
            title: '提示',
            content: '<p>确认删除？</p>',
            onOk: () => {
              // 发送请求
                delTimed(jobClassName, jobGroupName).then( res => {
                  if (res.code == 200) {
                    this.getList()
                    this.msgOk('删除成功')
                  } else {
                    this.msgErr(res.msg)
                  }
                })
            },
            onCancel: () => {

            }
        });
      },

// 暂停
      suspend(row) {
        let jobClassName = row.JOB_CLASS_NAME
        let jobGroupName = row.JOB_GROUP
        this.$Modal.confirm({
            title: '提示',
            content: '<p>确认暂停？</p>',
            onOk: () => {
              // 发送请求
                suspendTimed(jobClassName, jobGroupName).then( res => {
                  if (res.code == 200) {
                    this.msgOk('暂停成功')
                  } else {
                    this.msgErr(res.msg)
                  }
                })
            },
            onCancel: () => {

            }
        });
      },


// 恢复
      recover(row) {
        let jobClassName = row.JOB_CLASS_NAME
        let jobGroupName = row.JOB_GROUP
        this.$Modal.confirm({
            title: '提示',
            content: '<p>确认恢复？</p>',
            onOk: () => {
              // 发送请求
                recoverTimed(jobClassName, jobGroupName).then( res => {
                  if (res.code == 200) {
                    this.msgOk('恢复成功')
                  } else {
                    this.msgErr(res.msg)
                  }
                })
            },
            onCancel: () => {

            }
        });
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
      },
    },
  };
</script>

<style lang="less" scoped>

    .operation {
        margin-bottom: 2vh;
    }
    .select-count {
        font-size: 13px;
        font-weight: 600;
        color: #40a9ff;
    }
    .select-clear {
        margin-left: 10px;
    }
    .page{
        margin-top: 2vh;
    }
    .drop-down{
        font-size: 13px;
        margin-left: 5px;
    }

</style>
