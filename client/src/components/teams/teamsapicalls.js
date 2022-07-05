import { API } from '../../backend'
import axios from 'axios'
import { setAlert } from '../../actions/alert'
import store from '../../store'

export const getAllGroups = async () => {


    try {
        const res = await axios.get(`${API}/api/groups`);
        return res.data;

    } catch (err) {
        return err.response.data.errors;

    }
}


export const getGroupById = async (id) => {

    try {
        const res = await axios.get(`${API}/api/groups/${id}`);
        return res.data;

    } catch (err) {
        return err.response.data.errors;
    }
}

export const actionTeam = async (id) => {
    try {
        const res = await axios.put(`${API}/api/groups/${id}`);
        return res.data;

    } catch (err) {
        return err.response.data.errors;
    }

}

export const createTeam=async(formData)=>{

    try{

     const config = {
        headers: {
            'Content-Type': 'application/json'
        }}
        const res = await axios.post(`${API}/api/groups`, formData, config);
        return res.data
     }catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => store.dispatch(setAlert(error.msg, 'danger')));
        }

    }
}