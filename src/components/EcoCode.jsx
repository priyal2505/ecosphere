import { useState } from 'react';
import { analyzeCodeFootprint } from '../services/api';
import './EcoCode.css';

const files = {
  'main.py': 'def process_data(items):\n  results = []\n  for item in items:\n    # computationally heavy\n    results.append(item * 2)\n  return results',
  'utils.js': 'function calculateSum(arr) {\n  let sum = 0;\n  for(let i=0; i<arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}',
  'package.json': '{\n  "name": "ecosphere",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0"\n  }\n}'
};

export default function EcoCode() {
  const [activeFile, setActiveFile] = useState('main.py');
  const [code, setCode] = useState(files['main.py']);
  const [optimized, setOptimized] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSwitch = (fileName) => {
    setActiveFile(fileName);
    setCode(files[fileName]);
    setShowDiff(false);
    setMetrics(null);
    setErrorMsg('');
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Determine language context
      let lang = "Python";
      if (activeFile.endsWith('.js')) lang = "JavaScript";
      if (activeFile.endsWith('.json')) lang = "JSON";

      const res = await analyzeCodeFootprint(code, lang, "Aggressive");
      setOptimized(res.optimizedCode);
      setMetrics(res.metrics);
      setShowDiff(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'API Error. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ide-container animate-fade-in">
      
      {/* Activity Bar */}
      <div className="ide-activity-bar">
        <div className="ide-icon active">📄</div>
        <div className="ide-icon">🔍</div>
        <div className="ide-icon">⎇</div>
        <div className="ide-icon eco-icon">🌱</div>
      </div>

      {/* Sidebar */}
      <div className="ide-sidebar">
        <div className="sidebar-header">EXPLORER</div>
        <div className="file-tree">
          <div className="folder">
            <span>▼ ecosphere-project</span>
            <div className={`file ${activeFile === 'main.py' ? 'active' : ''}`} onClick={() => handleFileSwitch('main.py')}>📄 main.py</div>
            <div className={`file ${activeFile === 'utils.js' ? 'active' : ''}`} onClick={() => handleFileSwitch('utils.js')}>📄 utils.js</div>
            <div className={`file ${activeFile === 'package.json' ? 'active' : ''}`} onClick={() => handleFileSwitch('package.json')}>📄 package.json</div>
          </div>
        </div>
        
        <div className="sidebar-toolbar">
          <div className="toolbar-group" data-tooltip="Set how aggressively the AI refactors logic">
            <label>Optimization:</label>
            <select className="tool-select">
              <option>Aggressive (Max Carbon)</option>
              <option>Safe (Preserve Logic)</option>
            </select>
          </div>
          <div className="toolbar-group rag-status" data-tooltip="Live connection to AWS Sustainability Patterns DB">
            <span className="dot active-dot"></span>
            <span>Vector DB Connected</span>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="ide-main">
        {/* Editor Tabs */}
        <div className="ide-tabs">
          <div className="ide-tab active">{activeFile}</div>
          <div className="ide-tab action-tab">
             <button className="ide-analyze-btn" onClick={handleAnalyze} disabled={loading} data-tooltip="Sends code to Gemini for optimization">
              {loading ? '⟳ Analyzing...' : '🌱 Run Eco-Analyzer'}
             </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className={`ide-editor-area ${showDiff ? 'split-view' : ''}`}>
          <div className="editor-pane">
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              className="ide-textarea"
              spellCheck="false"
            />
          </div>

          {showDiff && !errorMsg && (
            <div className="editor-pane diff-pane">
              <div className="diff-header">
                <span className="badge success">Eco-Optimized (RAG)</span>
                <button className="ide-apply-btn" onClick={() => {setCode(optimized); setShowDiff(false)}}>Apply Changes</button>
              </div>
              <pre className="ide-code-view"><code>{optimized}</code></pre>
            </div>
          )}
        </div>

        {/* Terminal / Output Panel */}
        <div className="ide-panel">
          <div className="panel-tabs">
            <span className="panel-tab">TERMINAL</span>
            <span className="panel-tab">OUTPUT</span>
            <span className="panel-tab active">ECO-METRICS</span>
          </div>
          <div className="panel-content">
            {loading ? (
              <div className="terminal-log text-warning">
                &gt; Connecting to Green Vector DB...<br/>
                &gt; Scanning AST for carbon hotspots...<br/>
                &gt; Retrieving AWS Sustainability Patterns...
              </div>
            ) : errorMsg ? (
               <div className="terminal-log text-error" style={{color: '#ef4444'}}>
                 &gt; Analysis Failed: {errorMsg}
               </div>
            ) : metrics ? (
              <div className="metrics-terminal">
                <div className="terminal-log text-success">
                  &gt; Analysis Complete. Inefficient structure detected.
                </div>
                <div className="metrics-row ide-metrics">
                  <div className="metric-box">
                    <span>CO₂ Saved</span>
                    <strong>{metrics.co2Saved || 'N/A'}</strong>
                  </div>
                  <div className="metric-box">
                    <span>CPU Cycles</span>
                    <strong>{metrics.cpuCyclesSaved || 'N/A'}</strong>
                  </div>
                  <div className="metric-box">
                    <span>Time Saved</span>
                    <strong>{metrics.timeSaved || 'N/A'}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="terminal-log">
                &gt; EcoSphere Agent ready. Click 'Run Eco-Analyzer' to scan code.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
