import axios from "axios";

//Map for localStorage keys
const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'spotify_token_expire_time',
    timestamp: 'spotify_token_timestamp',
}

//Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

export const logout = () => {
    for (const property in LOCALSTORAGE_KEYS) {
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }
    window.location = window.location.origin;
}
// check if the amount of time that elapsed between the timestamp in localstorage and now is greater than the expiration time of 3600 seconds
const hasTokenExpired = () => {
    const {accessToken, timestamp, expireTime} = LOCALSTORAGE_VALUES;
    if (!accessToken || !timestamp) {
        return false;
    }
    const milisecondsElapsed = Date.now() - Number(timestamp);
    return (milisecondsElapsed / 1000) > Number(expireTime);
};

//use the refresh token in localstorage to hit the refresh_token endpoint
// in our node app, then update values in localstorage with data from response.

const refreshToken = async () => {
    try {
        //lougout if there is no refresh token stored or we have managed to get into a reload ifinite loop
        if (!LOCALSTORAGE_VALUES.refreshToken || LOCALSTORAGE_VALUES.refreshToken === 'undefined' || (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000)
        {
            console.error('no refresh token avaliable');
            logout();
        }
        //use '/refresh_token' endpoint from our node app
        const {data} = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);

        //update localstorage values
        window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken,data.access_token);
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp,Date.now());

        //reload the page for localstorage updates to be reflected
        window.location.reload();
    } catch(e) {
        console.error(e);
    }
}

/**
 * Handles logic for retreiving the Spotify acces token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
const getAccessToken = () => {
    // console.log("dziala?");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {
        [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
        [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
        [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    };
    const hasError = urlParams.get('error');

    //if there is an error or the token in localstorage has expired, refresh the token
    if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
        refreshToken();
    }

    //if there is a valid access token in localstorage, use that
    if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
        return LOCALSTORAGE_VALUES.accessToken
    }
    //if there is a token in the URL query params, user is logging in for the first time
    if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
        //store the query params in localstorage
        for (const property in queryParams) {
            window.localStorage.setItem(property, queryParams[property]);
        };
    }
    // set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp,Date.now());
    //return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
}
//we should never get here
// return false;

const getAccesToken = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    return accessToken;
};

export const accessToken = getAccessToken();
