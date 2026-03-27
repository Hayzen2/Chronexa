import { Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import ResetExpired from './pages/Authentication/PasswordResetExpired';
import ResetSuccess from './pages/Authentication/PasswordResetSuccessful';
import NotFoundPage from './pages/404NotFound';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import TaskDetails from './pages/Tasks/TasksDetails';
import UserProfile from './pages/UserProfile';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';

import './App.css'

function App() {
  const { accessToken } = useAuth();
  // If not logged in, show only auth pages
  if (!accessToken) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-expired" element={<ResetExpired />} />
            <Route path="/reset-success" element={<ResetSuccess />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }
  else{
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex flex-col flex-grow">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    )
  }
}

export default App
