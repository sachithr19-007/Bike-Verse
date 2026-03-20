import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import BikeDetails from './pages/BikeDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/bike/:id" element={<BikeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
