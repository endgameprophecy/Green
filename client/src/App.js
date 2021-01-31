import React, { Component } from "react";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import store from './store';

import Home from "./pages/home";
import Map from "./pages/map";
import Profile from "./pages/profile";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component{
  render(){
    return(
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route exact path="/Map">
                <Map/>
            </Route>
            <Route exact path="/Profile">
                <Profile/>
            </Route>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}


export default App;