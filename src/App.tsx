import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Builder } from './components/Builder';
import { Pricing } from './components/Pricing';
import { Preview } from './components/Preview';
import { Account } from './components/Account';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AccountSettings } from './components/account/AccountSettings';
import { Dashboard } from './components/Dashboard';
import { Subscriptions } from './components/account/Subscriptions';
import { TeamManagement } from './components/account/TeamManagement';
import { DomainSettings } from './components/account/DomainSettings';
import { CodeExport } from './components/account/CodeExport';
import { BrandingSettings } from './components/account/BrandingSettings';
import { WebsiteEditor } from './components/account/WebsiteEditor';

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/preview/:id" element={<Preview />} />
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/signup" element={<SignUp />} />
        
        {/* Protected Account Routes */}
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="domains" element={<DomainSettings />} />
          <Route path="export" element={<CodeExport />} />
          <Route path="branding" element={<BrandingSettings />} />
          <Route path="website/:id/edit" element={<WebsiteEditor />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}