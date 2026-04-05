import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './store/AppContext';
import { RoleSelection } from './pages/Login/RoleSelection';
import {
  SeniorLayout, SeniorHome, SeniorHistory, SeniorDevice, SeniorSettings,
  MissingAlertDetail, SeniorConnectedUsers, SeniorAlertSettings,
  SeniorSharingSettings, SeniorHelp,
} from './pages/Senior';
import {
  GuardianLayout, GuardianDashboard, GuardianDevice, GuardianHistory,
  GuardianSettings, IncidentDetail, GuardianTargetManagement,
  GuardianAlertSettings, GuardianExportRecords,
} from './pages/Guardian';
import { IncidentMapViewer } from './pages/Shared/IncidentMapViewer';

const PrivateRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'ELDER' | 'CAREGIVER' }) => {
  const { auth, authReady } = useApp();

  if (!authReady) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (auth.role !== allowedRole) {
    return <Navigate to={auth.role === 'ELDER' ? '/senior' : '/guardian'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />

        {/* Senior Routes */}
        <Route path="/senior" element={
          <PrivateRoute allowedRole="ELDER">
            <SeniorLayout />
          </PrivateRoute>
        }>
          <Route index element={<SeniorHome />} />
          <Route path="history" element={<SeniorHistory />} />
          <Route path="device" element={<SeniorDevice />} />
          <Route path="settings" element={<SeniorSettings />} />
          <Route path="settings/users" element={<SeniorConnectedUsers />} />
          <Route path="settings/alerts" element={<SeniorAlertSettings />} />
          <Route path="settings/sharing" element={<SeniorSharingSettings />} />
          <Route path="settings/help" element={<SeniorHelp />} />
        </Route>

        <Route path="/senior/alert" element={
          <PrivateRoute allowedRole="ELDER">
            <MissingAlertDetail />
          </PrivateRoute>
        } />

        {/* Guardian Routes */}
        <Route path="/guardian" element={
          <PrivateRoute allowedRole="CAREGIVER">
            <GuardianLayout />
          </PrivateRoute>
        }>
          <Route index element={<GuardianDashboard />} />
          <Route path="device" element={<GuardianDevice />} />
          <Route path="history" element={<GuardianHistory />} />
          <Route path="settings" element={<GuardianSettings />} />
          <Route path="settings/target" element={<GuardianTargetManagement />} />
          <Route path="settings/alerts" element={<GuardianAlertSettings />} />
          <Route path="settings/export" element={<GuardianExportRecords />} />
        </Route>

        <Route path="/guardian/incident/:id" element={
          <PrivateRoute allowedRole="CAREGIVER">
            <IncidentDetail />
          </PrivateRoute>
        } />

        <Route path="/map/:id?" element={<IncidentMapViewer />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
