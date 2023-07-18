import {
    adminDashboardAction
} from '../../../util/action.js';
import { AlertHelper } from '../../App/AlertHelper';
import { t } from '../../../../locals';

import { ADMIN_DASHBOARD, LOADING_START_NUTRITION, LOADING_END_NUTRITION } from '../constant/types';

const adminDashboardData = data => ({
    type: ADMIN_DASHBOARD,
    data,
});

const startLoading = () => ({
    type: LOADING_START_NUTRITION
});

const endLoading = () => ({
    type: LOADING_END_NUTRITION
});

export const fetchAdminDashboardlist = (data) => dispatch => {

    console.log("///// start |||||||||||")
    adminDashboardAction(data).then(responseJson => {
        if (responseJson == undefined) {
            
            dispatch(endLoading());
            AlertHelper.show('warn', t('Warning'), "Network error");
        } else {
            console.log(responseJson.result[0].total_membership_list)
            if (responseJson.status == 1) {
                
                console.log("///// success |||||||||||")
                dispatch(adminDashboardData(responseJson));
            } else {
                dispatch(endLoading());
                AlertHelper.show('warn', t('Warning'), responseJson.error);
            }
        }
    });

}

export const loadingStart = () => dispatch => {
    dispatch(startLoading());
}

export const loadingEnd = () => dispatch => {
    dispatch(endLoading());
}