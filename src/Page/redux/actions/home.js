import {
    homeAction,
    postMembershipAction
} from '../../../util/action.js';
import { AlertHelper } from '../../App/AlertHelper';
import { t } from '../../../../locals';

import { POST_MEMBERSHIP, MY_HOME, LOADING_START_NUTRITION, LOADING_END_NUTRITION } from '../constant/types';

const homeData = data => ({
    type: MY_HOME,
    data,
});

const membershipData = data => ({
    type: POST_MEMBERSHIP,
    data,
});

const startLoading = () => ({
    type: LOADING_START_NUTRITION
});

const endLoading = () => ({
    type: LOADING_END_NUTRITION
});

export const fetchHomelist = (data) => dispatch => {

    homeAction(data).then(async responseJson => {
        if (responseJson.status == 1) {
            console.log(responseJson);
            dispatch(homeData(responseJson));
        } else {

            dispatch(endLoading());

            if (responseJson.error == "An unauthorized user") {
            }
            else {
                AlertHelper.show('warn', t('Warning'), responseJson.error);
            }
        }
    });
}

export const postMembership = (data) => dispatch => {

    postMembershipAction(data).then(async responseJson => {
        if (responseJson.status == 1) {
            console.log(responseJson);
            dispatch(endLoading());
            dispatch(membershipData(responseJson));
        } else {

            console.log(responseJson);
            dispatch(endLoading());

            if (responseJson.error == "An unauthorized user") {
            }
            else {
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