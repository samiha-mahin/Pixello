import { setPosts } from '@/redux/postSlice';
import { Post_API } from '@/utils/constant';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllPost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  // Use a ref to avoid double fetch
  const hasFetched = useRef(false);

  useEffect(() => {
    console.log("👤 user in hook:", user);

    if (!user || !user._id) {
      console.log("⛔ User not ready yet. Skipping fetch.");
      return;
    }

    if (hasFetched.current) {
      console.log("⏳ Already fetched posts once. Skipping.");
      return;
    }

    const fetchAllPosts = async () => {
      try {
        console.log("📦 Fetching posts from server...");
        const res = await axios.get(`${Post_API}/all`, {
          withCredentials: true,
        });
        console.log("✅ Posts received:", res.data.posts);
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
          hasFetched.current = true;
        }
      } catch (error) {
        console.error("❌ Error fetching posts:", error.message);
      }
    };

    fetchAllPosts();
  }, [user, dispatch]);
};

export default useGetAllPost;
