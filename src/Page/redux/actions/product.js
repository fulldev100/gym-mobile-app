import {
    productlistAction
} from '../../../util/action.js';
import { AlertHelper } from '../../App/AlertHelper';
import { t } from '../../../../locals';

import { PRODUCT_LIST, LOADING_START_PRODUCT, LOADING_END_PRODUCT } from '../constant/types';

const productData = data => ({
    type: PRODUCT_LIST,
    data,
});

const startLoading = () => ({
    type: LOADING_START_PRODUCT
});

const endLoading = () => ({
    type: LOADING_END_PRODUCT
});

export const fetchProductlist = (data) => dispatch => {

    productlistAction(data).then(responseJson => {
        if (responseJson.status == 1) {
          //  console.log(responseJson);
            dispatch(productData(responseJson));
            dispatch(endLoading());
        } else {
            dispatch(endLoading());
            AlertHelper.show('warn', t('Warning'), responseJson.error);
        }
    });
}

export const loadingStart = () => dispatch => {
    dispatch(startLoading());
}

export const loadingEnd = () => dispatch => {
    dispatch(endLoading());
}