import React, { useState } from "react";

export default function App() {
  const [filters, setFilters] = useState({ country: "All", type: "All", year: "All", genre: "All" });

  const sampleKPIs = { totalTitles: 24834, moviesPct: 62, topGenre: "Drama", topDirector: "Various" };

  const topGenres = [
    { genre: "Drama", value: 8200 },
    { genre: "Documentary", value: 4200 },
    { genre: "Comedy", value: 3800 },
    { genre: "Action", value: 2100 },
    { genre: "Romance", value: 1500 }
  ];

  const sampleTable = [
    { id: 1, title: "Movie A", country: "USA", year: 2021, genre: "Drama", rating: "PG-13" },
    { id: 2, title: "Show B", country: "UK", year: 2019, genre: "Documentary", rating: "TV-MA" },
    { id: 3, title: "Movie C", country: "India", year: 2020, genre: "Comedy", rating: "PG" }
  ];

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>Netflix Global Trends Dashboard</h1>
          <p className="subtitle">Vista táctica - estratégica · País · Género · Año</p>
        </div>

        <div className="header-right">
          <div className="quick-filters">
            <label>
              País
              <select value={filters.country} onChange={e => handleFilterChange("country", e.target.value)}>
                <option value="All">All</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="India">India</option>
                <option value="Mexico">Mexico</option>
              </select>
            </label>

            <label>
              Tipo
              <select value={filters.type} onChange={e => handleFilterChange("type", e.target.value)}>
                <option value="All">All</option>
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>
            </label>

            <button className="btn-apply">Aplicar</button>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="kpi-row">
          <KPICard title="Total títulos (global)" value={sampleKPIs.totalTitles.toLocaleString()} />
          <KPICard title="Movies vs TV Shows" value={`${sampleKPIs.moviesPct}% Movies`} smallNote="porcentaje" />
          <KPICard title="Top género" value={sampleKPIs.topGenre} smallNote="por volumen" />
          <KPICard title="Top director" value={sampleKPIs.topDirector} smallNote="global" />
        </section>

        <section className="main-grid">
          <div className="card map-card">
            <h2>Mapa mundial — títulos por país</h2>
            <MapPlaceholder />
            <div className="small-stats">
              <SmallStat label="País con mayor catálogo" value="USA" />
              <SmallStat label="Mayor crecimiento (2018-2025)" value="India" />
            </div>
          </div>

          <div className="card time-card">
            <h2>Evolución de estrenos por año</h2>
            <ChartPlaceholder label="Serie temporal (placeholder)" />
            <p className="hint">Sugerencia: usar área apilada por tipo (Movies / TV Shows)</p>
          </div>

          <div className="card genres-card">
            <h2>Top 5 géneros</h2>
            <div className="genre-list">
              {topGenres.map((g, i) => (
                <div key={g.genre} className="genre-row">
                  <div className="rank">#{i + 1}</div>
                  <div className="genre-info">
                    <div className="genre-name">{g.genre}</div>
                    <div className="genre-meta">{g.value.toLocaleString()} títulos</div>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${(g.value / topGenres[0].value) * 100}%` }}
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card donut-card">
            <h2>Movies vs TV Shows</h2>
            <ChartPlaceholder label="Donut (placeholder)" />
            <p className="hint">Distribución por tipo de contenido</p>
          </div>

          <div className="card directors-card">
            <h2>Top directores</h2>
            <ul className="directors-list">
              <li>Director A — 120 títulos</li>
              <li>Director B — 98 títulos</li>
              <li>Director C — 88 títulos</li>
            </ul>
          </div>

          <div className="card table-card">
            <h2>Tabla detallada</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>País</th>
                    <th>Año</th>
                    <th>Género</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleTable.map(row => (
                    <tr key={row.id}>
                      <td>{row.title}</td>
                      <td>{row.country}</td>
                      <td>{row.year}</td>
                      <td>{row.genre}</td>
                      <td>{row.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="notes">
          Wireframe generado a partir de la documentación de fase 1/2. Reemplaza los placeholders por componentes de visualización reales y conecta tu ETL/backend.
        </footer>
      </main>
    </div>
  );
}

function KPICard({ title, value, smallNote }) {
  return (
    <div className="kpi-card">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      {smallNote && <div className="kpi-note">{smallNote}</div>}
    </div>
  );
}

function MapPlaceholder() {
  return <div className="placeholder map-placeholder">MAP PLACEHOLDER (react-leaflet / mapbox)</div>;
}

function ChartPlaceholder({ label = "Chart placeholder" }) {
  return <div className="placeholder chart-placeholder">{label}</div>;
}

function SmallStat({ label, value }) {
  return (
    <div className="small-stat">
      <div className="small-label">{label}</div>
      <div className="small-value">{value}</div>
    </div>
  );
}
