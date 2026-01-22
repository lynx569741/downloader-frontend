import React, { useEffect, useState } from "react";

const API = window.location.origin;

export default function App() {
  const [page, setPage] = useState("jeux");
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("OFFLINE");
  const [loading, setLoading] = useState(true);

  // Status ping
  useEffect(() => {
    const ping = () => {
      fetch(`${API}/api/status`)
        .then((r) => r.json())
        .then((j) => setStatus(j.status))
        .catch(() => setStatus("OFFLINE"));
    };
    ping();
    const i = setInterval(ping, 1500);
    return () => clearInterval(i);
  }, []);

  // List load
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/${page}`)
      .then((r) => r.json())
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const download = (name) => {
    window.location.href = `${API}/download/${page}/${encodeURIComponent(
      name
    )}.zip`;
  };

  const filtered = list.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{css}</style>

      <div className="scanlines" />

      <div className="app">
        <header className="header">
          <div className="logo">
            <span className="logo-neon">⚡ Anto</span>
            <span className="logo-sub">• Gaming Downloader</span>
          </div>

          <div className="nav">
            <button
              className={page === "jeux" ? "navBtn active" : "navBtn"}
              onClick={() => setPage("jeux")}
            >
              Jeux
            </button>
            <button
              className={page === "logiciels" ? "navBtn active" : "navBtn"}
              onClick={() => setPage("logiciels")}
            >
              Logiciels
            </button>
          </div>

          <div className={`status ${status.toLowerCase()}`}>
            <span className="dot" />
            <span className="statusText">
              {status === "ONLINE" ? "Serveur ONLINE" : "Serveur OFFLINE"}
            </span>
          </div>
        </header>

        <div className="searchBox">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Rechercher un ${page}...`}
          />
        </div>

        <div className="grid">
          {loading ? (
            <div className="loader">
              <div className="loaderRing" />
              <div className="loaderText">Chargement...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              Aucun résultat
            </div>
          ) : (
            filtered.map((name, i) => (
              <div
                className="card"
                key={name}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="imgWrap">
                  <img
                    src={`${API}/images/${page}/${encodeURIComponent(name)}`}
                    onError={(e) =>
                      (e.target.src =
                        "https://picsum.photos/600/300?random=" + i)
                    }
                    alt={name}
                  />
                </div>

                <div className="cardBody">
                  <div className="title">{name}</div>
                  <button onClick={() => download(name)}>
                    Télécharger
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

const css = `
* { box-sizing: border-box; }

body {
  margin: 0;
  background: #03040a;
  font-family: 'Orbitron', 'Segoe UI', sans-serif;
  color: #fff;
}

/* SCANLINES */
.scanlines {
  pointer-events: none;
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255,255,255,0.02),
    rgba(255,255,255,0.02) 1px,
    transparent 2px,
    transparent 4px
  );
  z-index: 999;
}

/* APP */
.app {
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 20%, #00ffff22, transparent),
    radial-gradient(circle at 80% 80%, #0066ff22, transparent),
    linear-gradient(135deg, #02030f, #040824);
  animation: bgShift 30s infinite linear;
}

@keyframes bgShift {
  from { background-position: 0% 0%; }
  to { background-position: 300% 300%; }
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px;
  backdrop-filter: blur(16px);
  background: rgba(0,0,0,0.6);
  border-bottom: 1px solid #00ffff33;
}

.logo {
  font-size: 26px;
  font-weight: 800;
  color: #00ffff;
  text-shadow: 0 0 20px #00ffff;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.logo-neon {
  animation: neonGlow 2.5s infinite;
}

.logo-sub {
  font-size: 14px;
  color: #aefcff;
  opacity: 0.7;
}

@keyframes neonGlow {
  0%, 100% { text-shadow: 0 0 6px #00ffff, 0 0 20px #00ffff; }
  50% { text-shadow: 0 0 10px #00ffff, 0 0 35px #00ffff; }
}

.nav {
  display: flex;
  gap: 18px;
}

.navBtn {
  padding: 12px 28px;
  border-radius: 16px;
  border: 1px solid #00ffff55;
  background: transparent;
  color: #aefcff;
  cursor: pointer;
  transition: all 0.3s;
}

.navBtn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 25px #00ffff;
}

.navBtn.active {
  background: linear-gradient(135deg, #00ffff, #0077ff);
  color: #000;
}

/* STATUS */
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid #00ffff33;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
}

.status .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 1.2s infinite;
}

.status.online { color: #00ff9d; }
.status.online .dot { background: #00ff9d; box-shadow: 0 0 12px #00ff9d; }

.status.offline { color: #ff4d4d; }
.status.offline .dot { background: #ff4d4d; box-shadow: 0 0 12px #ff4d4d; }

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.6); }
  100% { transform: scale(1); }
}

/* SEARCH */
.searchBox {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.searchBox input {
  width: 560px;
  max-width: 90%;
  padding: 18px 24px;
  border-radius: 22px;
  border: 1px solid #00ffff55;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 16px;
  transition: 0.3s;
}

.searchBox input:focus {
  box-shadow: 0 0 35px #00ffff;
  outline: none;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 34px;
  padding: 0 40px 80px;
}

/* CARD */
.card {
  background: rgba(0,0,0,0.6);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #00ffff22;
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  animation: cardIn 0.6s forwards;
  transition: transform 0.4s;
}

@keyframes cardIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card:hover {
  transform: perspective(800px) rotateX(6deg) rotateY(-6deg) scale(1.06);
  box-shadow: 0 0 50px #00ffff;
}

.imgWrap {
  height: 160px;
  overflow: hidden;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.card:hover img {
  transform: scale(1.2);
}

.cardBody {
  padding: 18px;
}

.title {
  margin-bottom: 16px;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card button {
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: linear-gradient(135deg, #00ffff, #0077ff);
  transition: 0.3s;
}

.card button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px #00ffff;
}

/* LOADER */
.loader {
  grid-column: span 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #aefcff;
}

.loaderRing {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(0,255,255,0.2);
  border-top: 5px solid #00ffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loaderText {
  font-size: 14px;
  color: #aefcff;
}

.empty {
  grid-column: span 12;
  text-align: center;
  padding: 40px 0;
  color: #a2a6b6;
}
`;