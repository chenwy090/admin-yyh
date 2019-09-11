// 财务中心 financial

export default {
    namespaced: true,
    state: {
        compName: "business-recharge",
        acountId: "", //账号id
        merchantType: "", //商户类型
        merchantId: "", //商户id
        merchantName: "", //商户名称
        // businessId: "", //商户id
        // businessName: "", //商户名称
        province: "", //省
        city: "" //市
    },
    mutations: {
        changeCompName(state, payload) {
            console.log("mutations changeCompName", payload);
            state.compName = payload;
        },
        showRechargeDetail(state, payload) {
            state.compName = payload.compName;

            state.acountId = payload.acountId;
            state.merchantType = payload.merchantType;
            state.merchantId = payload.merchantId;
            state.merchantName = payload.merchantName;
            // state.businessId = payload.businessId;
            // state.businessName = payload.businessName;
            console.log("mutation showRechargeDetail", payload);
        }
    },
    actions: {
        changeCompName({ commit }, payload) {
            commit("changeCompName", payload);
        },
        showRechargeDetail({ commit }, payload) {
            commit("showRechargeDetail", payload);
        },
    },
    getters: {
        getCompName(state) {
            console.log("getters getCompName");
            return state.compName;
        }
    }
}