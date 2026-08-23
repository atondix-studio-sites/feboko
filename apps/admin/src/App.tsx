import { Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FrontpagePage from "./pages/FrontpagePage";
import ContentPage from "./pages/ContentPage";

export default function App() {
  return (
    <div className="admin-app">
      <header className="admin-header">
        <Link to="/">FeBoKo Admin</Link>
        <nav>
          <Link to="/frontpage">Frontpage</Link>
          <Link to="/about">About</Link>
          <Link to="/career">Career</Link>
          <Link to="/content">Content</Link>
        </nav>
      </header>
      <main className="admin-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/frontpage" element={<FrontpagePage pageKey="frontpage" title="Frontpage Settings" />} />
          <Route path="/about" element={<FrontpagePage pageKey="about" title="About Page Settings" />} />
          <Route path="/career" element={<FrontpagePage pageKey="career" title="Career Page Settings" />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
