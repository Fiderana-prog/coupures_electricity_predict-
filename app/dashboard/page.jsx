"use client";

import { useMemo, useState } from "react";
import "./dashboard.css";

import { motion } from "motion/react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "map", label: "Carte", icon: "map" },
  { id: "predictions", label: "Prédictions", icon: "pulse" },
  { id: "alerts", label: "Alertes", icon: "warning" },
];

const riskPoints = [18, 24, 21, 32, 38, 46, 43, 55, 61, 59, 67, 74];
const incidentBars = [24, 39, 31, 53, 44, 68, 57];

function Icon({ name, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    grid: (
      <svg fill="#000000" width={size} height={size} viewBox="0 0 24 24" id="dashboard" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" className="icon flat-color"><path id="secondary" d="M22,4V7a2,2,0,0,1-2,2H15a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2h5A2,2,0,0,1,22,4ZM9,15H4a2,2,0,0,0-2,2v3a2,2,0,0,0,2,2H9a2,2,0,0,0,2-2V17A2,2,0,0,0,9,15Z" style={{ fill: "rgb(44, 169, 188)" }}></path><path id="primary" d="M11,4v7a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H9A2,2,0,0,1,11,4Zm9,7H15a2,2,0,0,0-2,2v7a2,2,0,0,0,2,2h5a2,2,0,0,0,2-2V13A2,2,0,0,0,20,11Z" style={{ fill: "rgb(0, 0, 0)" }}></path></svg>
    ),
    map: (
      <svg {...common}>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
        <path d="M9 3v15M15 6v15" />
      </svg>
    ),
    pulse: (
      <svg {...common}>
        <path d="M3 12h4l2-7 4 14 2-7h6" />
      </svg>
    ),
    warning: (
      <svg {...common}>
        <path d="M10.3 3.8 2.6 18a2 2 0 0 0 1.8 3h15.2a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
    bell: (
      <svg {...common}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    ),
    user: (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),
    pin: (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    logout: (
      <svg {...common}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  };

  return icons[name] ?? null;
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="JIRAMA Predictive">
      <img src="https://i.ibb.co/VWNN1s6Y/image.png" alt="JIRAMA Predictive Logo" />
    </div>
  );
}

function MiniLineChart() {
  const width = 520;
  const height = 210;
  const padding = 22;
  const max = Math.max(...riskPoints);
  const min = Math.min(...riskPoints);
  const coords = riskPoints.map((value, index) => {
    const x = padding + (index / (riskPoints.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
    return [x, y];
  });
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Évolution du risque de coupure">
      <defs>
        <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f58200" stopOpacity=".38" />
          <stop offset="100%" stopColor="#f58200" stopOpacity=".03" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((lineIndex) => {
        const y = padding + lineIndex * ((height - padding * 2) / 3);
        return <line key={lineIndex} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(15,34,53,.10)" strokeDasharray="5 6" />;
      })}
      <polygon points={area} fill="url(#riskFill)" />
      <polyline points={line} fill="none" stroke="#f58200" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={index === coords.length - 1 ? 6 : 3.7} fill="white" stroke="#f58200" strokeWidth="3" />
      ))}
    </svg>
  );
}

function BarChart() {
  const max = Math.max(...incidentBars);
  return (
    <div className="bar-chart" aria-label="Incidents par jour">
      {incidentBars.map((value, index) => (
        <div className="bar-column" key={index}>
          <span className="bar-value">{value}</span>
          <div className="bar" style={{ height: `${(value / max) * 130 + 28}px` }} />
          <span className="bar-label">{["L", "M", "M", "J", "V", "S", "D"][index]}</span>
        </div>
      ))}
    </div>
  );
}

function MadagascarMap() {
  return (
    <div className="map-canvas">
      <svg className="map-grid" viewBox="0 0 640 760" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mapGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".34" />
            <stop offset="100%" stopColor="#f58200" stopOpacity=".16" />
          </linearGradient>
          <filter id="mapGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {Array.from({ length: 11 }).map((_, i) => <line key={`h-${i}`} x1="0" x2="640" y1={i * 76} y2={i * 76} stroke="rgba(255,255,255,.07)" />)}
        {Array.from({ length: 9 }).map((_, i) => <line key={`v-${i}`} y1="0" y2="760" x1={i * 80} x2={i * 80} stroke="rgba(255,255,255,.07)" />)}
        <path d="M364 49c-25 34-42 75-46 116-3 37-26 65-31 102-6 47 15 86 4 124-13 43-3 84 19 119 22 34 24 69 14 102-9 30 5 65 35 82 28 16 60 2 75-30 15-33 9-71 21-105 13-38 38-70 48-112 9-39 3-83 24-118 23-38 38-78 33-117-5-43-30-78-63-103-31-23-76-40-113-60Z" fill="url(#mapGradient)" stroke="#ffad3a" strokeWidth="5" filter="url(#mapGlow)" />
        <path d="M377 91c24 42 16 79 1 114-17 39-17 77 4 111 19 31 24 66 8 98-16 32-14 69 9 101 20 28 23 64 8 100" fill="none" stroke="rgba(255,255,255,.40)" strokeWidth="3" />
        <path d="M334 189c47 11 92 4 139-22M308 313c51 20 106 17 163-2M319 461c48 13 94 12 139-5" fill="none" stroke="rgba(255,255,255,.20)" strokeWidth="2" />
      </svg>
      <MapMarker className="marker-north" label="Antsiranana" risk="85%" tone="critical" />
      <MapMarker className="marker-east" label="Toamasina" risk="72%" tone="high" />
      <MapMarker className="marker-center" label="Antananarivo" risk="68%" tone="high" />
      <MapMarker className="marker-west" label="Mahajanga" risk="45%" tone="medium" />
      <MapMarker className="marker-south" label="Toliara" risk="28%" tone="low" />
    </div>
  );
}

