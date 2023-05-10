import React, { useEffect, useState } from 'react';
import LoadSpinner from '../Spinner';
import Post from './Post';
import { axiosReq } from '../../contexts/CurrentUserContext';

const UserPosts = (props) => {
  const { profileId, latestNewPost } = props;

  const [hasLoaded, setHasLoaded] = useState(false);
  const [posts, setPosts] = useState({ results: [] });

  useEffect(() => {
    if (latestNewPost) {
      const fetchData = async () => {
        try {
          // Get latest post for user from server.
          const { data } = await axiosReq.get(`/posts/${latestNewPost}`);
          // Convert json string into obj.
          const jsonPost = JSON.parse(data.post);
          const newPost = jsonPost[0].fields;
          // Adding missing fields to object.
          newPost.id = jsonPost[0].pk;
          newPost.image = data.imageURL;
          // Add obj to existing obj array.
          setPosts((prevPosts) => ({
            ...prevPosts,
            results: [newPost, ...prevPosts.results],
          }));
        } catch {
          console.log('error');
        }
      };
      fetchData();
    }
  }, [latestNewPost]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get posts for user.
        const { data } = await axiosReq.get(`/posts/?owner=${profileId}`);
        // Set received api data to variable.
        setPosts(data);
      } catch {
      } finally {
        // Remove spinner from DOM.
        setHasLoaded(true);
      }
    };
    fetchData();
  }, [profileId]);

  const main = (
    <>
      {posts.results.map((p) => (
        <Post key={p.id} {...p} setPosts={setPosts} />
      ))}
    </>
  );

  // Render, show spinner until form loaded.
  return <div>{hasLoaded ? main : <LoadSpinner />}</div>;
};

export default UserPosts;
