/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import RenderPost from './RenderPost';
import PropTypes from 'prop-types';

export default function ViewPost({match: {params: {id}}}) {
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

ViewPost.propTypes = {
    match: PropTypes.object.isRequired
}