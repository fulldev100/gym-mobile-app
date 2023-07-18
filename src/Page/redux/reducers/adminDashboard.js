import { ADMIN_DASHBOARD, LOADING_START_NUTRITION, LOADING_END_NUTRITION } from '../constant/types';

const initialState = {
    loading: false,
    adminDashboardData:[],
}

export const adminDashboard = (state = initialState, action) => {
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
        case ADMIN_DASHBOARD:
            return {
                ...state,
                adminDashboardData:action.data.result,
                loading: false,
            }
        default:
            return state;
    }
}