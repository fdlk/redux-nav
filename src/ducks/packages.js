import {combineReducers} from "redux";
import {get} from "../MolgenisApi";

export const SELECT_PACKAGE = 'SELECT_PACKAGE'
export const REQUEST_PACKAGE = 'REQUEST_PACKAGE'
export const RECEIVE_PACKAGE = 'RECEIVE_PACKAGE'
export const INVALIDATE_PACKAGE = 'INVALIDATE_PACKAGE'

export const selectPackage = id => ({
    type: SELECT_PACKAGE,
    id
})

export const invalidatePackage = id => ({
    type: INVALIDATE_PACKAGE,
    id
})

const requestPackage = id => ({
    type: REQUEST_PACKAGE,
    id
})

export const receivePackage = (id, json) => {
    const {entityTypes, children, label, description} = json
    return {
        type: RECEIVE_PACKAGE,
        id,
        label,
        description,
        entityTypes,
        children,
        receivedAt: Date.now()
    }
}

const fetchPackage = id => dispatch => {
    return get(
        {apiUrl: "http://localhost:8080/api"},
        `/v2/sys_md_Package/${id}?attrs=label,description,entityTypes(fullName,label,description),children(fullName,label,description)`,
        "5c4d1fd6131b4334a6de6cc570261be8")
        .then(json => dispatch(receivePackage(id, json)))
}

const shouldFetchPackage = (state, id) => {
    const pack = state.packages[id]
    if (!pack) {
        return true
    }
    if (pack.isFetching) {
        return false
    }
    return pack.didInvalidate
}

export const fetchPackageIfNeeded = id => (dispatch, getState) => {
    if (shouldFetchPackage(getState(), id)) {
        dispatch(requestPackage(id))
        return dispatch(fetchPackage(id))
    }
}

/**
 * Package selection packagesReducer. Maintains the selected package, default "sys"
 */
const selectedPackage = (state = "sys", action) => {
    switch (action.type) {
        case SELECT_PACKAGE :
            return action.id
        default:
            return state
    }
}

/**
 * Package packagesReducer, maintains a map of packageId -> package info
 */
const packages = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_PACKAGE:
            return {
                ...state,
                [action.id]: {
                    isFetching: true,
                    children: [],
                    entityTypes: [],
                }
            }
        case RECEIVE_PACKAGE:
            return {
                ...state,
                [action.id]: {
                    isFetching: false,
                    children: action.children,
                    entityTypes: action.entityTypes,
                    description: action.description,
                    label: action.label,
                    lastUpdated: action.receivedAt
                }
            }
        case INVALIDATE_PACKAGE:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    didInvalidate: true
                }
            }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    packages,
    selectedPackage
})


/**
 * Selector for the package path, combining information in the state to a list of packages.
 * @param state current state
 * @returns {Array} of packages
 */
export const getPackagePath = (state) => {
    const {selectedPackage} = state
    const packages = selectedPackage.split("_")
    const fullNames = packages.map((p, i) => packages.slice(0, i + 1).join("_"));
    return fullNames.map(p => ({...state.packages[p], fullName: p}))
}

export default rootReducer
