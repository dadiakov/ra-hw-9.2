/* eslint-disable eqeqeq */
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AllPosts from './components/AllPosts';
import CreatePost from './components/CreatePost';
import ViewPost from './components/ViewPost';

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