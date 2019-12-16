// 财务中心 financial

export default {
    namespaced: true,
    state: {
        compName: "xxx",
        activityId: "",//活动id,
        prizepoolId: "",//奖池id
        activityTypeOption: [],
    },
    mutations: {
        changeCompName(state, payload) {
            console.log("mutations changeCompName", payload);
            state.compName = payload;
        },
        setActivityId(state, payload) {
            state.activityId = payload;
        },
        setPrizepoolId(state, payload) {
            console.log("setPrizepoolId", payload);
            state.prizepoolId = payload;
        },
        setActivityTypeOption(state, payload) {
            state.activityTypeOption = payload.activityTypeOption;
            console.log("mutation setActivityTypeOption", payload.activityTypeOption);
        },
    },
    actions: {
        changeCompName({ commit }, payload) {
            commit("changeCompName", payload);
        },
    },
    getters: {
        getCompName(state) {
            console.log("getters getCompName");
            return state.compName;
        },
        getActivityId(state) {
            console.log("getters activityId", state.activityId);
            return state.activityId;
        },
        getPrizepoolId(state) {
            console.log("getters prizepoolId", state.prizepoolId);
            return state.prizepoolId;
        },
        getActivityTypeOption(state) {
            console.log("getters activityTypeOption", state.activityTypeOption);
            return state.activityTypeOption;
        }
    }
}