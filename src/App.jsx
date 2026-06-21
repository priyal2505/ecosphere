import { useState } from 'react'
import './App.css'
import './tooltip.css'
import Home from './components/Home'
import GridSync from './components/GridSync'
import EcoCode from './components/EcoCode'
import EcoLens from './components/EcoLens'

function App() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar sticky-nav animate-fade-in">
        <div className="logo gradient-text" onClick={() => scrollToSection('home')} style={{cursor: 'pointer'}}>
          EcoSphere AI
        </div>
        <div className="nav-tabs">
          <button 
            className="tab-btn"
            onClick={() => scrollToSection('home')}
            data-tooltip="View EcoSphere Overview"
          >
            Home
          </button>
          <button 
            className="tab-btn"
            onClick={() => scrollToSection('eco-code')}
            data-tooltip="Optimize code via Vector DB"
          >
            Eco-Code (RAG)
          </button>
          <button 
            className="tab-btn"
            onClick={() => scrollToSection('grid-sync')}
            data-tooltip="Multi-agent appliance scheduler"
          >
            Grid-Sync (Agents)
          </button>
          <button 
            className="tab-btn"
            onClick={() => scrollToSection('eco-lens')}
            data-tooltip="Scan appliances using Vision AI"
          >
            EcoLens (VLM)
          </button>
        </div>
      </nav>

      <div className="content-area">
        <section id="home" className="page-section">
          <Home scrollTo={scrollToSection} />
        </section>
        
        <section id="eco-code" className="page-section">
          <div className="section-title">
            <h2>Eco-Code</h2>
            <p>RAG-Powered Green Code Optimizer</p>
          </div>
          <EcoCode />
        </section>
        
        <section id="grid-sync" className="page-section">
          <GridSync />
        </section>
        
        <section id="eco-lens" className="page-section">
          <EcoLens />
        </section>
      </div>
    </div>
  )
}

export default App