function MapMarker({ className, label, risk, tone }) {
  return (
    <div className={`map-marker ${className} ${tone}`}>
      <span className="marker-dot" />
      <div className="marker-card"><strong>{label}</strong><span>Risque {risk}</span></div>
    </div>
  );
}

function StatCard({ eyebrow, value, meta, tone = "orange", icon }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div><p>{eyebrow}</p><strong>{value}</strong><span>{meta}</span></div>
      <div className="stat-icon"><Icon name={icon} size={30} /></div>
    </article>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [region, setRegion] = useState("Toutes les régions");
  const activeLabel = useMemo(() => tabs.find((item) => item.id === activeTab)?.label ?? "Dashboard", [activeTab]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="dashboard-shell"
    >
      <div className="background-overlay" />
      <header className="topbar">
        <a href="/">
          <BrandMark />
        </a>
        <nav className="main-nav" aria-label="Navigation principale">
          {tabs.map((tab) => (
            <button type="button" key={tab.id} className={activeTab === tab.id ? "nav-item active" : "nav-item"} onClick={() => setActiveTab(tab.id)}>
              <Icon name={tab.icon} /><span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="account-tools">
          <button type="button" className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" size={28} /><span className="notification-count">3</span></button>
          <div className="profile-menu-container">
            <button type="button" className="profile-button" aria-label="Profil utilisateur"><Icon name="user" size={28} /></button>
            <div className="profile-dropdown">
              <a href="/" className="dropdown-item"><Icon name="logout" size={18} /> Déconnexion</a>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-heading">
          <div>
            <span className="eyebrow">JIRAMA PREDICTIVE</span>
            <h1>{activeLabel}</h1>
            <p>Surveillance intelligente du réseau électrique et anticipation des coupures.</p>
          </div>
          <div className="heading-actions">
            <label className="region-select"><Icon name="pin" size={19} /><select value={region} onChange={(event) => setRegion(event.target.value)}><option>Toutes les régions</option><option>Analamanga</option><option>Atsinanana</option><option>Diana</option><option>Boeny</option><option>Atsimo-Andrefana</option></select></label>
            <button type="button" className="primary-button">Voir les détails<Icon name="arrow" size={18} /></button>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="left-column">
            <div className="stats-row">
              <StatCard eyebrow="Niveau de risque" value="Élevé" meta="Score global : 78 / 100" tone="orange" icon="pulse" />
              <StatCard eyebrow="Prédictions de coupure" value="10 zones" meta="3 alertes critiques" tone="red" icon="warning" />
            </div>

            <div className="charts-row">
              <article className="panel line-panel">
                <div className="panel-header"><div><span className="panel-kicker">Analyse temporelle</span><h2>Évolution des coupures</h2></div><select defaultValue="30 jours" aria-label="Période"><option>7 jours</option><option>30 jours</option><option>3 mois</option></select></div>
                <MiniLineChart />
                <div className="chart-footer"><span><i className="legend-dot orange" /> Risque moyen</span><span><i className="legend-dot green" /> Prévisions confirmées</span><strong>+18% ce mois</strong></div>
              </article>

              <article className="panel incident-panel">
                <div className="panel-header"><div><span className="panel-kicker">Activité réseau</span><h2>Incidents du jour</h2></div><span className="status-badge">Temps réel</span></div>
                <BarChart />
                <div className="incident-summary"><div><strong>23</strong><span>Incidents suivis</span></div><div><strong>7</strong><span>Interventions actives</span></div></div>
              </article>
            </div>

            <article className="panel alert-strip">
              <div className="alert-icon"><Icon name="warning" size={30} /></div>
              <div><span className="panel-kicker">Alerte prioritaire</span><h3>Risque élevé détecté à Antananarivo</h3><p>Probabilité de coupure : 68% dans les prochaines 6 heures.</p></div>
              <button type="button">Consulter</button>
            </article>
          </div>

          <article className="map-panel">
            <div className="map-header"><div><span className="panel-kicker">Vue géographique</span><h2>Carte des zones à risque</h2></div><button type="button" className="map-action">Agrandir</button></div>
            <MadagascarMap />
            <div className="risk-legend"><span><i className="risk-dot critical" /> Critique</span><span><i className="risk-dot high" /> Élevé</span><span><i className="risk-dot medium" /> Modéré</span><span><i className="risk-dot low" /> Faible</span></div>
          </article>
        </section>
      </main>
    </motion.div>
  );
}
