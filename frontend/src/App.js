import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Weather from './components/Weather';
import NavBar from './components/NavBar';
import LogIn from './components/LogIn';
import Register from './components/Register';
import './css/App.css';
import Profile from './components/Profile';

const App = () => {
  return (
    <div className="App">
      <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Weather />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    </div>
  );
};

export default App;