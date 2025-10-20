import React from 'react';
import './LandingPortal.css';

export default function LandingPortal({ onSelect }) {
  return (
    <div className="landing-portal">
      <h1>Emotion Resonate</h1>

      <div className="project-short-description">
        <p>
          Your smart companion for instant emotion detection and support. Choose Text, Face, or Voice analysis—get feedback, empathy, and privacy, powered by real AI.
        </p>
      </div>

      <div className="card-container">
        <div className="card glowing" onClick={() => onSelect('text')}>
          <span role="img" aria-label="Chat">💬</span>
          <p>Text Analysis</p>
        </div>
        <div className="card glowing" onClick={() => onSelect('video')}>
          <span role="img" aria-label="Camera">📷</span>
          <p>Face Analysis</p>
        </div>
        <div className="card glowing" onClick={() => onSelect('voice')}>
          <span role="img" aria-label="Microphone">🎤</span>
          <p>Voice Analysis</p>
        </div>
      </div>

      <div className="project-description">
        <p>
          Emotion Resonate is an AI-powered application that helps users understand and respond to their emotions in real time. Choose how you want to analyze your mood: through text, face, or voice input. The app detects your emotional state and instantly provides a supportive message and avatar that matches your mood. We believe emotional awareness and empathy should be accessible and safe—so everything runs locally and no data ever leaves your device. Explore your emotions, get instant feedback, and feel supported, every time you use Emotion Resonate!
        </p>
      </div>

      <div className="info-video-section">
        <div className="intro-panel">
          <h2>Welcome to Emotion Resonate</h2>
          <p>
            🎯 <b>This app detects and responds to your emotions using AI.</b>
            <br />
            <span style={{color:'#00509e'}}>Choose your comfort: Analyze your mood through text, face, or voice.</span>
          </p>
          <ul className="feature-list">
            <li>📝 <b>Text Analysis:</b> Type a message and get instant mood and support.</li>
            <li>📷 <b>Face Analysis:</b> Use your webcam for live mood detection, or capture a photo to analyze.</li>
            <li>🎤 <b>Voice Analysis:</b> Speak to sense your mood and get feedback.</li>
          </ul>
          <p className="privacy-msg">
            🔒 <b>Privacy First:</b> All analysis runs locally in your browser. No data leaves your device.
          </p>
        </div>
        <div className="demo-video-container">
          <video
            src="/how-to-use.mp4"
            width="420"
            height="260"
            controls
            style={{ borderRadius: '15px', boxShadow: '0 6px 15px rgba(0,0,0,0.2)', margin: '10px auto' }}
          />
        </div>
      </div>
    </div>
  );
}
