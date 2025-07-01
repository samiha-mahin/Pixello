import { setSuggestedUsers } from '@/redux/authSlice'
import { USER_API } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${USER_API}/suggested`,{withCredentials:true})
                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.users))
                }
            } catch (error) {
               console.log(error); 
            }
        }
        fetchSuggestedUsers()
    },[])
}

export default useGetSuggestedUsers