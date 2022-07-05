import axios from 'axios';
import { setAlert } from './alert';
import { API } from '../backend';
import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    GET_REPOS,
    ACCOUNT_DELETED,
    NO_REPOS
} from './types';


//Get current users profile


export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get(`${API}/api/profile/me`)
        
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }

        })
    }
}


//Get all profiles

export const getProfiles = () => async dispatch => {
   
    try {
        const res = await axios.get(`${API}/api/profile`)


        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }

        })
    }
}



//Get  profile by id

// export const getProfileById = (userId) => async dispatch => {
//     try {
//         const res = await axios.get(`${API}/api/profile/user/${userId}`)
//         dispatch({
//             type: GET_PROFILE,
//             payload: res.data
//         })
//     } catch (err) {
//         dispatch({
//             type: PROFILE_ERROR,
//             payload: { msg: err.response.statusText, status: err.response.status }

//         })
//     }
// }

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    dispatch({
        type: CLEAR_PROFILE

    })
    
    const res = await axios.get(`${API}/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};


//Get Github Repos





export const getRepos = (username) => async (dispatch) => {
    try {
      const res = await axios.get(`${API}/api/profile/github/${username}`);
      console.log(res);
      dispatch({
        type: GET_REPOS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: NO_REPOS
      });
    }
  };
  


//Create or update a profile 

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post(`${API}/api/profile`, formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
       
            history.push('/profiles');



    } catch (err) {
        const error = err.response.data.errors;
        dispatch(setAlert(error, 'danger'));
        // if (errors) {
        //     errors.forEach((error) => ));
        // }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }

        })

    }
}



//Add Experience

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put(`${API}/api/profile/experience`, formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added', 'success'));

        history.push('/dashboard');


    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }

        })

    }
}


export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put(`${API}/api/profile/education`, formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Added', 'success'));

        history.push('/dashboard');


    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }

        })

    }
}


//Delete Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`${API}/api/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience Removed', 'success'));
    }
    catch (err) {

        dispatch({
            type: PROFILE_ERROR ,
            payload: { msg: err.response.statusText, status: err.response.status }

        })
    }
}


//Delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`${API}/api/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education Removed', 'success'));
    }
    catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }

        })
    }
}


//Delete Account and profile
export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!!')) {

        try {

            const res=await axios.delete(`${API}/api/profile`)
            dispatch({
                type: CLEAR_PROFILE

            })

            dispatch({
                type: ACCOUNT_DELETED

            })

            dispatch(setAlert('Your Account has been permanantly deleted', 'info'));
        }
        catch (err) {

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }

            })
        }

    }

}


