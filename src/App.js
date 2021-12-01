/* eslint-disable eqeqeq */
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from 'react-router-dom';

export default function App() {


  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path="/posts/new" component={CreatePost} />
          <Route path="/posts/:id" component={ViewPost} />
          <Route exact path="/" component={AllPosts} />
        </Switch>
      </Router>
    </React.Fragment>   
  );
}

function AllPosts({ match }) {
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
        <NavLink to="/posts/new">Создать пост</NavLink>
      </nav>
      <div className="posts">
        {posts.map(e => <RenderPost {...e} key={e.id} onClick={onCardClick}/>)}      
      </div>
      {activeCard ? <Redirect to={activeUrl} /> : null}
    </React.Fragment>
  )
}

function RenderPost({id, content, created, onClick}) {
  return (
    <div className="post" onClick={() => { onClick(id) }}>
      <div>{id}</div>
      <div>{content}</div>
      <div>{created}</div>
    </div>
  )
}

function CreatePost() {
  const [inputValue, setInputValue] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [close, setClose] = useState(false);

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const onCloseHandler = () => {
    setClose(true);
    setInputValue('');
  }

  const sendData = async (e) => {   
    e.preventDefault();
    const response = await fetch('http://localhost:7070/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: 0, content: inputValue})
    });
    
    response.ok ? setLoaded(true) : console.log('Проблема');
    
  }
  return (
    <React.Fragment>
      <form action="" onSubmit={sendData}>
        <input value={inputValue} type="text" onChange={onInputChange} required />
        <button>Отправить</button>
      </form>
      <button onClick={onCloseHandler}>Закрыть</button>
      {loaded || close ? <Redirect to="/" /> : null} 
    </React.Fragment>
    
  )
}

function ViewPost({match: {params: {id}}}) {
  const [post, setPost] = useState({id: 0, content: '111'});
  const [toEdit, setToEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const json = await fetch('http://localhost:7070/posts');
      const data = await json.json();
      const sorted = data.filter(e => e.id == id);
      const post = sorted[0];
      setPost(post);
    }
    fetchData();

  }, [id])

  return (
    <React.Fragment>
      {post && !toEdit ? 
          <div>
            <RenderPost {...post} onClick={() => console.log('Click')} /> 
            <button onClick={onEditHandler}>Редактировать</button>
            <button onClick={onDeleteHandler}>Удалить</button>
          </div>
      : null }
      

    </React.Fragment>
  )
}