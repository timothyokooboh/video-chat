const state = {
    roomKey: 0
}

const getters = {
    roomKey(state) {
        return state.roomKey
    }
}

const mutations = {
    incrementRoomKey(state) {
        state.roomKey++
        console.log(state.roomKey)
    }
}

export default {
    state,
    getters,
    mutations
}