import { PRODUCT_LIST, LOADING_START_PRODUCT, LOADING_END_PRODUCT } from '../constant/types';

const initialState = {
    loading: false,
    productData:[],
}

export const product = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_START_PRODUCT:
            return {
                ...state,
                loading: true,
            }
        case LOADING_END_PRODUCT:
            return {
                ...state,
                loading: false,
            }
        case PRODUCT_LIST:
            return {
                ...state,
                productData:action.data.result,
                loading: false,
            }
        default:
            return state;
    }
}