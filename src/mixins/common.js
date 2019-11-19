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