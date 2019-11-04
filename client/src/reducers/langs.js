import {getLocalizedStrings} from "../actions";
import LocalizedStrings from "react-localization";
//import {EN, IT, CZ} from '../actions/types';

//import {EN, CZ, IT} from '../actions/types';

//import cookie from 'browser-cookies';

export const reducer = (state = {}, action) => {//
    var strings = new LocalizedStrings(getLocalizedStrings())
    return {...state, strings: strings};
};

/*
export const reducer = (state = {}, action) => {//
    var strings = new LocalizedStrings(getLocalizedStrings())
    switch (action.type) {
        case EN:
            return {...state, strings: strings.setLanguage('en')};
        case CZ:
            return {...state, strings: strings.setLanguage('cz')};
        case IT:
            return {...state, strings: strings.setLanguage('it')};
        default:
            return {...state, strings: strings};
    }
};*/
