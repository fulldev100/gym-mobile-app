import { MY_HOME, LOADING_START_NUTRITION, LOADING_END_NUTRITION } from '../constant/types';

const initialState = {
    loading: false,
    homeData:[],
}

export const home = (state = initialState, action) => {
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
        case MY_HOME:
            return {
                ...state,
                homeData:action.data.result,
                membership: action.data.membership,
                gym_name: action.data.gym_name,
                gym_address: action.data.gym_address,
                gym_map_address: action.data.gym_map_address,
                gym_contact_number: action.data.gym_contact_number,
                gym_alternate_phone_number: action.data.gym_alternate_phone_number,
                gym_email: action.data.gym_email,
                gym_country: action.data.gym_country,
                loading: false,
            }
        default:
            return state;
    }
}