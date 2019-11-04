import {combineReducers} from 'redux';
import {reducer as systemReducer} from './system';
import {reducer as authReducer} from './auth';
import {reducer as settingsReducer} from './settings';
import {reducer as langsReducer} from './langs';

const rootReducer = combineReducers({
    system: systemReducer,
    auth: authReducer,
    settings: settingsReducer,
    langs: langsReducer
});

export default rootReducer;
