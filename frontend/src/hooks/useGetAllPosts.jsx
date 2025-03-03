import {setPosts} from '@/redux/postSlice'
import {useEffect} from "react";
import axios from "axios";
import { useDispatch } from "react-redux";


const useGetAllPosts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async() => {
          try {
                const res= await axios.get('https://socialmediaapp-8vkg.onrender.com/api/post/all/',
                    {
                        withCredentials:true
                    }
                )
                if(res.data.success){
                    dispatch(setPosts(res.data.posts))
                }
          } catch (error) {
            
          }
        }
        fetchAllPost();
    },[])
}
export default useGetAllPosts;