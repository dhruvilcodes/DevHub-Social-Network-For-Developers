import axios from "axios";
import { API } from "../../backend";

export const getUserProfile=async (id)=>{
    const res=await axios.get(`${API}/api/profile/user/${id}`);
    console.log(res)
    return res.data._id;

}