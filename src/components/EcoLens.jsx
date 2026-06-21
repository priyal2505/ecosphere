import { useState, useRef } from 'react';
import { analyzeApplianceImage } from '../services/api';
import './EcoLens.css';

export default function EcoLens() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];
      const mimeType = file.type;
      
      setScanning(true);
      try {
        const aiResult = await analyzeApplianceImage(base64String, mimeType);
        setResult(aiResult);
      } catch (err) {
        console.error(err);
        setResult({
          appliance: 'Error detecting object',
          confidence: 'N/A',
          insight: 'Failed to communicate with VLM.',
          jugaad: 'Please check your API key and connection.',
          action: 'Try Again'
        });
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleScanClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="ecolens-container">
      <header className="module-header">
        <h2>EcoLens (VLM Scanner)</h2>
        <p className="subtitle">Multimodal Vision-Language Agent for real-world sustainability hacks.</p>
      </header>

      <div className="lens-layout">
        <div className="glass-card viewfinder-pane">
          <div className="viewfinder" style={{backgroundImage: previewUrl ? `url(${previewUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className={`scan-line ${scanning ? 'active' : ''}`}></div>
            {!previewUrl && (
              <div className="camera-placeholder">
                <span className="icon">📷</span>
                <p>Upload image of an appliance</p>
              </div>
            )}
            <div className="corner tl"></div>
            <div className="corner tr"></div>
            <div className="corner bl"></div>
            <div className="corner br"></div>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{display: 'none'}} 
          />
          <button className="btn-primary scan-btn" onClick={handleScanClick} disabled={scanning} data-tooltip="Sends image to Gemini Vision Model">
            {scanning ? 'VLM Processing...' : 'Upload & Scan Image'}
          </button>
        </div>

        <div className="glass-card analysis-pane">
          <h3>VLM Analysis</h3>
          {scanning ? (
            <div className="loading-vlm">
              <div className="loading-spinner"></div>
              <p>Extracting multi-modal features via Gemini 1.5 Pro...</p>
            </div>
          ) : result ? (
            <div className="vlm-result animate-fade-in">
              <div className="result-header">
                <span className="badge success">Object Detected</span>
                <span className="confidence">Conf: {result.confidence}</span>
              </div>
              <h4 className="detected-item">{result.appliance}</h4>
              <div className="insight-box">
                <p><strong>Insight:</strong> {result.insight}</p>
              </div>
              <div className="jugaad-box gradient-border">
                <p>💡 <strong>{result.jugaad}</strong></p>
              </div>
              <button className="btn-secondary action-btn">{result.action}</button>
            </div>
          ) : (
            <div className="placeholder-text">
              <p>Awaiting visual input for inference.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
