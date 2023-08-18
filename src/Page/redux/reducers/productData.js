import { PRODUCTGROUP_LIST, LOADING_START_GROUP_TYPE, LOADING_END_GROUP_TYPE, POST_PRODUCT } from '../constant/types';

const initialState = {
    loading: false,
    ProductData:[],
    ViewProductData:[],
    ProductName:'',
    ProductMessage:''
}

export const productData = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_START_GROUP_TYPE:
            return {
                ...state,
                loading: true,
            }
        case LOADING_END_GROUP_TYPE:
            return {
                ...state,
                loading: false,
            }
        case POST_PRODUCT:
            return {
                ...state,
                PostProduct:action.data.result,
                loading: false,
            }
        default:
            return state;
    }
}