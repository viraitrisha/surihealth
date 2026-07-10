import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import ForgotPassword from './pages/Forgotpassword';
// import FAQ from './pages/FAQ';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/faq" element={<FAQ />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;