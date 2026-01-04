import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { SignupPage } from '../pages/SignupPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { CompleteOAuthPage } from '../pages/CompleteOAuthPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from '../components/AppShell';

// Main Pages
import { VictusConsole } from '../pages/VictusConsole';
import { SettingsPage } from '../pages/SettingsPage';
import { SessionTimeline } from '../pages/SessionTimeline';
import { OnboardingPage } from '../pages/OnboardingPage';
import { AdminSessionSummary } from '../pages/AdminSessionSummary';

// Legacy / Other Pages (Preserved)
import { ChatView } from '../components/chat/ChatView';
import { ApprovalsPanel } from '../components/approvals/ApprovalsPanel';
import { TracesPanel } from '../components/traces/TracesPanel';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { VisualsPanel } from '../components/visuals/VisualsPanel';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/complete-oauth" element={<CompleteOAuthPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          <Route element={<AppShell><Outlet /></AppShell>}>
            <Route path="/" element={<VictusConsole />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/sessions/:sessionId" element={<SessionTimeline />} />
            
            {/* Admin Routes */}
            <Route path="/admin/sessions/:sessionId" element={<AdminSessionSummary />} />
            
            {/* Preserved Legacy Routes */}
            <Route path="/chat-legacy" element={<ChatView />} />
            <Route path="/c/:conversationId" element={<ChatView />} />
            <Route path="/approvals" element={<ApprovalsPanel />} />
            <Route path="/traces" element={<TracesPanel />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/visuals" element={<VisualsPanel />} />
          </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
