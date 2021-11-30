import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';

export default function App() {
  const [inputValue, setInputValue] = useState('');

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const sendData = async (e) => {
    let response = await fetch('http://localhost:7070/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: 0, content: inputValue})
    });
    console.log(response);
    e.preventDefault();
  }

  return (
    <React.Fragment>
      <form action="" onSubmit={sendData}>
        <input value={inputValue} type="text" onChange={onInputChange} />
        <button>Отправить</button>
      </form>
      <Router>
        <Switch>
          <Route exact path="/" component={AllPosts} />
        </Switch>
      </Router>
    </React.Fragment>   
  );
}

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const fetchData = async () => {
    const json = await fetch('http://localhost:7070/posts');
    const data = await json.json();
    setPosts(data);
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="posts">
      {posts.map(e => <RenderPost {...e} />)}      
    </div>
  )
}

function RenderPost({id, content, created}) {
  return (
    <div className="post">
      <div>{id}</div>
      <div>{content}</div>
      <div>{created}</div>
    </div>
  )
}