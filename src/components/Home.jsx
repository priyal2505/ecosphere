import './Home.css';

export default function Home({ scrollTo }) {
  return (
    <div className="home-container animate-fade-in">
      <header className="hero-section">
        <div className="hero-badge">🏆 Hackathon MVP: Multi-Agent AI Architecture</div>
        <h1 className="gradient-text">Hack the Planet's Carbon,<br/>Not Just Code.</h1>
        <p className="hero-subtitle">
          EcoSphere is a unified AI platform powered by <strong>LangGraph Agents</strong>, <strong>RAG</strong>, and <strong>Vision-Language Models (VLMs)</strong> to optimize energy consumption at the code level and the grid level.
        </p>
      </header>

      <div className="feature-cards-container">
        <div className="feature-card glass-card" onClick={() => scrollTo('eco-code')}>
          <div className="card-icon">💻</div>
          <h3>Eco-Code (RAG)</h3>
          <p>Analyzes your source code against a vector database of green-coding patterns to automatically rewrite inefficient, carbon-heavy loops.</p>
          <button className="btn-secondary">Try Eco-Code →</button>
        </div>

        <div className="feature-card glass-card" onClick={() => scrollTo('grid-sync')}>
          <div className="card-icon">⚡</div>
          <h3>Grid-Sync (Agents)</h3>
          <p>A multi-agent LangGraph workflow that monitors real-time grid carbon intensity to schedule high-energy appliances when renewable energy peaks.</p>
          <button className="btn-secondary">Try Grid-Sync →</button>
        </div>

        <div className="feature-card glass-card" onClick={() => scrollTo('eco-lens')}>
          <div className="card-icon">📷</div>
          <h3>EcoLens (VLM)</h3>
          <p>Uses Vision-Language Models to scan home appliances and immediately suggest localized "Jugaad" hacks to reduce energy consumption.</p>
          <button className="btn-secondary">Try EcoLens →</button>
        </div>
      </div>
    </div>
  );
}
