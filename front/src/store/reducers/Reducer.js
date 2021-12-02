import {SET_MESSAGES, SET_ONLINE_USERS} from "../actions/actions";

const initialState = {
    messages: [],
    onlineUsers: [],
};

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MESSAGES:
            const messages = [...state.messages, action.payload];
            return {...state, messages: messages};
        case SET_ONLINE_USERS:
            return {...state, onlineUsers: action.payload};
        default:
            return state;
    }
};

export default Reducer;