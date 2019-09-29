// 财务中心 financial

export default {
    namespaced: true,
    state: {
        compName: "business-recharge",
        acountId: "", //账号id
        merchantType: "", //商户类型
        merchantId: "", //商户id
        merhcantName: "", //商户名称
        // businessId: "", //商户id
        // businessName: "", //商户名称
        province: "", //省
        city: "", //市
        retailerInfoList: [],
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
            state.merhcantName = payload.merhcantName;
            // state.businessId = payload.businessId;
            // state.businessName = payload.businessName;
            console.log("mutation showRechargeDetail", payload);
        },
        setRetailerInfoList(state, payload) {
            console.log("mutations setRetailerInfoList", payload);
            state.retailerInfoList = payload;
        },
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