import { Navigate } from 'react-router';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AppLayout from './ui/AppLayout';

const routes = [
  // PUBLIC ROUTES
  { path: 'signup', element: <Signup /> },
  { path: 'login', element: <Login /> },
  { path: 'forgot-password', element: <ForgotPassword /> },

  // PRIVATE ROUTES
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to='/dashboard' replace /> },
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
];

export default routes;
