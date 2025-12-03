import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Refresh from './components/Refresh';
import ThanksPost from './components/ThanksPost';
import Notify from './components/Notify';
import ViewProfile from './components/Viewprofile';
import Userposts from './components/Userposts';
import Mynetwork from './components/Mynetwork';
import { useContext, useEffect, useState } from 'react';
import { Userdatacontext } from './Context/UserContext';
import QuickLinks from './components/QuickLinks';
import Editprofile from './components/Editprofile';
import Signup from './components/Signup';
import Login from './components/Login';



function App() {
  const { userdata } = useContext(Userdatacontext);
  const [isLoading, setIsLoading] = useState(true);
   

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(52, 152, 219, 0.2)',
          borderTop: '3px solid #3498db',
          borderRight: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={userdata ? <Home /> : <Navigate to="/login" />} />
      <Route path='/signup' element={!userdata ? <Signup /> : <Navigate to="/" />} />
      <Route path='/login' element={!userdata ? <Login /> : <Navigate to="/" />} />
      <Route path='/Welcome' element={<Refresh/>}/>
      <Route path='/quicklinks' element={<QuickLinks/>}/>
      <Route path='/postsend' element={<ThanksPost/>}/>
      <Route  path='/notify' element={<Notify/>}/>
      <Route  path='/profile' element={<ViewProfile/>}/>
      <Route  path='/editprofile' element={<Editprofile/>}/>
      <Route  path='/userpost' element={<Userposts/>}/>
      <Route  path='/network' element={<Mynetwork/>}/>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}

export default App;