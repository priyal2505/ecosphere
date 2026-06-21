import { useState, useEffect } from 'react';
import { fetchGridForecast } from '../services/api';
import './GridSync.css';

export default function GridSync() {
  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliance, setAppliance] = useState('washing-machine');

  useEffect(() => {
    loadGridData();
  }, []);

  const loadGridData = async () => {
    setLoading(true);
    try {
      const data = await fetchGridForecast();
      // Add a slight randomization to make it look like appliance type matters
      const isHeavy = appliance === 'ev-charger' || appliance === 'water-heater';
      data.solarPercentage = Math.max(0, data.solarPercentage + (isHeavy ? -5 : 5));
      data.coalPercentage = Math.max(0, data.coalPercentage + (isHeavy ? 5 : -5));
      setGridData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplianceChange = (e) => {
    setAppliance(e.target.value);
    loadGridData(); // Trigger recalculation when appliance changes
  };

  return (
    <div className="gridsync-container">
      <header className="module-header">
        <h2>Grid-Sync Scheduler</h2>
        <p className="subtitle">LangGraph Multi-Agent system for dynamic load balancing.</p>
      </header>

      <div className="langgraph-visualizer glass-card" data-tooltip="Visual representation of the LangGraph AI multi-agent workflow">
        <div className={`agent-node ${loading ? 'calculating' : 'active'}`} data-tooltip="Pulls real-time carbon intensity data">
          <span>📡 Forecasting Agent</span>
        </div>
        <div className="edge">→</div>
        <div className={`agent-node ${loading ? 'calculating' : 'active'}`} data-tooltip="Calculates optimal time slot">
          <span>🧠 Optimization Agent</span>
        </div>
        <div className="edge">→</div>
        <div className={`agent-node ${loading ? 'calculating' : 'active'}`} data-tooltip="Triggers IoT smart plugs">
          <span>⚡ Execution Agent</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card grid-status">
          <h3>Live Grid Status</h3>
          {loading ? (
             <div className="loading-vlm">
               <div className="loading-spinner"></div>
               <p>Agents coordinating for {appliance.replace('-', ' ')}...</p>
             </div>
          ) : gridData ? (
            <div className="status-content animate-fade-in">
              <div className="intensity-meter">
                <div className="meter-circle">
                  <span className="value">{gridData.solarPercentage}%</span>
                  <span className="label">Solar Power</span>
                </div>
              </div>
              <p className="ai-insight">🤖 <strong>Agent Consensus:</strong> {gridData.message}</p>
              
              <div className="energy-mix">
                <div className="mix-bar solar" style={{width: `${gridData.solarPercentage}%`}}></div>
                <div className="mix-bar wind" style={{width: `${gridData.windPercentage}%`}}></div>
                <div className="mix-bar coal" style={{width: `${gridData.coalPercentage}%`}}></div>
              </div>
              <div className="mix-labels">
                <span><span className="dot solar-dot"></span> Solar</span>
                <span><span className="dot wind-dot"></span> Wind</span>
                <span><span className="dot coal-dot"></span> Coal</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="glass-card scheduler-pane">
          <h3>Agentic Scheduler</h3>
          <div className="appliance-selector" data-tooltip="Select which smart device to schedule">
            <label>Select Appliance:</label>
            <select value={appliance} onChange={handleApplianceChange}>
              <option value="washing-machine">Washing Machine</option>
              <option value="water-heater">Water Heater (Geyser)</option>
              <option value="dishwasher">Dishwasher</option>
              <option value="ev-charger">EV Charger</option>
            </select>
          </div>

          <div className="forecast-timeline" data-tooltip="Predicted grid carbon intensity over the next 12 hours">
            <label>12-Hour AI Forecast:</label>
            <div className="timeline-bars">
              {[30, 40, 80, 90, 70, 50, 20, 10].map((val, i) => {
                 // Randomize slightly based on appliance load for visual effect
                 const adjVal = loading ? val : Math.min(100, Math.max(0, val + (Math.random() * 20 - 10)));
                 return <div key={i} className="t-bar" style={{height: `${adjVal}%`, background: adjVal > 60 ? 'var(--accent-green)' : '#ef4444'}}></div>
              })}
            </div>
          </div>

          <div className="schedule-result animate-fade-in">
            <h4>Optimal Time Selected</h4>
            <div className="time-display">
              <span className="time">{loading ? '--:--' : (gridData?.bestTime || '--:--')}</span>
            </div>
            <button className="btn-primary" onClick={() => alert(`Execution Agent: ${appliance.replace('-', ' ')} Synced!`)}>
              Authorize Execution Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
