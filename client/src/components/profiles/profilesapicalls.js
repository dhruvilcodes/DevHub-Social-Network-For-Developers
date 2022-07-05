import axios from "axios"
import { API } from "../../backend"


export const getProfilesbyapi= async ()  => {

    try {
        const res = await axios.get(`${API}/api/profile`);

        return res.data;
    } catch (err) {
       
    }
}