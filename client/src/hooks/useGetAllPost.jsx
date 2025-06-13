import { setPosts } from '@/redux/postSlice';
import { Post_API } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPosts = async() => {
            try {
                const res = await axios.get(`${Post_API}/all`,{withCredentials: true});
                if(res.data.success){
                    console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
        fetchAllPosts();
    },[])
};

export default useGetAllPost