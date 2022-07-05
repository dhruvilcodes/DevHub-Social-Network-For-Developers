import { GET_PROFILE, GET_PROFILES, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_REPOS, NO_REPOS } from '../actions/types';

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {},
    change:false
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    const {change}=state;
    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false,
                change: !change
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false,
                profile:null
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                profile: null
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: []
            };
        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading: false
            };
        case NO_REPOS:
            return {
                ...state,
                repos: []
            };
        default:
            return state;
    }
}