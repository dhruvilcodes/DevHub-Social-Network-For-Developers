import axios from 'axios'
import { API } from '../backend';
import { setAlert } from './alert'


import {
    DELETE_POST,
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    ADD_POST,
    CLEAR_PROFILE,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from './types';

//Get posts

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get(`${API}/api/posts`);
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


}


//add lIKES

export const addLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`${API}/api/posts/like/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId,likes:res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


}


//Remove lIKES

export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`${API}/api/posts/unlike/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId,likes:res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


}


//Delete Post

export const deletePost = (postId) => async dispatch => {
    try {
        const res = await axios.delete(`${API}/api/posts/${postId}`);
        dispatch({
            type: DELETE_POST,
            payload:postId
          
        })
        dispatch(setAlert('Post Removed','success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


}


//Add Post

export const addPost = (formData) => async dispatch => {
    try {

        const res = await axios.post(`${API}/api/posts`, formData);

        dispatch({
          type: ADD_POST,
          payload: res.data
        });
    


        dispatch(setAlert('Post Created','success'));
       
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


}

//Add Comment

export const addComment = (postId,formData) => async dispatch => {
    try {

        const res = await axios.post(`${API}/api/posts/comment/${postId}`, formData);

        dispatch({
          type: ADD_COMMENT,
          payload: res.data
        });
    


        dispatch(setAlert('Comment Added','success'));
       
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


}

export const deleteComment = (postId,commentId) => async dispatch => {
    try {

        const res = await axios.delete(`${API}/api/posts/comment/${postId}/${commentId}`);

        dispatch({
          type: REMOVE_COMMENT,
          payload: commentId
        });
    


        dispatch(setAlert('Comment Deleted','success'));
       
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


}
//Get post

export const getPost = (id) => async dispatch => {
    try {
        const res = await axios.get(`${API}/api/posts/${id}`);
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


}
