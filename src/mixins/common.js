export default {
    data() {
        return {
            m_dateOptions: {
                disabledDate: (date) => {
                    if (date.valueOf() < new Date().valueOf() - 1 * 24 * 3600 * 1000) {
                        return true;
                    }
                }
            }
        }
    },
    methods: {
        setData(obj, context) {
          let _vm = this;
          if (Object.prototype.toString.call(context) === '[object Object]') {
            _vm = context;
          }
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              let _key = _vm;
              let keys = key.split('.');
              // 针对 this.setData({'a.b.c', 6});
              keys.forEach((el, i )=>{
                if (i + 1 === keys.length) {
                  _key[el] = obj[key];
                } else {
                  _key = _key[el]
                }
              });
              _vm[key] = obj[key];
            }
          }
        },
        m_filterParams(e) {
            let obj = JSON.parse(JSON.stringify(e));
            if (Object.prototype.toString.call(e) !== '[object Object]') {
                return obj;
            }
            for (let k in obj) {
                if (!obj[k] || obj[k] === 'undefined') {
                    delete obj[k];
                }
            }
            return obj
        },
        m_cloneObj(e) {
            if (Object.prototype.toString.call(e) !== '[object Object]') {
                return e;
            }
            return JSON.parse(JSON.stringify(e));
        },
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
}