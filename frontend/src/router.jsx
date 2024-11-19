import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateProfile from './pages/CreateProfile'
import Explore from './pages/Explore';
// import Messages from './pages/Messages';
// import PostProject from './pages/PostProject';
// import Profile from './pages/Profile';
// import EditProfile from './pages/EditProfile';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
	    <Route path="/signup" element={<SignUp />} />
	    <Route path="/create-profile" element={<CreateProfile />} />
	    <Route path="/explore" element={<Explore />} />
      {/* <Route path="/messages" element={<Messages />} /> */}
	    {/* <Route path="/post-project" element={<PostProject />} /> */}
      {/* <Route path="/profile" element={<Profile />} /> */}
      {/* <Route path="/edit-profile" element={<EditProfile />} /> */}
    </Routes>
  </Router>
);

export default AppRouter;
