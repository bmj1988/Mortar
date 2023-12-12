import { csrfFetch } from "./crsf"
import { createSelector } from 'reselect'

/// ACTION TYPES

const GETALLSPOTS = 'spots/GetAllSpots'
const SPOTDETAILS = 'spots/SpotDetails'
const DELETESPOT = 'spots/DELETE'

///ACTION CREATORS

const getAllSpots = (spots) => {
    return (
        {
            type: GETALLSPOTS,
            spots
        }
    )
}

const getSpotDetails = (details) => {
    return (
        {
            type: SPOTDETAILS,
            details,
        }
    )
}

const deleteSpot = (spotId) => {
    return ({
        type: DELETESPOT,
        spotId
    })
}

/// THUNKS

export const thunkAllSpots = () => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/spots')
        if (response.ok) {
            const spots = await response.json();
            dispatch(getAllSpots(spots));
            return spots
        }
    }
    catch (e) {
        console.log(`!!!!!!!!!!!! \n`, e)
        return e
    }

}

export const thunkSpotById = (id) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${id}`)
        if (response.ok) {
            const spotDetails = await response.json();
            dispatch(getSpotDetails(spotDetails))
            return spotDetails
        }
    }
    catch (e) {
        console.log(`!!!!!!!!!!!! \n`, e)
        return e
    }

}

export const thunkCreateSpot = (spotDetails, images) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spotDetails)
        })
        if (response.ok) {
            const newSpot = await response.json();
            if (images.length > 0) {
                for (let image in images) {
                    fetchCreateImagesForSpot(image, newSpot.id)
                }
            };
            console.log('NEW SPOT!!!!!!!!!', newSpot)
            await dispatch(thunkSpotById(newSpot.id))
            return newSpot
        }
    }
    catch (e) {
        const error = await e.json();
        console.log(`!!!!!!!!! ERROR LOOK HERE RN`, error)
        return error
    }
}

export const thunkGetOwnSpots = () => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/current`)
        if (response.ok) {
            const ownSpots = await response.json();
            dispatch(getAllSpots(ownSpots));
            return ownSpots;
        }
    }
    catch (e) {
        console.log(e)
        return e
    }
}

export const thunkSpotDelete = (spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            const success = await response.json()
            dispatch(deleteSpot(spotId))
            return success
        }
    }
    catch (e) {
        const error = e.json();
        console.log(e)
        return e
    }
}

export const thunkSpotUpdate = (spot, spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`api/spots/${spotId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spot)
        })
        if (response.ok) {
            const updatedSpot = await response.json();
            await dispatch(thunkSpotById(updatedSpot.id));
            return updatedSpot;
        }
    }
    catch (e) {
        return e
    }
}

/// SELECTORS

export const spotsArray = createSelector((state) => state.spots, (spots) => {
    return Object.values(spots)
})


/// REDUCER

export const spotsReducer = (state = {}, action) => {
    let spotState = { ...state }
    switch (action.type) {
        case GETALLSPOTS: {
            console.log(action.spots.Spots)
            spotState = {};
            action.spots.Spots.forEach((spot) => spotState[spot.id] = spot)
            return spotState;
        }
        case SPOTDETAILS: {

            spotState[action.details.id] = action.details
            return spotState
        }
        case DELETESPOT: {
            delete spotState[action.spotId]
            return spotState
        }
        default: {
            return spotState
        }

    }
}


/// MISC HELPER FUNCTIONS
const fetchCreateImagesForSpot = (image, spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: image, preview: false })
        })
        if (response.ok) {
            return
        }
    }
    catch (e) {
        return (e)
    }
}