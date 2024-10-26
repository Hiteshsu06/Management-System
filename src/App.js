import './App.css';

// utils
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

// components
import Loading from '@common/Loading';
const CompanyForm = lazy(() => import("@components/Company/CompanyForm"));
const StockManagementForm = lazy(() => import("@components/StockManagement/StockManagementForm"));
const StockForm = lazy(() => import("@components/Stock/StockForm"));
const SectorForm = lazy(() => import("@components/Sector/SectorForm"));
const IndicesForm = lazy(() => import("@components/Indices/IndicesForm"));
const ResetPassword = lazy(() => import("@pages/ResetPasswordPage"));
const ImageViewer = lazy(() => import("@common/ImageViewer"));
const SectorwiseStockList = lazy(() => import("@components/Sector/SectorwiseStockList"));

// pages
const Login = lazy(() => import("@pages/LoginPage"));
const ForgotPassword = lazy(() => import("@pages/ForgotPasswordPage"));
const Signup = lazy(() => import("@pages/SignupPage"));
const DashboardPage = lazy(() => import("@pages/DashboardPage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage"));
const NotAuthorizedPage = lazy(() => import("@pages/NotAuthorizedPage"));

export function PrivateRoute({ children, role }) {
  const userRole = JSON.parse(localStorage.getItem('user'))?.role;
  return userRole ? (
      role?.includes(userRole) ? (
          children
      ) : (
          <Navigate to="/not-authorized" />
      )
  ) : (
      <Navigate to="/login" />
  );
}

function App() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
      document.body.classList.add('dark-theme');
  }

  return (
    <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/reset_password/:id" element={<ResetPassword />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/edit-profile/:id" element={<ProfilePage />}/>
          <Route path="/view-chart" element={<ImageViewer />}/>
          <Route path="/dashboard/*" element={<DashboardPage />}/>
          <Route path="/not-authorized" element={<NotAuthorizedPage />}/>
          <Route path="/create-company" element={
            <PrivateRoute
                role={['super_admin', 'viewer']}>
                <CompanyForm />
            </PrivateRoute>}
          />
          <Route path="/edit-company/:id" element={
            <PrivateRoute
                role={['super_admin', 'viewer']}>
                <CompanyForm />
            </PrivateRoute>}
          />
          <Route path="/create-stock-management" element={
            <PrivateRoute
                role={['super_admin', 'viewer']}>
                <StockManagementForm />
            </PrivateRoute>}
          />
          <Route path="/edit-stock-management/:id" element={
            <PrivateRoute
                role={['super_admin', 'viewer']}>
                <StockManagementForm />
            </PrivateRoute>}
          />
          <Route path="/create-stock" element={
            <PrivateRoute
                role={['super_admin', 'admin']}>
                <StockForm />
            </PrivateRoute>}
          />
          <Route path="/edit-stock/:id" element={
            <PrivateRoute
                role={['super_admin', 'admin']}>
                <StockForm />
            </PrivateRoute>}
          />
          <Route path="/create-sector" element={
            <PrivateRoute
                role={['super_admin', 'admin']}>
                <SectorForm />
            </PrivateRoute>}
          />
          <Route path="/edit-sector/:id" element={
            <PrivateRoute
                role={['super_admin', 'admin']}>
                <SectorForm />
            </PrivateRoute>}
          />
          <Route path="/create-index" element={
            <PrivateRoute
                role={['super_admin', 'admin']}>
                <IndicesForm />
            </PrivateRoute>}
          />
          <Route path="/edit-index/:id" element={
            <PrivateRoute
                role={['super_admin', 'admin']}>
                <IndicesForm />
            </PrivateRoute>}
          />
          <Route path="/sector-master/stocks/:id" element={
            <PrivateRoute
                role={['super_admin', 'admin']}>
                <SectorwiseStockList />
            </PrivateRoute>}
          />
        </Routes>
    </Suspense>
  );
}

export default App;
