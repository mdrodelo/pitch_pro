import React from 'react';
import NavBar from './NavBar';
import HomeContent from './HomeContent';
import MyData from './MyData';

const Home = ({ currentUser, setCurrentUser }) => {
    if (currentUser){
      return (
        <div>
          <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <MyData />
        </div>
      );
    } else {
      return (
        <div>
          <NavBar />
          <HomeContent />
        </div>
      );
    }
};

export default Home;