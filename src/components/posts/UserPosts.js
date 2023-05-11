import React, { useEffect, useState } from 'react';
import LoadSpinner from '../Spinner';
import Post from './Post';
import { axiosReq } from '../../contexts/CurrentUserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils';
import appStyles from '../../App.module.css';

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
    <InfiniteScroll
      className={appStyles.NoScrollBars}
      children={posts.results.map((p) => (
        <Post key={p.id} {...p} setPosts={setPosts} />
      ))}
      dataLength={posts.results.length}
      loader={<LoadSpinner />}
      hasMore={!!posts.next}
      next={() => fetchMoreData(posts, setPosts)}
      endMessage={<p style={{ textAlign: 'center' }}>No more posts to see.</p>}
    />
  );

  // Render, show spinner until form loaded.
  return <div>{hasLoaded ? main : <LoadSpinner />}</div>;
};

export default UserPosts;
