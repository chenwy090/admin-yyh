<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>

<template>
    <div class="home-main">

        <Row :gutter="10">
            <Col :md="24" :lg="8">
            <Row class-name="home-page-row1" :gutter="10">
                <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                <Card>
                    <Row type="flex" class="user-infor">
                        <Col span="8">
                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                            <img class="avator-img" src="../../assets/profile.jpg" />
                        </Row>
                        </Col>
                        <Col span="16" style="padding-left:6px;">
                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                            <div>
                                <b class="card-user-infor-name">{{ userInfo.username }}</b>
                                <p>欢迎您的使用</p>
                            </div>
                        </Row>
                        </Col>
                    </Row>
                    <div class="line-gray"></div>
                    
                    <Row class="margin-top-8"  justify="end">
                        <Col span="8">
                        <p class="notwrap">所属部门:</p>
                        </Col>
                        <Col span="16" class="padding-left-8" style="color:red">{{userInfo.deptName}}</Col>
                    </Row>
                </Card>
                </Col>
              <Col :md="12" :lg="24" style="margin-bottom: 10px; ">
              
                <Card>
                    <p slot="title" class="card-title">
                        <Icon  size="20" style="margin-bottom:3px;" />
                        <a target="_blank"> 当前版本：v1.0  </a>
                    </p>
                  
                    <div class="to-do-list-con">
                         <Timeline>
                         <TimelineItem color="green">
                            <Icon type="ios-trophy" slot="dot"></Icon>
                             <p class="time">2019年</p>
                          <p class="content">发布v1.0版本</p>
                        </TimelineItem> 
                         <TimelineItem color="green">
                            <p class="time">2019年</p>
                          <p class="content">开发v1.0版本</p>


                         </TimelineItem>
                          <TimelineItem color="yellow">
                             <p class="time">2019年</p>
                         <p class="content">开发v1.0版本</p>

                          </TimelineItem>
                          <TimelineItem color="blue">
                             <p class="time">2019年</p>
                          <p class="content">开发v1.0版本</p>
                          </TimelineItem>

                        <TimelineItem color="red">
                             <p class="time">2019年</p>
                            <p class="content">开发v1.0版本</p>
                          </TimelineItem>

                      </Timeline>
                    </div>
                </Card>
                </Col>
            </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card id-name="user_created_count" :end-val="count.createUser" iconType="md-person-add" color="#2d8cf0" intro-text="今日新增用户"></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card id-name="visit_count" :end-val="count.visit" iconType="ios-eye" color="#64d572" :iconSize="50" intro-text="今日浏览量"></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card id-name="collection_count" :end-val="count.collection" iconType="md-cloud-upload" color="#ffd572" intro-text="今日数据采集量"></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card id-name="transfer_count" :end-val="count.transfer" iconType="md-shuffle" color="#f25e43" intro-text="今日服务调用量"></infor-card>
                    </Col>
                </Row>
                <Row>
             <Col :md="24" :lg="24" style="margin-top: 18px;">
                <Card :padding="0">
                    <p slot="title" class="card-title">
                        <Icon type="md-locate"></Icon>
                        今日服务调用地理分布
                    </p>
                    <div class="map-con">
                        <Col span="10">
                        <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>
                        </Col>
                        <Col span="14" class="map-incon">
                        <Row type="flex" justify="center" align="middle">
                            <home-map :city-data="cityData"></home-map>
                        </Row>
                        </Col>
                    </div>
                </Card>
            </col>
                 
                </Row>
            </Col>
        </Row>
        <Row :gutter="10">
            <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="md-map"></Icon>
                    每日来访量统计
                </p>
                <div class="data-source-row">
                    <visite-volume></visite-volume>
                </div>
            </Card>
            </Col>
          
        </Row>
    
    </div>
</template>

<script>
import { ipInfo } from "@/api/index";
import cityData from "./map-data/get-city-value.js";
import homeMap from "./components/map.vue";
import visiteVolume from "./components/visiteVolume.vue";
import userFlow from "./components/userFlow.vue";
import countUp from "./components/countUp.vue";
import inforCard from "./components/inforCard.vue";
import mapDataTable from "./components/mapDataTable.vue";



export default {
  name: "home",
  components: {
    homeMap,
    visiteVolume,
    userFlow,
    countUp,
    inforCard,
    mapDataTable
  },
  data() {
    return {
      showVideo: false,
      count: {
        createUser: 496,
        visit: 3264,
        collection: 24389305,
        transfer: 39503498
      },
      cityData: cityData,
      newToDoItemValue: "",
      city: "",
    userInfo:"",
    };
  },
  computed: {
    avatarPath() {
      return localStorage.avatorImgPath;
    }
  },
  methods: {
 
    init() {
      this.userInfo = JSON.parse(this.getStore("userInfo"));
   
    
    }
  },
  mounted() {
    this.init();
  
  
  }
};
</script>
