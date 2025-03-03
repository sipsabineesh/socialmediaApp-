import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserProfile = async() => {
          try {
                const res= await axios.get(`https://socialmediaapp-8vkg.onrender.com/api/user/${userId}/profile`, { withCredentials: true })
                if(res.data.success){
                    dispatch(setUserProfile(res.data.user))
                }
          } catch (error) {
            
          }
        }
        fetchUserProfile();
    },[userId])
}
export default useGetUserProfile;