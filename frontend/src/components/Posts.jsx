// import React from 'react'
// import Post from './Post'
// import { useSelector } from 'react-redux'

// const Posts = () => {
//   const {posts} = useSelector((store) => store.post); 
//   return (
//     <div>
//       {posts.map((post) => <Post key={post._id} post={post}/> )}
//     </div>
//   )
// }

// export default Posts
import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  if (!posts || posts.length === 0) {
    return <p>No posts available</p>; // Show fallback if no posts
  }

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
