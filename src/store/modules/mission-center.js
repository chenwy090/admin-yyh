// 任务中心 mission-center --> 商户任务 business-tasks

export default {
    namespaced: true,
    state: {
        // reward-u reward-u-data reward-u-edit
        compName: "reward-u", //赏U列表页
        id: "", //任务id
        name: "", //任务名称
        data: {}, //任务数据
    },
    mutations: {
        changeCompName(state, payload) {
            console.log("mutations changeCompName", payload);
            state.compName = payload;
        },
        changeView(state, payload) {
            const { compName, id } = payload || {};
            state.compName = compName;
            state.id = id;
            state.name = name;
            state.data = data;
            if (compName == "reward-u-edit") {

            } else if (compName == "reward-u-data") {

            }
            console.log("mutation changeView", payload);
        }
    },
    actions: {
        changeCompName({ commit }, payload) {
            commit("changeCompName", payload);
        },
        changeView({ commit }, payload) {
            commit("changeView", payload);
        },
    },
    getters: {
        getCompName(state) {
            console.log("getters getCompName");
            return state.compName;
        }
    }
}