import React from 'react';
import NavBar from './NavBar';
import EyeGrabber from './EyeGrabber';
import HomeContent from './HomeContent';
import MyData from './MyData';

const Home = ({ currentUser, setCurrentUser }) => {
    if (currentUser){
      return (
        <div>
          <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          {/* <EyeGrabber currentUser={currentUser} /> */}
          <MyData />
        </div>
      );
    } else {
      return (
        <div>
          <NavBar />
          {/* <EyeGrabber /> */}
          <HomeContent />
        </div>
      );
    }
};

export default Home;