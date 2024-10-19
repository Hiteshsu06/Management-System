import './App.css';

// components
import Loading from '@common/Loading';

// utils
import { lazy, Suspense } from "react";
import { Routes, Route } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

// pages
const Login = lazy(() => import("@pages/LoginPage"));
const ForgotPassword = lazy(() => import("@pages/ForgotPasswordPage"));
const Signup = lazy(() => import("@pages/SignupPage"));
const DashboardPage = lazy(() => import("@pages/DashboardPage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage"));
const CompanyForm = lazy(() => import("@components/Company/CompanyForm"));
const StockManagementForm = lazy(() => import("@components/StockManagement/StockManagementForm"));
const StockForm = lazy(() => import("@components/Stock/StockForm"));
const SectorForm = lazy(() => import("@components/Sector/SectorForm"));
const IndicesForm = lazy(() => import("@components/Indices/IndicesForm"));
const ResetPassword = lazy(() => import("@pages/ResetPasswordPage"));

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
          <Route path="/dashboard/*" element={<DashboardPage />}/>
          <Route path="/create-company" element={<CompanyForm />}/>
          <Route path="/create-stock" element={<StockForm />}/>
          <Route path="/create-sector" element={<SectorForm />}/>
          <Route path="/create-index" element={<IndicesForm />}/>
          <Route path="/edit-stock/:id" element={<StockForm />}/>
          <Route path="/edit-sector/:id" element={<SectorForm />}/>
          <Route path="/edit-index/:id" element={<IndicesForm />}/>
          <Route path="/edit-company/:id" element={<CompanyForm />}/>
          <Route path="/create-stock-management" element={<StockManagementForm />}/>
          <Route path="/edit-stock-management/:id" element={<StockManagementForm />}/>
          <Route path="/edit-profile" element={<ProfilePage />}/>
        </Routes>
    </Suspense>
  );
}

export default App;
