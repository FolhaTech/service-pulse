import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './features/analytics/pages/DashboardPage';
import { ImportPage } from './features/analytics/pages/ImportPage';
import { AuditPage } from './features/analytics/pages/AuditPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/analytics/dashboard" replace />} />
      <Route path="/analytics/dashboard" element={<DashboardPage />} />
      <Route path="/analytics/import" element={<ImportPage />} />
      <Route path="/analytics/audits" element={<AuditPage />} />
      <Route path="*" element={<Navigate to="/analytics/dashboard" replace />} />
    </Routes>
  );
}

export default App;
