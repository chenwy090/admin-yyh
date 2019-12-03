<template>
	<Row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submitLogin">
	
		<Row class="signinpanel">
	
			<Row class="left_signin ">
	
	
				<h1>欢迎使用 <strong style="color:#ffffff">知而行 后台管理系统</strong></h1>
				<ul  style="margin-top: 9%">
					<li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> SpringBoot</li>
					<li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> Mybatis</li>
					<li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> Vue</li>
					<li><i class="fa fa-arrow-circle-o-right m-r-xs"></i>iView</li>
					<li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> ES6/7</li>
					<li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> axios</li>
				</ul>
				<strong>还没有账号？ <a href="#">请联系相关人员开通&raquo;</a></strong>
	
	
	
			</Row>
	
			<Row class="right_signin ">
	
				<Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>
	
					<Form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
					
						<FormItem prop="username">
							<Input v-model="form.username" prefix="ios-contact" size="large" clearable placeholder="请输入用户名" autocomplete="off" />
						</FormItem>
						<FormItem prop="password">
							<Input type="password" v-model="form.password" prefix="ios-lock" size="large" clearable placeholder="请输入密码" autocomplete="off" />
						</FormItem>
						<Row>
							<Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
					                            <span v-if="!loading">登录</span>
					                            <span v-else>登录中...</span>
					                        </Button>
						</Row>
					</Form>
			
	
			</Row>
	
	

				<Row  style="width:100%">
						&copy; 2018 All Rights Reserved. 知而行（上海）营销咨询有限公司 <br>
						<a href="www.sweetmartmarketing.com" target="_blank" rel="nofollow">粤ICP备05081589号-2</a><br>
					</Row>
			</Row>	
			
	</Row>
	
</template>

<script>
	import Cookies from "js-cookie";
	import {
		login,
		userInfo
	
	} from "@/api/index";
	import util from "@/libs/util.js";
	export default {
		data() {
	
			return {
				error: false,
				errorMsg: "",
				tabName: "username",
	
				loading: false,
				sending: false,
				sended: false,
				count: 60,
				countButton: "60 s",
				maxLength: 6,
				errorCode: "",
				form: {
						username: "",
					password: "",
					code: ""
				},
				rules: {
					username: [{
						required: true,
						message: "账号不能为空",
						trigger: "blur"
					}],
					password: [{
						required: true,
						message: "密码不能为空",
						trigger: "blur"
					}],
	
				}
			};
		},
		methods: {
			showErrorMsg(msg) {
				this.error = true;
				this.errorMsg = msg;
			},
	
	
			submitLogin() {
	
	
				this.$refs.usernameLoginForm.validate(valid => {
					if (valid) {
						this.loading = true;
						login({
							loginName: this.form.username,
							password: this.form.password,
	
						}).then(res => {
							if (res.isSuccess) {
								// this.setStore("jwttoken", "11");
								// 获取用户信息
								const userInfo = {
									username: res.userName,
									userId: "",
									userPath: "",
									deptName:res.deptName,
									loginName: this.form.username,
								};
	
	
								Cookies.set("userInfo", JSON.stringify(userInfo));
	
								this.setStore("userInfo", userInfo);
								// this.$store.commit("setuserPath", res.userName);
								// 加载菜单
								util.initRouter(this);
								this.$router.push({
									name: "home_index"
								});
	
	
							} else {
								this.loading = false;
								this.$Message.error(res.msg)
							}
						});
					}
				});
	
	
	
	
	
			},
	
	
	
	
		},
		mounted() {
	
      this.$Spin.hide();
	
		}
	};
</script>

<style lang="less">
	@import "./login.less";
</style>
