import {EN, CZ, IT} from '../actions/types';

export const reducer = (state = {}, action) => {

    switch (action.type) {
        case EN:
            return {...state, local: 'en';
        case CZ:
            return {...state, local: 'cz'};
        case IT:
            return {...state, local: 'it'};
        default:
            return {...state, local: 'en'};
    }


};
