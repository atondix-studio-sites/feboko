import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContentPage() {
  const [data, setData] = useState<{
    services: Array<{ id: string; title: string; slug: string; language: string }>;
    team: Array<{ id: string; name: string }>;
    jobs: Array<{ id: string; title: string }>;
    partners: Array<{ id: string; name: string }>;
    posts: Array<{ id: string; title: string; slug: string }>;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => {
        if (r.status === 401) {
          navigate("/login");
          return null;
        }
        return r.json();
      })
      .then(setData);
  }, [navigate]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Content Overview</h1>
      <section>
        <h2>Services ({data.services.length})</h2>
        <ul>{data.services.map((s) => <li key={s.id}>{s.title} — {s.slug} [{s.language}]</li>)}</ul>
      </section>
      <section>
        <h2>Team ({data.team.length})</h2>
        <ul>{data.team.map((t) => <li key={t.id}>{t.name}</li>)}</ul>
      </section>
      <section>
        <h2>Jobs ({data.jobs.length})</h2>
        <ul>{data.jobs.map((j) => <li key={j.id}>{j.title}</li>)}</ul>
      </section>
      <section>
        <h2>Partners ({data.partners.length})</h2>
        <ul>{data.partners.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
      </section>
      <section>
        <h2>Blog ({data.posts.length})</h2>
        <ul>{data.posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
      </section>
    </div>
  );
}
