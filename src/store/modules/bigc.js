// bigc 赏u

export default {
    namespaced: true,
    state: {
        showBigc:false,
        assignmentId: "",//商户任务id
    },
    mutations: {
        setShowBigc(state, payload) {
            console.log("ssssss payload",payload);
            state.showBigc = payload;
        },
        setAssignmentId(state, payload) {
            state.assignmentId = payload;
        },
    },
    actions: {
       
    },
}