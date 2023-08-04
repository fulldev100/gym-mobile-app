import { POST_MEMBERSHIP, LOADING_START_NUTRITION, LOADING_END_NUTRITION } from '../constant/types';

const initialState = {
    loading: false,
    membershipResultData:[],
}

export const membership = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_START_NUTRITION:
            return {
                ...state,
                loading: true,
            }
        case LOADING_END_NUTRITION:
            return {
                ...state,
                loading: false,
            }
        case POST_MEMBERSHIP:
            return {
                ...state,
                membershipResultData: action.data.result,
                loading: false,
            }
        default:
            return state;
    }
}