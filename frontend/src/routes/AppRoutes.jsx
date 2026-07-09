import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Groups from '../pages/Groups';
import GroupDetails from '../pages/GroupDetails';
import Summary from '../pages/Summary';
import Settlements from '../pages/Settlements';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    {/* Auth routes */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Protected app routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route path="/groups/:groupId/summary" element={<Summary />} />
        <Route path="/groups/:groupId/settlements" element={<Settlements />} />
      </Route>
    </Route>

    {/* Redirects */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
