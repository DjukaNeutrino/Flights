import React, { Component } from 'react';
import 'foundation-sites/dist/css/foundation.min.css';
import './App.css';
import Geo from "./Containers/Geo/index";
import Flight from "./Containers/Flight/index";

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Flights above you</h1>
        </header>
        <Router>
          <div className="App-content">
            <Switch>
              <Route exact path="/" component={Geo} />
              <Route exact path="/:id" component={Flight} />
            </Switch>
          </div>
        </Router>
        <footer className="App-footer">
          <p className="footerText">© 2018 Flights above you. All Rights Reserved</p>
        </footer>
      </div>
    );
  }
}

export default App;
