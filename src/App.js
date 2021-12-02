/* eslint-disable eqeqeq */
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from 'react-router-dom';
import moment from 'moment';

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
        <NavLink style={{textDecoration: 'none', fontSize: '20px'}} to="/posts/new">Создать пост</NavLink>
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
      <div style={{fontSize: 'x-large'}}>{content}</div>
      <div style={{marginTop: '5px', fontSize: 'small'}}>{moment(created).format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
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
        <button>Опубликовать</button>
      </form>
      <button style={{marginTop: 10}} onClick={onCloseHandler}>Закрыть</button>
      {loaded || close ? <Redirect to="/" /> : null} 
    </React.Fragment>
    
  )
}

function ViewPost({match: {params: {id}}}) {
  const [post, setPost] = useState({id: 0, content: ''});
  const [toEdit, setToEdit] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const json = await fetch('http://localhost:7070/posts');
      const data = await json.json();
      const sorted = data.filter(e => e.id == id);
      const post = sorted[0];
      setPost(post);
      setInputValue(post.content)
    }
    fetchData();
    setLoaded(false);

  }, [id])

  const onEditHandler = () => {
    setToEdit(true);
  }

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const onDeleteHandler = async () => {
    const response = await fetch(`http://localhost:7070/posts/${id}`, {
      method: 'DELETE'
    });
    
    response.ok ? setDeleted(true) : console.log('Проблема');
  }

  const goToMain = () => {
    setDeleted(true);
  }

  const onCancelHandler = () => {
    setToEdit(false);
  }

  const sendData = async (e) => {   
    e.preventDefault();
    const response = await fetch('http://localhost:7070/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: Number(id), content: inputValue})
    });
    
    if (response.ok) {
      setToEdit(false); 
      setPost({...post, content: inputValue})} 
      else {
        console.log('Проблема')
      }; 
  }

  return (
    <React.Fragment>
      {post && !toEdit ? 
          <div>
            <RenderPost {...post} /> 
            <button onClick={onEditHandler}>Редактировать</button>
            <button onClick={onDeleteHandler}>Удалить</button>
            <button style={{display: 'block', marginTop: '10px'}} onClick={goToMain}>На главную</button>
            {deleted ? <Redirect to="/" /> : null} 
          </div>
      : null }
      {post && toEdit ?           
          <div>
            <React.Fragment>
                <form action="" onSubmit={sendData}>
                  <input value={inputValue} type="text" onChange={onInputChange} required />
                  <button>Изменить</button>
                </form>
                <button style={{marginTop: '10px'}} onClick={onCancelHandler}>Закрыть</button>
                {loaded ? setToEdit(false) : null} 
            </React.Fragment>
          </div>
          : null}
    </React.Fragment>
  )
}