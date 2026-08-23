import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => {
        if (r.status === 401) {
          navigate("/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.email) setEmail(data.email);
      });
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as {email ?? "..."}</p>
      <p>Use the navigation to edit frontpage, about, career sections and content types.</p>
    </div>
  );
}
