// 财务中心 financial

export default {
    namespaced: true,
    state: {
        compName: "cms",
    },
    mutations: {
        setCompName(state, payload) {
            state.compName = payload;
        },
    },
    actions: {
        setCompName({ commit }, payload) {
            commit("setCompName", payload);
        },
    },
    getters: {
        getCompName(state) {
            console.log("getters getCompName");
            return state.compName;
        }
    }
}