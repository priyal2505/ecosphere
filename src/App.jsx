import { useState } from 'react'
import './App.css'
import './tooltip.css'
import Home from './components/Home'
import GridSync from './components/GridSync'
import EcoCode from './components/EcoCode'
import EcoLens from './components/EcoLens'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home navigateTo={setActiveTab} />
      case 'eco-code': return <EcoCode />
      case 'grid-sync': return <GridSync />
      case 'eco-lens': return <EcoLens />
      default: return <Home navigateTo={setActiveTab} />
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar animate-fade-in">
        <div className="logo gradient-text" onClick={() => setActiveTab('home')} style={{cursor: 'pointer'}}>
          EcoSphere AI
        </div>
        <div className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            data-tooltip="View EcoSphere Overview"
          >
            Home
          </button>
          <button 
            className={`tab-btn ${activeTab === 'eco-code' ? 'active' : ''}`}
            onClick={() => setActiveTab('eco-code')}
            data-tooltip="Optimize code via Vector DB"
          >
            Eco-Code (RAG)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'grid-sync' ? 'active' : ''}`}
            onClick={() => setActiveTab('grid-sync')}
            data-tooltip="Multi-agent appliance scheduler"
          >
            Grid-Sync (Agents)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'eco-lens' ? 'active' : ''}`}
            onClick={() => setActiveTab('eco-lens')}
            data-tooltip="Scan appliances using Vision AI"
          >
            EcoLens (VLM)
          </button>
        </div>
      </nav>

      <main className="content-area animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {renderContent()}
      </main>
    </div>
  )
}

export default App
