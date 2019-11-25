
<template>
  <Tabs :value="currentTab" @on-click="changeTab">
    <TabPane label="商户基础信息" name="info">
      <div v-if="currentTab == 'info'">
        <Card>
          <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回列表</Button>

          <Alert
            show-icon
            v-if="camp_pageStatus == 'edit'"
            style="margin-left: 200px; width: 600px; margin-top: 10px"
          >
            商户id :
            <span style="color:red">{{edit_info.merchantId}}</span>
            <span slot="desc"></span>
          </Alert>
          <Row style="margin-left:15%;">
            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span>商户名称
              </Col>
              <Col span="16">
                <Tooltip trigger="focus" title="提醒" content="20个汉字以内" placement="right">
                  <Input
                    type="text"
                    v-model="edit_info.name"
                    style="width:300px"
                    placeholder="请输入商户名称"
                    @on-change="statusCheckChange"
                    :maxlength="20"
                  />
                </Tooltip>
              </Col>
            </Row>

            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span> 商户logo
              </Col>
              <Col span="3">
                <div class="imgSrc_box" v-if="logeImgSrc">
                  <img :src="logeImgSrc" style="width:100%" />
                </div>
              </Col>
              <Col span="8">
                <div style="width:100px; float:left">
                  <ImgCutter
                    :label="'选择图片'"
                    :boxWidth="600"
                    :boxHeight="500"
                    :rate="1"
                    v-on:cutDown="cutDown"
                  >
                    <button slot="openImgCutter" style="width:100px; background: border-box">上传图片</button>
                  </ImgCutter>
                </div>
                <br />
                <div class="left-text">选择商户logo (不大于1M,JPG/PNG/JPEG/BMP）</div>
              </Col>
            </Row>

            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span> 商户门店图片
              </Col>
              <Button
                type="primary"
                icon="md-add-circle"
                size="small"
                style="margin-left:250px"
                @click="addImgArr()"
              >增加</Button>
              <Card
                v-for="(item, index) in edit_info.merchantShopImageList"
                :key="index"
                style="margin:10px 0 10px 116px;width:400px"
              >
                <div>
                  <span style="overflow:hidden;display:inline-block;margin-right:10px;">
                    <div class="imgSrc_box" style="margin-right:0;;width:90px" v-if="item.imgUrl">
                      <img :src="item.imgUrl" style="width:100%" />
                    </div>
                  </span>
                  <div style="overflow:hidden;display:inline-block">
                    <div style="width:100px; float:left">
                      <ImgCutter
                        :label="'选择图片'"
                        :boxWidth="600"
                        :boxHeight="500"
                        :rate="1"
                        v-on:cutDown="cutDownArr"
                      >
                        <button
                          slot="openImgCutter"
                          style="width:100px; background: border-box"
                          @click="cutDownNum(index)"
                        >上传图片</button>
                      </ImgCutter>
                    </div>
                    <!-- 删除按钮 -->
                    <Button
                      type="warning"
                      icon="md-close"
                      size="small"
                      style="margin-left:20px"
                      @click="delImgArr(index)"
                      v-if="index !=0"
                    >删除</Button>
                    <br />
                    <div class="left-text">
                      <h4>商户门店{{index + 1}}</h4>(不大于1M,JPG/PNG/JPEG/BMP）
                    </div>
                  </div>
                </div>
              </Card>
            </Row>

            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span> 主营品牌
              </Col>
              <Col span="4">
                <Select
                  v-model="mainMainBrandId"
                  style="width:120px"
                  placeholder="请选择主品牌"
                  @on-change="getBrandSecendList(mainMainBrandId),edit_info.mainBrandId=''"
                >
                  <Option
                    v-for="item in mainBrandList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
              </Col>

              <Col span="4">
                <Select
                  v-model="edit_info.mainBrandId"
                  style="width:120px"
                  placeholder="请选择二级品牌"
                  @on-change="statusCheckChange"
                >
                  <Option
                    v-for="item in secendBrandList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
              </Col>
            </Row>

            <Row class="box">
              <Col span="2" class="left-text">兼营品牌</Col>
              <Col span="2">
                <Button
                  type="primary"
                  icon="md-add-circle"
                  size="small"
                  @click="compatible_addInfo"
                >新增</Button>
              </Col>
            </Row>

            <Alert v-if="compatibleList.length>0">
              <Row class="box" v-for="(item, index) in compatibleList" :key="index">
                <Col span="2" class="left-text"></Col>

                <Col span="4">
                  <Select
                    v-model="item.mainBrandId"
                    style="width:120px"
                    placeholder="请选择主品牌"
                    @on-change="getBrandSecendList2(index, item.mainBrandId)"
                  >
                    <Option
                      v-for="item in mainBrandList"
                      :value="item.id"
                      :key="item.id"
                    >{{ item.name }}</Option>
                  </Select>
                </Col>
                <Col span="4">
                  <Select v-model="item.secendBrandId" style="width:120px" placeholder="请选择二级品牌">
                    <Option
                      v-for="item in item.secendBrandList"
                      :value="item.id"
                      :key="item.id"
                    >{{ item.name }}</Option>
                  </Select>
                </Col>
                <Col span="2">
                  <Button
                    type="error"
                    icon="md-trash"
                    size="small"
                    @click="compatible_delInfo(index,item)"
                  >删除</Button>
                </Col>
              </Row>
            </Alert>

            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span> 行业类目
              </Col>
              <Col span="4">
                <Select
                  v-model="mainIndustryId"
                  style="width:120px"
                  placeholder="请选择主行业"
                  @on-change="getIndustrySecendList(mainIndustryId),edit_info.industryId=''"
                >
                  <Option
                    v-for="item in mainIndustryList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
              </Col>
              <Col span="4">
                <Select v-model="edit_info.industryId" style="width:120px" placeholder="请选择二级行业">
                  <Option
                    v-for="item in secendIndustryList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
              </Col>
            </Row>

            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span> 所在地区
              </Col>
              <Col span="4">
                <Select
                  v-model="edit_info.provinceCode"
                  style="width:120px"
                  clearable
                  @on-change="getcitylist(edit_info.provinceCode),  edit_info.cityCode='',    edit_info.areaCode=''"
                >
                  <Option
                    v-for="(item,index) in provincelist"
                    :key="index"
                    :value="item.provinceCode"
                  >{{item.provinceName}}</Option>
                </Select>
              </Col>

              <Col span="4">
                <Select
                  v-model="edit_info.cityCode"
                  style="width:120px"
                  clearable
                  @on-change="getarealist(edit_info.cityCode)"
                >
                  <Option
                    v-for="(item,index) in citylist"
                    :key="index"
                    :value="item.cityCode"
                  >{{item.cityName}}</Option>
                </Select>
              </Col>

              <Col span="4">
                <Select v-model="edit_info.areaCode" style="width:120px" clearable>
                  <Option
                    v-for="(item,index) in arealist"
                    :key="index"
                    :value="item.areaCode"
                  >{{item.areaName}}</Option>
                </Select>
              </Col>
            </Row>

            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span> 详细地址
              </Col>
              <Col span="16">
                <Tooltip trigger="focus" title="提醒" content="30个汉字以内" placement="right">
                  <Input
                    type="textarea"
                    v-model="edit_info.address"
                    style="width:300px"
                    :autosize="{minRows: 2,maxRows: 5}"
                    @on-change="statusCheckChange"
                    placeholder="请输入商户详细地址"
                    :maxlength="30"
                  />
                </Tooltip>
              </Col>
            </Row>

            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span> 周边商超
              </Col>
              <!--<CheckboxGroup v-model="edit_info.shopIdList" span="3" @on-change="statusCheckChange">-->
              <!--<Checkbox-->
              <!--style="width:130px"-->
              <!--v-for="(item, index) in shopList"-->
              <!--:key="item.shopId"-->
              <!--:label="item.shopId"-->
              <!--&gt;{{item.shopName}}</Checkbox>-->
              <!--</CheckboxGroup>-->
              <!--<Select v-model="edit_info.shopIdList" multiple style="width:260px">-->
              <!--<Option v-for="(item, index) in shopList" :value="item.shopId" :key="item.shopId">{{ item.shopName }}</Option>-->
              <!--</Select>-->
              <Col span="16">
                <Select
                  v-model="edit_info.shopIdList"
                  multiple
                  style="width:260px"
                  @on-change="statusCheckChange"
                  filterable
                >
                  <Option
                    v-for="(item, index) in shopList"
                    :value="item.shopId"
                    :key="item.shopId"
                  >{{ item.shopName }}</Option>
                </Select>
              </Col>
            </Row>
            <Row class="box">
              <Col span="2" class="left-text">联系电话</Col>
              <Col span="16">
                <Input
                  type="text"
                  v-model="edit_info.telephone"
                  style="width:300px"
                  @on-change="statusCheckChange"
                  placeholder="请输入联系电话"
                  :maxlength="11"
                />
              </Col>
            </Row>

            <Row class="box">
              <Col span="2" class="left-text">
                <span style="color:red">*</span> 营业状态
              </Col>
              <Col span="16">
                <RadioGroup v-model="edit_info.operatingStatus" @on-change="statusCheckChange">
                  <Radio label="0">
                    <span>营业中</span>
                  </Radio>
                  <Radio label="1">
                    <span>待营业</span>
                  </Radio>
                  <Radio label="2">
                    <span>暂停营业</span>
                  </Radio>
                </RadioGroup>
              </Col>
            </Row>

            <Row style=" margin-bottom: 10px">
              <Button
                type="success"
                @click="addOneList"
                icon="md-add"
                @on-change="statusCheckChange"
              >添加官网简介</Button>
            </Row>

            <Row>
              <Timeline>
                <TimelineItem
                  v-for="(item, index) in edit_info.merchantProfileList"
                  :key="index"
                  :prop=" index + '.value'"
                  :rules="{required: true}"
                >
                  <Alert show-icon>
                    <p style=" font-size: 16px; font-weight: 500;">官网简介{{index+1}}</p>
                  </Alert>

                  <Card style="padding: 10px;background-color:#f1f9f4">
                    <Row>
                      <Col span="22">
                        <div style="margin-bottom: 10px;display: flex; width: 700px">
                          <p style="padding-right: 10px;width: 100px;">
                            <span style="color:red">*</span>商户简介
                          </p>
                          <Tooltip trigger="focus" title="提醒" content="最多5个汉字" placement="top">
                            <i-input
                              v-model="item.profile"
                              type="text"
                              :maxlength="5"
                              placeholder="请输入商户简介..."
                              style="width: 500px"
                              @on-change="statusCheckChange"
                            ></i-input>
                          </Tooltip>
                        </div>
                        <div style="margin-bottom: 10px;display: flex; width: 700px">
                          <p style="padding-right: 10px;width: 100px;">简介内容</p>

                          <Row style="width: 600px">
                            <Row label style="margin-bottom: 20px">
                              <Button
                                type="primary"
                                @click="addTwoList(index)"
                                icon="md-add"
                                @on-change="statusCheckChange"
                              >添加简介内容</Button>
                            </Row>

                            <Timeline>
                              <TimelineItem
                                v-for="(item1, index1) in item.contents"
                                :key="index1"
                                :prop=" index1 + '.value'"
                                :rules="{required: true}"
                              >
                                <Alert show-icon>
                                  <p style=" font-size: 16px; font-weight: 500;">内容简介{{index1+1}}</p>
                                </Alert>

                                <Card
                                  style="padding: 10px;margin-top:10px;background-color:#dcf1e4"
                                >
                                  <Row>
                                    <Col span="22">
                                      <div style="margin-bottom: 10px;display: flex; width: 600px">
                                        <p style="padding-right: 10px;width: 100px;">业务介绍</p>
                                        <Tooltip
                                          trigger="focus"
                                          title="提醒"
                                          content="最多100个汉字"
                                          placement="top"
                                        >
                                          <i-input
                                            type="textarea"
                                            :maxlength="100"
                                            :autosize="{minRows: 2,maxRows: 5}"
                                            v-model="item1.content"
                                            placeholder="请输入业务介绍..."
                                            style="width: 380px"
                                            @on-change="statusCheckChange"
                                          ></i-input>
                                        </Tooltip>
                                      </div>
                                    </Col>

                                    <Col span="22">
                                      <div style="margin-bottom: 10px;display: flex; width: 600px">
                                        <p style="padding-right: 10px;width: 100px;">业务图片</p>

                                        <div
                                          class="demo-upload-list"
                                          v-for="(item11, index11) in item1.imagesList"
                                          :key="index11"
                                        >
                                          <img :src="item11.url" />
                                          <div class="demo-upload-list-cover">
                                            <Icon
                                              type="ios-eye-outline"
                                              @click.native="handleTwoView(item11)"
                                            ></Icon>
                                            <Icon
                                              type="ios-trash-outline"
                                              @click.native="handleTwoRemove(index11,index,index1)"
                                            ></Icon>
                                          </div>
                                        </div>

                                        <div style="display: inline-block;">
                                          <Upload
                                            ref="upload"
                                            :defaultList="uploadList1"
                                            type="drag"
                                            :format="['jpg','jpeg','png']"
                                            :on-success="handleTwoSuccess"
                                            :action="url"
                                            accept="image"
                                            :max-size="1024"
                                            :headers="userToken"
                                            :on-exceeded-size="handleMaxSize"
                                            style="display: inline-block;width:90px;"
                                            :show-upload-list="false"
                                            :before-upload="handleBeforeUpload"
                                          >
                                            <div
                                              style="width: 90px;height:90px;line-height: 90px;"
                                              @click="uploadIMG(index,index1)"
                                            >
                                              <Icon type="ios-camera" size="20" />
                                            </div>
                                          </Upload>
                                          <p>选择图片 (不大于1M, JPG/PNG/JPEG/BMP）</p>
                                        </div>
                                      </div>
                                    </Col>

                                    <Col span="24">
                                      <Button
                                        type="error"
                                        long
                                        @click="removeTwoList(index,index1)"
                                        @on-change="statusCheckChange"
                                      >删除</Button>
                                    </Col>
                                  </Row>
                                </Card>
                              </TimelineItem>
                            </Timeline>
                          </Row>
                        </div>
                      </Col>
                      <Col span="24">
                        <Button
                          type="error"
                          long
                          @click="removeOneList(index,item)"
                          @on-change="statusCheckChange"
                        >删除</Button>
                      </Col>
                    </Row>
                  </Card>
                </TimelineItem>
              </Timeline>
            </Row>

            <Row style="{'margin-top':'54px'}">
              <Alert
                type="warning"
                show-icon
                v-if="isCheckDisabled == true"
                style="width:500px"
              >修改后才能保存</Alert>
              <Button
                type="info"
                @click="goback()"
                style="width:240px;margin-right: 20px; float: left;"
              >取&nbsp&nbsp&nbsp消</Button>
              <Button
                type="primary"
                @click="campagin_add()"
                :loading="edit_loading"
                style="width:240px; float: left;"
                :disabled="isCheckDisabled"
              >下一步</Button>
            </Row>
          </Row>
        </Card>
        <Modal title="查看图片" v-model="visible">
          <img :src="imgName" v-if="visible" style="width: 100%" />
        </Modal>

        <Spin size="large" fix v-if="spinShow"></Spin>
      </div>
    </TabPane>
    <TabPane label="认证信息" name="identification">
      <Card v-if="currentTab == 'identification'">
        <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回列表</Button>

        <Alert
          show-icon
          v-if="camp_pageStatus=='edit'"
          style="margin-left: 200px; width: 600px; margin-top: 10px"
        >
          商户id :
          <span style="color:red">{{edit_info.merchantId}}</span>
          <span slot="desc"></span>
        </Alert>
        <Row style="margin-left:15%;">
          <Row class="box">
            <Col span="3" class="left-text">
              <span style="color:red">*</span>营业执照名称
            </Col>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最多30个汉字" placement="right">
                <Input
                  type="text"
                  v-model="identification_info.businessLicenseName"
                  style="width:300px"
                  placeholder="请输入营业执照名称"
                  @on-change="statusCheckChange"
                  :maxlength="30"
                />
              </Tooltip>
            </Col>
          </Row>
          <Row class="box">
            <Col span="3" class="left-text">
              <span style="color:red">*</span>统一社会信用代码
            </Col>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="只能输入数字字母；18位校验" placement="right">
                <Input
                  type="text"
                  v-model="identification_info.uniformSocialCreditCode"
                  style="width:300px"
                  placeholder="请输入统一社会信用代码"
                  @on-change="statusCheckChange"
                  :maxlength="18"
                />
              </Tooltip>
            </Col>
          </Row>
          <Row class="box">
            <Col span="3" class="left-text">
              <span style="color:red">*</span>营业执照
            </Col>
            <Col span="20">
              <div
                style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                v-for="(item, index) in bsUploadList"
                :key="index"
              >
                <img :src="item.url" style="width:100%" />
              </div>
              <div style="display: inline-block;">
                <Upload
                  ref="upload"
                  type="drag"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-success="bsHandleSuccess"
                  :action="url"
                  accept="image"
                  :max-size="1024"
                  :on-exceeded-size="handleMaxSize"
                  :on-format-error="formatError"
                  :defaultList="bsUploadList"
                  :headers="userToken"
                  :show-upload-list="false"
                  style="display: inline-block;width:90px;"
                >
                  <!-- :before-upload="handleUploadicon"  :headers= "userToken"-->
                  <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20" />
                  </div>
                </Upload>
                <p style="font-size:12px">选择营业执照 (不大于1M,JPG/PNG/JPEG/BMP）</p>
              </div>
            </Col>
          </Row>

          <Row class="box">
            <Col span="3" class="left-text">
              <span style="color:red">*</span>法人姓名
            </Col>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最多30个字符" placement="right">
                <Input
                  type="text"
                  v-model="identification_info.corporation"
                  style="width:300px"
                  placeholder="请输入法人姓名"
                  @on-change="statusCheckChange"
                  :maxlength="30"
                />
              </Tooltip>
            </Col>
          </Row>

          <Row class="box">
            <Col span="3" class="left-text">
              <span style="color:red">*</span>法人身份证号
            </Col>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最多18位" placement="right">
                <Input
                  type="text"
                  v-model="identification_info.idCard"
                  style="width:300px"
                  placeholder="请输入法人身份证号"
                  @on-change="statusCheckChange"
                  :maxlength="18"
                />
              </Tooltip>
            </Col>
          </Row>

          <Row class="box">
            <Col span="3" class="left-text">
              <span style="color:red">*</span>身份证正面
            </Col>
            <Col span="20">
              <div
                style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                v-for="(item, index) in idcFrontUploadList"
                :key="index"
              >
                <img :src="item.url" style="width:100%" />
              </div>
              <div style="display: inline-block;">
                <Upload
                  ref="upload"
                  type="drag"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-success="idcFrontHandleSuccess"
                  :action="url"
                  accept="image"
                  :max-size="1024"
                  :on-exceeded-size="handleMaxSize"
                  :on-format-error="formatError"
                  :defaultList="idcFrontUploadList"
                  :headers="userToken"
                  :show-upload-list="false"
                  style="display: inline-block;width:90px;"
                >
                  <!-- :before-upload="handleUploadicon"  :headers= "userToken"-->
                  <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20" />
                  </div>
                </Upload>
              </div>
              <div style="display: inline-block; margin-left: 50px;">
                <div style="font-size:12px">
                  <p>示例：</p>
                </div>
                <img src="https://image.52iuh.com/wx_mini/gBEdVc6QAf.png" style="width:45%" />
              </div>
            </Col>
          </Row>

          <Row class="box">
            <Col span="3" class="left-text">
              <span style="color:red">*</span>身份证背面
            </Col>
            <Col span="20">
              <div
                style="float:left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                v-for="(item, index) in idcBehindUploadList"
                :key="index"
              >
                <img :src="item.url" style="width:100%" />
              </div>
              <div style="display: inline-block;">
                <Upload
                  ref="upload"
                  type="drag"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-success="idcBehindHandleSuccess"
                  :action="url"
                  accept="image"
                  :max-size="1024"
                  :on-exceeded-size="handleMaxSize"
                  :on-format-error="formatError"
                  :defaultList="idcBehindUploadList"
                  :headers="userToken"
                  :show-upload-list="false"
                  style="display: inline-block;width:90px;"
                >
                  <!-- :before-upload="handleUploadicon"  :headers= "userToken"-->
                  <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20" />
                  </div>
                </Upload>
              </div>
              <div style="display: inline-block; margin-left: 50px">
                <div style="font-size:12px">
                  <p>示例：</p>
                </div>
                <img src="https://image.52iuh.com/wx_mini/4BZtGZt5AP.png" style="width:48%" />
              </div>
            </Col>
          </Row>

          <Row class="box">
            <Col span="3" class="left-text">
              <span style="color:red">*</span>资金账户类型
            </Col>
            <Col span="6">
              <Select
                v-model="identification_info.accountType"
                placeholder="请选择类型"
                style="width: 200px"
                @on-change="statusCheckChange"
              >
                <Option value="bank">银行卡</Option>
                <Option value="alipay">支付宝</Option>
                <Option value="weixin">微信</Option>
              </Select>
            </Col>
          </Row>

          <Alert v-if="identification_info.accountType=='bank'">
            <Row class="box">
              <Col span="3" class="left-text">
                <span style="color:red">*</span>持卡人姓名
              </Col>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
                  <Input
                    type="text"
                    v-model="identification_info.bankCardUsername"
                    style="width:300px"
                    placeholder="请输入持卡人姓名"
                    @on-change="statusCheckChange"
                    :maxlength="10"
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row class="box">
              <Col span="3" class="left-text">
                <span style="color:red">*</span>卡号
              </Col>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多25位" placement="right">
                  <Input
                    type="text"
                    v-model="identification_info.bankCardCode"
                    style="width:300px"
                    placeholder="请输入卡号"
                    @on-change="statusCheckChange"
                    :maxlength="25"
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row class="box">
              <Col span="3" class="left-text">
                <span style="color:red">*</span>开户行
              </Col>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多30个汉字" placement="right">
                  <Input
                    type="text"
                    v-model="identification_info.bankCardAddress"
                    style="width:300px"
                    placeholder="请输入开户行"
                    @on-change="statusCheckChange"
                    :maxlength="30"
                  />
                </Tooltip>
              </Col>
            </Row>
          </Alert>

          <Alert v-if="identification_info.accountType=='alipay'">
            <Row class="box">
              <Col span="3" class="left-text">
                <span style="color:red">*</span>支付宝账号
              </Col>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多30位" placement="right">
                  <Input
                    type="text"
                    v-model="identification_info.aliAccount"
                    style="width:300px"
                    placeholder="请输入支付宝账号"
                    @on-change="statusCheckChange"
                    :maxlength="30"
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row class="box">
              <Col span="3" class="left-text">
                <span style="color:red">*</span>支付宝账号姓名
              </Col>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多20个汉字" placement="right">
                  <Input
                    type="text"
                    v-model="identification_info.aliName"
                    style="width:300px"
                    placeholder="请输入法人支付宝账号姓名"
                    @on-change="statusCheckChange"
                    :maxlength="20"
                  />
                </Tooltip>
              </Col>
            </Row>
          </Alert>

          <Alert v-if="identification_info.accountType=='weixin'">
            <Row class="box">
              <Col span="3" class="left-text">
                <span style="color:red">*</span>微信账号
              </Col>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多20位" placement="right">
                  <Input
                    type="text"
                    v-model="identification_info.wxAccount"
                    style="width:300px"
                    placeholder="请输入微信账号"
                    @on-change="statusCheckChange"
                    :maxlength="20"
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row class="box">
              <Col span="3" class="left-text">
                <span style="color:red">*</span>微信账号姓名
              </Col>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
                  <Input
                    type="text"
                    v-model="identification_info.wxName"
                    style="width:300px"
                    placeholder="请输入法人微信账号姓名"
                    @on-change="statusCheckChange"
                    :maxlength="10"
                  />
                </Tooltip>
              </Col>
            </Row>
          </Alert>

          <Row style="{'margin-top':'54px'}">
            <Alert
              type="warning"
              show-icon
              v-if="isCheckDisabled == true"
              style="width:500px"
            >修改后才能保存</Alert>
            <Button
              type="info"
              @click="goback()"
              style="width:110px;margin-right: 20px; float: left;"
            >取 &nbsp&nbsp&nbsp 消</Button>
            <Button
              type="info"
              @click="changeTab()"
              style="width:110px;margin-right: 20px; float: left;"
            >返回上一步</Button>
            <Button
              type="primary"
              @click="identification_add()"
              :loading="edit_loading"
              style="width:240px; float: left"
              :disabled="isCheckDisabled"
            >保存</Button>
          </Row>
        </Row>
      </Card>
    </TabPane>
  </Tabs>
</template>

<script>
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";
import ImgCutter from "@/components/ImgCutter.vue";
import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import { formatDate, checkImageWH, checkImage } from "@/libs/date";

export default {
  name: "BasicSet",
  components: {
    ImgCutter
  },
  props: {
    merchantId: String
  },
  data() {
    return {
      imgArrIndex: null, //商户图片数组index
      identification_info: {
        merchantId: "",
        businessLicenseName: "",
        uniformSocialCreditCode: "",
        businessLicenseImg: "",
        corporation: "",
        idCard: "",
        idCardImgFront: "",
        idCardImgBehind: "",
        accountType: "",
        bankCardUsername: "",
        bankCardCode: "",
        bankCardAddress: "",
        wxAccount: "",
        wxName: "",
        aliAccount: "",
        aliName: ""
      },
      currentTab: "info",
      spinShow: false,
      receiveRuleSetPage: false,
      visible: false,
      imgName: "",
      edit_info: {
        merchantProfileList: [],
        address: "",
        logoImg: "",
        name: "",
        merchantId: "",
        provinceCode: "",
        cityCode: "",
        areaCode: "",
        industryId: "",
        mainBrandId: "",
        secendBrandIdList: [],
        shopIdList: [],
        operatingStatus: "",
        telephone: "",
        merchantShopImageList: [{ imgUrl: "" }]
      },
      res_list: [],
      edit_loading: false,
      userToken: "",
      campId: "",
      imgUrl: "",
      url: uploadOperationImage2AliOssURl,
      uploadList1: [],
      bsUploadList: [],
      idcFrontUploadList: [],
      idcBehindUploadList: [],
      camp_pageStatus: "",
      getUrl: "",
      msg: "",
      isCheckDisabled: true,
      reqParams: {},
      delIds: [],
      one_index: "",
      two_index1: "",
      two_index2: "",
      provincelist: [],
      citylist: [],
      arealist: [],
      logeImgSrc: "",
      logImgSize: 0,
      mainBrandList: [],
      mainBrandId: "",
      secendBrandList: [],
      mainIndustryId: "",
      mainMainBrandId: "",
      mainIndustryList: [],
      secendIndustryList: [],
      shopList: [],

      compatibleList: [], //兼容品牌
      mainBrandList2: [],
      secendBrandList2: []
    };
  },

  created: function() {
    this.userToken = { jwttoken: localStorage.getItem("jwttoken") };
  },
  methods: {
    //切换tab
    changeTab() {
      if (this.currentTab == "info") {
        this.currentTab = "identification";
      } else if (this.currentTab == "identification") {
        this.currentTab = "info";
      }
    },

    // 增加兼容品牌
    compatible_addInfo() {
      if (this.compatibleList.length >= 5) {
        this.$Message.error("兼营品牌最多为5个");
        return;
      } else {
        this.compatibleList.push({
          mainBrandId: "",
          secendBrandId: "",
          secendBrandList: []
        });
      }
      this.isCheckDisabled = false;
    },

    // 删除兼容品牌
    compatible_delInfo(index, item) {
      this.compatibleList.splice(index, 1);
      this.isCheckDisabled = false;
    },

    //查询所有商超列表列表
    getShopList() {
      postRequest("/system/sys-shop-info/all").then(res => {
        if (res.code == 200) {
          this.shopList = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //查询所有一级行业列表
    getIndustryMaindList() {
      postRequest("/merchant/industryMain/all").then(res => {
        if (res.code == 200) {
          this.mainIndustryList = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //查询所有二级列表，根据一级行业id
    getIndustrySecendList(obj) {
      if (obj && obj != null) {
        getRequest("/merchant/industrySecond/all/" + obj).then(res => {
          if (res.code == 200) {
            this.secendIndustryList = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
        this.isCheckDisabled = false;
      }
    },
    //获取所有主品牌列表
    getMainBrandlist() {
      postRequest("/merchant/brandMain/all").then(res => {
        if (res.code == 200) {
          this.mainBrandList = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    getBrandSecendList(obj) {
      if (obj && obj != null) {
        getRequest("/merchant/brandSecond/all/" + obj).then(res => {
          if (res.code == 200) {
            this.secendBrandList = res.data;
          } else {
            this.$Message.error(res.msg);
          }
        });
        this.isCheckDisabled = false;
      }
    },
    getBrandSecendList2(index, obj) {
      getRequest("/merchant/brandSecond/all/" + obj).then(res => {
        if (res.code == 200) {
          this.compatibleList[index].secendBrandList = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
      this.isCheckDisabled = false;
    },
    //获取省份信息数据
    getprovincelist() {
      postRequest("/system/area/province/list").then(res => {
        if (res.code == 200) {
          this.provincelist = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //根据省份code获取城市信息数据

    getcitylist(obj) {
      getRequest("/system/area/city/" + obj).then(res => {
        if (res.code == 200) {
          this.citylist = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
      this.isCheckDisabled = false;
    },
    //根据城市code获取区县信息数据
    getarealist(obj) {
      getRequest("/system/area/district/" + obj).then(res => {
        if (res.code == 200) {
          this.arealist = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
      this.isCheckDisabled = false;
    },

    showSize() {
      //获取base64图片大小，返回MB数字
      var base64url = this.logeImgSrc;
      var str = base64url.replace("data:image/png;base64,", "");
      var equalIndex = str.indexOf("=");
      if (str.indexOf("=") > 0) {
        str = str.substring(0, equalIndex);
      }
      var strLength = str.length;
      var fileLength = parseInt(strLength - (strLength / 8) * 2);
      // 由字节转换为MB
      var size = "";
      size = (fileLength / 1024).toFixed(2);
      var sizeStr = size + ""; //转成字符串
      var index = sizeStr.indexOf("."); //获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
      if (dou == "00") {
        //判断后两位是否为00，如果是则删除00
        this.logImgSize =
          sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
      }
      this.logImgSize = size;
    },

    cutDown: function(res) {
      this.logeImgSrc = res.dataURL;
      this.showSize();
      if (this.logImgSize > 1024) {
        this.$Message.error("图片不能大于1M");
        return;
      }
      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };
      postRequest(
        "/operation/operation-info/uploadBase64Image2AliOss",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.edit_info.logoImg = res.image_url;
        } else {
          this.$Message.error(res.msg);
        }
      });
      this.isCheckDisabled = false;
    },

    // 新增商户门店图片
    addImgArr() {
      if (this.edit_info.merchantShopImageList.length == 8) {
        this.msgErr("最多只能增加8张");
        return;
      }
      this.edit_info.merchantShopImageList.push({ imgUrl: "" });
    },

    // 删除商户门店图片
    delImgArr(index) {
      if (this.edit_info.merchantShopImageList[index].id) {
        this.edit_info.delShopImgIds.push(
          this.edit_info.merchantShopImageList[index].id
        );
      }
      this.edit_info.merchantShopImageList.splice(index, 1);
    },

    // 商户门店图片 记录index
    cutDownNum(index) {
      this.imgArrIndex = index;
    },

    // 商户门店图片
    cutDownArr: function(res) {
      // this.logeImgSrc = res.dataURL;
      this.showSize();
      if (this.logImgSize > 1024) {
        this.$Message.error("图片不能大于1M");
        return;
      }
      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };
      postRequest(
        "/operation/operation-info/uploadBase64Image2AliOss",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.edit_info.merchantShopImageList[this.imgArrIndex].imgUrl =
            res.image_url;
        } else {
          this.$Message.error(res.msg);
        }
      });
      this.isCheckDisabled = false;
    },

    init() {
      this.camp_pageStatus = this.getStore("camp_pageStatus");
      this.getCampInfo();
      this.getindustryTemplate();
      this.getprovincelist();
      this.getMainBrandlist();
      this.getIndustryMaindList();
      this.getShopList();
    },
    getCampInfo() {
      if (this.camp_pageStatus == "add") {
        this.addInfo();
      } else if (this.camp_pageStatus == "edit") {
        this.editInfo();
      } else if (this.camp_pageStatus == "copy") {
        this.editInfo();
        this.merchantId = "";
        this.edit_info.merchantId = "";
      }
    },
    //新增
    addInfo() {
      this.edit_info = {
        merchantProfileList: [],
        address: "",
        logoImg: "",
        name: "",
        merchantId: "",
        provinceCode: "",
        cityCode: "",
        areaCode: "",
        industryId: "",
        mainBrandId: "",
        secendBrandIdList: [],
        shopIdList: [],
        operatingStatus: "",
        telephone: "",
        merchantShopImageList: [{ imgUrl: "" }]
      };
    },

    //编辑
    editInfo() {
      var reqParams = {
        merchantId: this.merchantId
      };
      this.spinShow = true;
      postRequest(
        "/merchant/merchantInfo/selectById?merchantId=" + this.merchantId,
        reqParams
      ).then(res => {
        this.spinShow = false;
        if (res.code == 200) {
          this.edit_info = res.data;
          console.info(JSON.stringify(res.data));

          console.log("mounted:", this.edit_info.merchantProfileList);

          this.identification_info.merchantId = res.data.merchantId;

          this.edit_info.provinceCode = res.data.provinceCode;
          this.edit_info.cityCode = res.data.cityCode;
          this.edit_info.areaCode = res.data.areaCode;

          // 商户门店图片
          this.edit_info.merchantShopImageList = res.data.merchantShopImageList;
          this.edit_info.delShopImgIds = [];

          this.mainIndustryId = parseInt(res.data.mainIndustryId);
          this.edit_info.industryId = parseInt(res.data.industryId);
          this.edit_info.mainBrandId = parseInt(res.data.mainBrandId);
          this.mainMainBrandId = parseInt(res.data.mainMainBrandId);

          this.getIndustrySecendList(res.data.mainIndustryId);
          this.getBrandSecendList(this.mainMainBrandId);

          this.getprovincelist();
          this.getcitylist(res.data.provinceCode);
          this.getarealist(res.data.cityCode);
          this.getMainBrandlist();

          if (res.data.merchantIdentificationInfo) {
            this.identification_info = res.data.merchantIdentificationInfo;
            this.bsUploadList = [
              { url: res.data.merchantIdentificationInfo.businessLicenseImg }
            ];
            this.idcFrontUploadList = [
              { url: res.data.merchantIdentificationInfo.idCardImgFront }
            ];
            this.idcBehindUploadList = [
              { url: res.data.merchantIdentificationInfo.idCardImgBehind }
            ];
          }

          let iii = 0;
          if (res.data.secendBrandList) {
            for (var i of res.data.secendBrandList) {
              this.compatibleList.push({
                mainBrandId: parseInt(i.mainBrandId),
                secendBrandId: parseInt(i.secondBrandId),
                secendBrandList: []
              });

              this.getBrandSecendList2(iii, parseInt(i.mainBrandId));
              iii++;
            }
          }

          if (this.edit_info.merchantProfileList) {
            for (var i of this.edit_info.merchantProfileList) {
              if (i.contents.length > 0) {
                i.contents = JSON.parse(i.contents);
              }
            }
          }
          this.uploadList = [{ url: res.data.logoImg }];
          this.logeImgSrc = res.data.logoImg;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },

    //获取商业数据
    getindustryTemplate() {
      const reqParams = {
        dictCode: "merchant_industry"
      };

      postRequest(
        "/system/sys-dict-data/list?pageNum=1&pageSize=30",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.res_list = res.data.records;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    //保存认证信息
    identification_add() {
      console.info(JSON.stringify(this.identification_info));
      if (this.identification_info.businessLicenseName == "") {
        this.$Message.error("请填写营业执照名称");
        return;
      }
      if (this.identification_info.uniformSocialCreditCode == "") {
        this.$Message.error("请填写统一社会信用代码");
        return;
      }
      if (this.identification_info.businessLicenseImg == "") {
        this.$Message.error("请上传营业执照图片");
        return;
      }
      if (this.identification_info.corporation == "") {
        this.$Message.error("请填写法人姓名");
        return;
      }
      if (this.identification_info.idCard == "") {
        this.$Message.error("请填写法人身份证号");
        return;
      }
      if (this.identification_info.idCardImgFront == "") {
        this.$Message.error("请上传身份证正面");
        return;
      }
      if (this.identification_info.idCardImgBehind == "") {
        this.$Message.error("请上传身份证背面");
        return;
      }
      /*if (this.identification_info.accountType == "") {
                                    this.$Message.error("请选择资金类型");
                                    return;
                                }*/
      if (this.identification_info.accountType == "bank") {
        if (this.identification_info.bankCardUsername == "") {
          this.$Message.error("请填写持卡人姓名");
          return;
        }
        if (this.identification_info.bankCardCode == "") {
          this.$Message.error("请填写卡号");
          return;
        }
        if (this.identification_info.bankCardAddress == "") {
          this.$Message.error("请填写开户行");
          return;
        }
      } else if (this.identification_info.accountType == "weixin") {
        if (this.identification_info.wxAccount == "") {
          this.$Message.error("请填写微信账号");
          return;
        }
        if (this.identification_info.wxName == "") {
          this.$Message.error("请填写微信账号姓名");
          return;
        }
      } else if (this.identification_info.accountType == "alipay") {
        if (this.identification_info.aliAccount == "") {
          this.$Message.error("请填写支付宝账号");
          return;
        }
        if (this.identification_info.aliName == "") {
          this.$Message.error("请填写支付宝账号姓名");
          return;
        }
      }

      // 商户门店列表
      for (let i = 0; i < this.edit_info.merchantShopImageList.length; i++) {
        let index = i + 1;
        if (!this.edit_info.merchantShopImageList[i].imgUrl) {
          this.msgErr("商户图片" + index + "没有上传");
          return;
        }
      }

      if (this.camp_pageStatus === "add" || this.camp_pageStatus === "copy") {
        this.getUrl = "/merchant/merchantInfo/add";
        this.msg = "新增成功";
        this.reqParams = {
          address: this.edit_info.address,
          logoImg: this.edit_info.logoImg,
          merchantProfileList: this.edit_info.merchantProfileList,
          name: this.edit_info.name,
          provinceCode: this.edit_info.provinceCode,
          cityCode: this.edit_info.cityCode,
          areaCode: this.edit_info.areaCode,
          industryId: this.edit_info.industryId,
          mainBrandId: this.edit_info.mainBrandId,
          shopIdList: this.edit_info.shopIdList,
          operatingStatus: this.edit_info.operatingStatus,
          telephone: this.edit_info.telephone,
          merchantShopImageList: this.edit_info.merchantShopImageList
          // delShopImgIds: this.edit_info.delShopImgIds
        };
        if (this.compatibleList) {
          var secendBrandIdList = [];
          for (var i of this.compatibleList) {
            secendBrandIdList.push(parseInt(i.secendBrandId));
          }
          this.reqParams.secendBrandIdList = secendBrandIdList;
        }
      } else {
        this.getUrl = "/merchant/merchantInfo/edit";
        this.msg = "编辑成功";
        this.reqParams = {
          merchantId: this.edit_info.merchantId,
          delIds: this.delIds.join(),
          address: this.edit_info.address,
          logoImg: this.edit_info.logoImg,
          merchantProfileList: this.edit_info.merchantProfileList,
          name: this.edit_info.name,
          provinceCode: this.edit_info.provinceCode,
          cityCode: this.edit_info.cityCode,
          areaCode: this.edit_info.areaCode,
          industryId: this.edit_info.industryId,
          mainBrandId: this.edit_info.mainBrandId,
          shopIdList: this.edit_info.shopIdList,
          operatingStatus: this.edit_info.operatingStatus,
          telephone: this.edit_info.telephone,
          merchantShopImageList: this.edit_info.merchantShopImageList,
          delShopImgIds: this.edit_info.delShopImgIds.join()
        };
        if (this.compatibleList) {
          var secendBrandIdList = [];
          for (var i of this.compatibleList) {
            secendBrandIdList.push(parseInt(i.secendBrandId));
          }
          this.reqParams.secendBrandIdList = secendBrandIdList;
        }
      }

      this.edit_loading = true;
      this.spinShow = true;
      postRequest(this.getUrl, this.reqParams).then(res => {
        this.edit_loading = false;
        if (res.code == 200) {
          if (
            this.camp_pageStatus === "add" ||
            this.camp_pageStatus === "copy"
          ) {
            this.identification_info.merchantId = res.data.merchantId;
            this.edit_info.merchantId = res.data.merchantId;
          }

          postRequest(
            "/merchant/merchantInfo/identification/add",
            this.identification_info
          ).then(res => {
            this.edit_loading = false;
            if (res.code == 200) {
              this.spinShow = false;
              this.$Message.info(this.msg);
              setTimeout(() => {
                this.goback();
              }, 100);
            } else {
              this.spinShow = false;
              this.$Message.error(res.msg);
            }
          });
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    //保存
    campagin_add() {
      console.info(JSON.stringify(this.edit_info));
      for (var i = 0; i < this.edit_info.merchantProfileList.length; i++) {
        if (this.edit_info.merchantProfileList[i].profile === "") {
          this.$Message.error("官网简介" + [i + 1] + "的商户简介不能为空");
          return;
        }
        for (
          var j = 0;
          j < this.edit_info.merchantProfileList[i].contents.length;
          j++
        ) {
          if (
            this.edit_info.merchantProfileList[i].contents[j].imagesList
              .length == 0
          ) {
            this.$Message.error(
              "官网简介" +
                [i + 1] +
                "的内容简介" +
                [j + 1] +
                "业务图片至少为一张"
            );
            return;
          }
        }
      }

      if (this.edit_info.name == "") {
        this.$Message.error("请填写商户名称");
        return;
      }

      if (this.edit_info.logoImg == "") {
        this.$Message.error("请上传商户logo");
        return;
      }

      if (this.edit_info.mainBrandId == "" || this.mainMainBrandId == "") {
        this.$Message.error("请选择主营品牌");
        return;
      }

      for (var i of this.compatibleList) {
        if (i.mainBrandId != "" && i.secendBrandId == "") {
          this.$Message.error("请选择兼营品牌");
          return;
        }
      }

      if (this.edit_info.industryId == "" || this.mainIndustryId == "") {
        this.$Message.error("请选择商户行业");
        return;
      }

      if (
        this.edit_info.provinceCode == null ||
        this.edit_info.provinceCode == ""
      ) {
        this.$Message.error("请填写商户所在省份");
        return;
      }

      if (this.edit_info.cityCode == null || this.edit_info.cityCode == "") {
        this.$Message.error("请填写商户所在城市");
        return;
      }

      if (this.edit_info.areaCode == null || this.edit_info.areaCode == "") {
        this.$Message.error("请填写商户所在区县");
        return;
      }

      if (this.edit_info.address == "") {
        this.$Message.error("请填写商户所在详细地址");
        return;
      }

      if (this.edit_info.shopIdList.length == 0) {
        this.$Message.error("请选择周边商超");
        return;
      }

      if (this.edit_info.operatingStatus == "") {
        this.$Message.error("请选择营业状态");
        return;
      }
      setTimeout(() => {
        this.changeTab();
      }, 100);
    },

    goback() {
      this.$emit("changeStatus", false);
    },

    //上传图片
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.edit_info.logoImg = res.image_url;

        if (this.uploadList.length == 0) {
          let obj = {
            url: res.image_url
          };
          this.uploadList.push(obj);
        } else {
          this.uploadList[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },

    //上传营业执照图片
    bsHandleSuccess(res, file) {
      if (res.code == 200) {
        this.identification_info.businessLicenseImg = res.image_url;
        if (this.bsUploadList.length == 0) {
          let obj = {
            url: res.image_url
          };
          this.bsUploadList.push(obj);
        } else {
          this.bsUploadList[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },

    //上传身份证正面图片
    idcFrontHandleSuccess(res, file) {
      if (res.code == 200) {
        this.identification_info.idCardImgFront = res.image_url;

        if (this.idcFrontUploadList.length == 0) {
          let obj = {
            url: res.image_url
          };
          this.idcFrontUploadList.push(obj);
        } else {
          this.idcFrontUploadList[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },

    //上传身份证背面图片
    idcBehindHandleSuccess(res, file) {
      if (res.code == 200) {
        this.identification_info.idCardImgBehind = res.image_url;

        if (this.idcBehindUploadList.length == 0) {
          let obj = {
            url: res.image_url
          };
          this.idcBehindUploadList.push(obj);
        } else {
          this.idcBehindUploadList[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },

    formatError() {
      this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
    },

    handleMaxSize(file) {
      this.$Message.error("图片不大于1M");
    },

    handleBeforeUpload(file) {
      return checkImage(file);
    },

    // 添加
    addOneList() {
      if (this.edit_info.merchantProfileList.length >= 5) {
        this.$Message.error("官网简介最多为5个");
        return;
      } else {
        this.edit_info.merchantProfileList.push({
          merchantId: this.edit_info.merchantId,
          profile: "",
          contents: []
        });
      }
    },
    addTwoList(index) {
      this.edit_info.merchantProfileList[index].contents.push({
        content: "",
        images: [],
        imagesList: []
      });
      this.uploadList1 = [];
    },
    uploadIMG(index, index1) {
      this.one_index = index;
      this.two_index1 = index1;

      this.isCheckDisabled = false;
    },
    //上传图片
    handleTwoSuccess(res, file) {
      // if (this.camp_pageStatus == "add") {
      this.uploadList1 = this.edit_info.merchantProfileList[
        this.one_index
      ].contents[this.two_index1].imagesList;
      if (res.code == 200) {
        if (this.uploadList1.length < 4) {
          let obj = {
            url: res.image_url
          };
          this.uploadList1.push(obj);
          this.$Message.info("上传图片成功");
          this.two_index2 = "";
        } else {
          this.$Message.error("上传图片最多4张");
        }
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }

      this.isCheckDisabled = false;

      this.setIMG(this.one_index, this.two_index1);
    },

    handleTwoView(item) {
      this.imgName = item.url;
      this.visible = true;
    },
    handleTwoRemove(index11, index, index1) {
      this.edit_info.merchantProfileList[index].contents[
        index1
      ].imagesList.splice(index11, 1);
      this.edit_info.merchantProfileList[index].contents[index1].images.splice(
        index11,
        1
      );

      this.isCheckDisabled = false;
    },

    setIMG(index, index1) {
      if (this.camp_pageStatus == "add") {
        if (
          this.edit_info.merchantProfileList[index].contents[index1].imagesList
            .length > 4
        ) {
          this.$Message.error("上传图片最多4张,请删除再上传");
          return;
        } else {
          this.edit_info.merchantProfileList[index].contents[
            index1
          ].imagesList = this.uploadList1;
          this.edit_info.merchantProfileList[index].contents[
            index1
          ].images = [];
          for (var i of this.uploadList1) {
            this.edit_info.merchantProfileList[index].contents[
              index1
            ].images.push(i.url);
          }
        }
      } else if (
        this.camp_pageStatus == "edit" ||
        this.camp_pageStatus == "copy"
      ) {
        if (
          this.edit_info.merchantProfileList[index].contents[index1].imagesList
            .length > 4
        ) {
          this.$Message.error("上传图片最多4张,请删除再上传");
          return;
        } else {
          this.uploadList1 = this.edit_info.merchantProfileList[index].contents[
            index1
          ].imagesList;
          this.edit_info.merchantProfileList[index].contents[
            index1
          ].images = [];

          for (var i of this.uploadList1) {
            this.edit_info.merchantProfileList[index].contents[
              index1
            ].images.push(i.url);
          }
        }
      }
    },

    // 删除
    removeOneList(index, item) {
      if (item.id) {
        this.delIds.push(item.id);
      }

      this.edit_info.merchantProfileList.splice(index, 1);
      this.isCheckDisabled = false;
    },

    removeTwoList(index, index1) {
      this.edit_info.merchantProfileList[index].contents.splice(index1, 1);
      this.isCheckDisabled = false;
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
  },
  mounted() {
    this.init();
  }
};
</script>


<style>
.form {
  width: 900px;
}
.form > div {
  display: inline-block;
}
.demo-upload-list {
  display: inline-block;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.imgSrc_box {
  float: left;
  width: 90px;
  height: 90px;
  line-height: 90px;
  margin-right: 10px;
  border: 1px dashed #dcdee2;
  background: #fff;
}

.left-text {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 12px;
  color: #515a6e;
  line-height: 1;
  padding: 10px 12px 10px 0;
  box-sizing: border-box;
}
.left-text h4 {
  display: inline-block;
  font-size: 14px;
}
.box {
  margin-bottom: 20px;
}
</style>
