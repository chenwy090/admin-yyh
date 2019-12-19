new Vue({
  el: "#container",
  data: function () {
    return {
      baseUrl: '', //接口地址
      token: '', //用户登录信息
      templateId: '', // 券id
      success: 0,
      showMore: false,
      couponData: {
        // title1: '免费体验儿童街舞课',
        // couponType: '赠品券',
        // title2: 'D2M舞蹈教室免费体验儿童街舞',
        // time: '2019.12.11——2020.01.31',
        // rule: '舞蹈教室免费体验童街舞',
        // details:'<p>支付券测试-请勿动<img src="https://image.52ash.cn/wx_mini/I3OqoTBwCr.jpg" style="max-width: 100%;"></p>'
      },
    };
  },
  filters: {
    time(val) {
      if (val) {
        let value = val.slice(0, 10)
        return value
      }
    }
  },
  created: function () {
    this.getUrlKey()
    // this.templateId = '20191212040171'
    // this.getCouponData()
    // console.log(this.templateId);
  },
  computed: {
    address() {
      return Number(Math.random() * 999).toFixed(1)
    }
  },
  methods: {
    // 根据id获取数据
    getCouponData() {
      console.log("token", this.token);
      let url = `${this.baseUrl}zex-mgr/merchantCouponTemplate/getMerchantCouponDetail`;
      // axios.get(
      //   url, {
      //   params: { templateId: this.templateId },
      //   headers: {
      //     jwttoken: this.token
      //   }
      // }
      // )
      axios({
        method: 'get',
        url,
        params: { templateId: this.templateId },
        headers: {
          'jwttoken': this.token
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            var useDesc = res.data.data.useDesc
            if (useDesc) {
              res.data.data.useDesc = useDesc.split(/\r|\n|\r\n|\\n/)
            }
            this.couponData = res.data.data
          }
          this.success = res.data.code
        })
    },
    // 获取url参数
    getUrlKey() {
      this.templateId = decodeURIComponent((new RegExp('[?|&]' + 'templateId' + '=' + '([^&;]+?)(&|#|;|$)').exec(
        window.location.href) || [, ""])[1]
        .replace(/\+/g, '%20')) || null
      this.token = decodeURIComponent((new RegExp('[?|&]' + 'token' + '=' + '([^&;]+?)(&|#|;|$)').exec(
        window.location.href) || [, ""])[1]
        .replace(/\+/g, '%20')) || null

      // 接口地址
      let baseUrl = decodeURIComponent((new RegExp('[?|&]' + 'env' + '=' + '([^&;]+?)(&|#|;|$)').exec(
        window.location.href) || [, ""])[1]
        .replace(/\+/g, '%20')) || null

      if (baseUrl == 'dev') {
        this.baseUrl = 'http://192.168.31.114:8088/'
      } else if (baseUrl == 'test') {
        // this.baseUrl = 'http://192.168.31.134:8088/'
        this.baseUrl = 'http://crmt.52ash.cn/'

      } else if (baseUrl == 'review') {
        this.baseUrl = 'http://192.168.31.123:8088/'
      } else if (baseUrl == 'prod') {
        this.baseUrl = 'http://crm.52iuh.com:8088/'
      }

      // this.templateId = '20191212040171'
      // this.token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6ImRmNDllYzQ4ZTU2NTIyZDExMTUxZmI5ZWNkNjgzYWVmIiwibG9naW5OYW1lIjoidGVzdCIsImV4cCI6MTU3NjIyODU5NiwidXNlcklkIjoiOTk5OSJ9.N8IGtJH6cS0SovOhHlYw68f_KWtbr6gHoaogrFstGVw'
      if (this.templateId && this.token && this.baseUrl) {
        this.getCouponData()
      }

    },

    showMore() {
      console.info('ok')
    }
  }
});
