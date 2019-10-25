// 财务中心 financial

export default {
    namespaced: true,
    state: {
        compName: "cms",
        publishCompName: "",
    },
    mutations: {
        setCompName(state, payload) {
            state.compName = payload;
        },
        setPublishCompName(state, payload) {
            state.publishCompName = payload;
        },
    },
    actions: {
        setCompName({ commit }, payload) {
            commit("setCompName", payload);
        },
        setPublishCompName({ commit }, payload) {
            state.publishCompName = payload;
        },
    },
    getters: {
        getCompName(state) {
            console.log("getters getCompName");
            return state.compName;
        },
        getPublishCompName(state) {
            console.log("getters publishCompName");
            return state.publishCompName;
        }
    }
}