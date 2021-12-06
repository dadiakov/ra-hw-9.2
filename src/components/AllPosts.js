import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import RenderPost from './RenderPost';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [activeCard, setActiveCard] = useState('');
    const [activeUrl, setActiveUrl] = useState('');
  
    const fetchData = async () => {
      const json = await fetch('http://localhost:7070/posts');
      const data = await json.json();
      setPosts(data);
    }
    useEffect(() => {
      fetchData();
    }, []);
  
    const onCardClick = (id) => {
      setActiveCard(posts.filter(e => e.id === id)[0]);
      setActiveUrl(`/posts/${id}`);
    }
  
    return (
      <React.Fragment>
        <nav>
          <NavLink style={{textDecoration: 'none', fontSize: '20px'}} to="/posts/new">Создать пост</NavLink>
        </nav>
        <div className="posts">
          {posts.map(e => <RenderPost {...e} key={e.id} onClick={onCardClick}/>)}      
        </div>
        {activeCard ? <Redirect to={activeUrl} /> : null}
      </React.Fragment>
    )
}