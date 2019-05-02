import React from 'react';
import {Provider} from 'react-redux';
import {HashRouter as Router} from 'react-router-dom';
import './App.css';
import {router} from './router';
import store from './redux/store';
import Navbar from './Components/Navbar';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar/>
        {router}
      </Router>
    </Provider>
  );
}

export default App;
