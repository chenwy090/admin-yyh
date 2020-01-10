// 活动模板

export default {
    namespaced: true,
    state: {
        compName: "xxx",
        activityId: "",//活动id,
        activityTypeOption: [],
        openCityOption:[]
    },
    mutations: {
        setActivityId(state, payload) {
            state.activityId = payload;
        },
        setActivityTypeOption(state, payload) {
            state.activityTypeOption = payload.activityTypeOption;
            console.log("mutation setActivityTypeOption", payload.activityTypeOption);
        },
        setOpenCityOption(state,payload){
            state.openCityOption = payload.openCityOption;
        }
    },
    actions: {
    },
    getters: {
        getActivityId(state) {
            console.log("getters activityId", state.activityId);
            return state.activityId;
        },
        getActivityTypeOption(state) {
            console.log("getters activityTypeOption", state.activityTypeOption);
            return state.activityTypeOption;
        },
        getOpenCityOption(state){
            return state.openCityOption;
        }
    }
}