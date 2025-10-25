import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import Sentiment from 'sentiment';
import ReactWebcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import LandingPortal from './LandingPortal';



function App() {
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [mood, setMood] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [showFinalSupport, setShowFinalSupport] = useState(false);
  const [mode, setMode] = useState('');
  const [faceInputMode, setFaceInputMode] = useState('video');
  const [capturedImg, setCapturedImg] = useState(null);
  const [loading, setLoading] = useState(false);



  const [role, setRole] = useState(""); // "", "user", "admin"
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');



  const sentiment = new Sentiment();
  const webcamRef = useRef(null);



  const moodToMessage = {
    happy: "Keep smiling! Your positivity encourages others.",
    sad: "It's okay to feel sad. Take time for yourself and know you're not alone.",
    angry: "Let your feelings settle—take a few deep breaths. Things can improve!",
    bored: "Maybe try something new or creative. Variety helps lift the mood!",
    confused: "It's normal to feel uncertain. Ask for help or pause to think—it will get clearer soon.",
    cry: "Letting your emotions out is healthy. Take comfort in small joys and support.",
    disgusted: "Try not to focus on what's unpleasant. Shift to something that brings you peace.",
    fearful: "Courage grows slowly. Face your fears one step at a time—you've got this!",
    frustration: "Take a small break. Remember, setbacks are part of growth.",
    mild_fear: "If you're worried, talk it out or take it slow. You're stronger than you think.",
    neutral: "Hope your day is calm. Balance is good for the mind and body.",
    smiling: "That smile can brighten anyone's day—including yours!",
    surprised: "Surprises can be exciting or shocking. Embrace new possibilities!"
  };
  const moodToAvatar = {
    happy: require('./avatar-happy.jpg'),
    sad: require('./avatar-sad.jpg'),
    angry: require('./avatar-angry.jpg'),
    bored: require('./avatar-bored.jpg'),
    confused: require('./avatar-confused.jpg'),
    cry: require('./avatar-cry.jpg'),
    disgusted: require('./avatar-disgusted.jpg'),
    fearful: require('./avatar-fearful.jpg'),
    frustration: require('./avatar-frustration.jpg'),
    mild_fear: require('./avatar-mild-fear.jpg'),
    neutral: require('./avatar-neutral.jpg'),
    smiling: require('./avatar-smiling.jpg'),
    surprised: require('./avatar-surprised.jpg'),
  };
  const avatarSrc = moodToAvatar[mood] || moodToAvatar.neutral;
  function speakMessage(message) {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  }



  useEffect(() => {
    if (role === "user") {
      const savedMood = localStorage.getItem('mood');
      if (savedMood) {
        setMood(savedMood);
        setShowFinalSupport(true);
      }
    }
  }, [role]);
  
  useEffect(() => {
    if (role === "user" && mood) {
      localStorage.setItem('mood', mood);
      localStorage.setItem(`userMood_${Date.now()}`, mood);
    }
  }, [mood, role]);



  function saveResult() {
    const result = `Mood: ${mood}\nMessage: ${moodToMessage[mood] || ""}`;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emotion_result.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  function shareResult() {
    const shareData = {
      title: 'My Emotion Resonate Result',
      text: `Mood: ${mood}\nMessage: ${moodToMessage[mood] || ""}`,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.text);
      alert('Result copied to clipboard!');
    }
  }

  // ✅ FIXED: Load models with TensorFlow.js backend initialization
  useEffect(() => {
    setLoading(true);
    
    const loadModels = async () => {
      try {
        // Wait for TensorFlow.js backend to initialize
        await faceapi.tf.ready();
        console.log('✅ TensorFlow.js backend ready');
        
        // Now load all face-api models
        await Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.mtcnn.loadFromUri('/models'),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models'),
]);
     
        setModelsLoaded(true);
        setLoading(false);
        console.log('✅ All face-api models loaded successfully!');
      } catch (error) {
        console.error('❌ Error loading models:', error);
        setModelsLoaded(false);
        setLoading(false);
      }
    };
    
    loadModels();
  }, []);



  // LANDING COLOURFUL PAGE
  if (!role) {
    return (
      <div className="landing-choice">
        <h1>Welcome to Emotion Resonate</h1>
        <div style={{ margin: "40px" }}>
          <button onClick={() => setRole("user")}>I am User</button>
          <button onClick={() => setRole("admin")}>I am Admin</button>
        </div>
        {/* Footer always */}
        <div className="footer-signature">
          &copy; {new Date().getFullYear()} &mdash; Created by HARSHITHA M V
        </div>
      </div>
    );
  }
  
  // ADMIN LOGIN
  if (role === "admin" && !adminLoggedIn) {
    return (
      <div className="admin-login-bg">
        <div className="admin-login-box">
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={adminPasswordInput}
            onChange={e => setAdminPasswordInput(e.target.value)}
          />
          <br />
          <button
            onClick={() => {
              if (adminPasswordInput === "Harsha@9353") {
                setAdminLoggedIn(true);
              } else {
                alert("Incorrect password");
              }
            }}
          >
            Login
          </button>
          <br />
          <button className="back-btn" onClick={() => { setRole(""); setAdminPasswordInput(""); }}>
            Go Back
          </button>
        </div>
        <div className="footer-signature">
          &copy; {new Date().getFullYear()} &mdash; Created by HARSHITHA M V
        </div>
      </div>
    );
  }
  
  // ADMIN DASHBOARD
  if (role === "admin" && adminLoggedIn) {
    let allMoods = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('userMood_')) {
        allMoods.push({ key, mood: localStorage.getItem(key) });
      }
    }
    return (
      <div style={{ padding: 20, minHeight: "98vh", display: "flex", flexDirection: "column" }}>
        <h1>Admin Dashboard - User Moods</h1>
        <button onClick={() => {
          setAdminLoggedIn(false);
          setAdminPasswordInput("");
        }}>Logout</button>
        <button style={{ marginLeft: 16 }} onClick={() => setRole("")}>Switch to Landing</button>
        {allMoods.length > 0 ? (
          <ul>
            {allMoods.map(({ key, mood }) => (
              <li key={key}>{key}: {mood}</li>
            ))}
          </ul>
        ) : (
          <p>No user mood data found.</p>
        )}
        <div className="footer-signature">
          &copy; {new Date().getFullYear()} &mdash; Created by HARSHITHA M V
        </div>
      </div>
    );
  }
  
  // USER MODE NORMAL APP
  const consolingMessage = moodToMessage[mood] || "I'm here for you, no matter what you're feeling.";
  
  const detectFacialEmotion = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      setLoading(true);
      setShowFinalSupport(false);
      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const detection = await faceapi
        .detectSingleFace(canvas, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
      if (detection && detection.expressions) {
        const expressions = detection.expressions;
        const maxValue = Math.max(...Object.values(expressions));
        const emotion = Object.keys(expressions).find(
          item => expressions[item] === maxValue
        );
        setMood(emotion);
        setShowFinalSupport(true);
      } else {
        setMood('neutral');
        setShowFinalSupport(true);
      }
      setLoading(false);
    }
  };
  
  const analyzeFacialEmotionPhoto = async (imgSrc) => {
    setLoading(true);
    setShowFinalSupport(false);
    return new Promise(resolve => {
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = async () => {
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();
        if (detection && detection.expressions) {
          const expressions = detection.expressions;
          const maxValue = Math.max(...Object.values(expressions));
          const emotion = Object.keys(expressions).find(
            item => expressions[item] === maxValue
          );
          setMood(emotion);
          setShowFinalSupport(true);
        } else {
          setMood('neutral');
          setShowFinalSupport(true);
        }
        setLoading(false);
        resolve();
      };
    });
  };
  
  function startVoiceListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceTranscript(transcript);
      const result = sentiment.analyze(transcript);
      let detectedMood = 'neutral';
      if (result.score > 0) detectedMood = 'happy';
      if (result.score < 0) detectedMood = 'sad';
      setMood(detectedMood);
      setShowFinalSupport(true);
      speakMessage(moodToMessage[detectedMood]);
    };
    recognition.start();
  }
  
  const handleRestart = () => {
    setMessage('');
    setSentMessage('');
    setMood('');
    setVoiceTranscript('');
    setListening(false);
    setShowFinalSupport(false);
    setFaceInputMode('video');
    setCapturedImg(null);
    setMode('');
    localStorage.clear();
  };



  // --- User Main App ---
  return (
    <div className="App">
      <h1>EmotionResonate: Mood-Triggered Avatar</h1>
      <button onClick={handleRestart} style={{ position: 'absolute', top: 20, right: 20 }}>Restart</button>
      <button className="switch-btn" style={{ position: 'absolute', top: 20, left: 20 }} onClick={() => { setRole(""); setMode(''); setFaceInputMode("video"); setCapturedImg(null); }}>
        Switch Role
      </button>



      {!mode && <LandingPortal onSelect={setMode} />}



      {/* TEXT MODE */}
      {mode === "text" && (
        <div className="mode-content">
          <div className="visual-row">
            <input
              type="text"
              className="text-input"
              placeholder="Type your message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button className="detect-btn" onClick={() => {
              setSentMessage(message);
              const result = sentiment.analyze(message);
              let detectedMood = 'neutral';
              if (result.score > 0) detectedMood = 'happy';
              if (result.score < 0) detectedMood = 'sad';
              setMood(detectedMood);
              setShowFinalSupport(true);
            }}>
              Analyze Text
            </button>
          </div>
          <img className="avatar-img" src={avatarSrc} alt="Avatar" />
          <div className={`feedback-card ${mood}`}>
            <p className="mood-label">Detected Mood: <span>{mood}</span></p>
            <p>Avatar will show mood here</p>
            <p className="card-message">{consolingMessage}</p>
            {showFinalSupport && (
              <div className="final-support-message">
                <button onClick={saveResult}>Save Result</button>
                <button onClick={shareResult}>Share Result</button>
                <p>I'm here for your everything, please share what you are facing, I'll listen to you without any judgement.</p>
              </div>
            )}
            {!modelsLoaded && <p style={{ color: 'red' }}>Models are loading, please wait...</p>}
          </div>
        </div>
      )}



      {/* VIDEO MODE */}
      {mode === "video" && (
        <div className="mode-content">
          <div className="visual-row" style={{ flexWrap: "wrap" }}>
            <button className={`detect-btn ${faceInputMode === "video" ? "active" : ""}`}
              onClick={() => { setFaceInputMode("video"); setCapturedImg(null); }}>
              Live Video
            </button>
            <button className={`detect-btn ${faceInputMode === "photo" ? "active" : ""}`}
              onClick={() => { setFaceInputMode("photo"); setCapturedImg(null); }}>
              Capture Photo
            </button>
          </div>
          <div className="visual-row" style={{ flexWrap: "wrap" }}>
            {faceInputMode === "video" && (
              <>
                <ReactWebcam ref={webcamRef} audio={false} className="webcam-box" />
                <button className="detect-btn" onClick={detectFacialEmotion} disabled={!modelsLoaded || loading}>
                  Detect Face Emotion
                </button>
                <img className="avatar-img" src={avatarSrc} alt="Avatar" />
              </>
            )}
            {faceInputMode === "photo" && (
              <>
                {!capturedImg ? (
                  <>
                    <ReactWebcam ref={webcamRef} audio={false} className="webcam-box" screenshotFormat="image/jpeg" />
                    <button className="detect-btn"
                      onClick={() => {
                        const imageSrc = webcamRef.current.getScreenshot();
                        setCapturedImg(imageSrc);
                      }}>
                      Capture Photo
                    </button>
                  </>
                ) : (
                  <>
                    <img src={capturedImg} className="webcam-box" alt="Captured" />
                    <button className="detect-btn"
                      onClick={async () => {
                        await analyzeFacialEmotionPhoto(capturedImg);
                      }}>
                      Analyze Photo
                    </button>
                  </>
                )}
                <img className="avatar-img" src={avatarSrc} alt="Avatar" />
              </>
            )}
          </div>



          {loading && !showFinalSupport && (
            <div className="loading-message">
              Face analysis in progress, please wait...
            </div>
          )}



          {showFinalSupport && (
            <div className={`feedback-card ${mood}`}>
              <p className="mood-label">Detected Mood: <span>{mood}</span></p>
              <p>Avatar will show mood here</p>
              <p className="card-message">{consolingMessage}</p>
              <div className="final-support-message">
                <button onClick={saveResult}>Save Result</button>
                <button onClick={shareResult}>Share Result</button>
                <p>I'm here for your everything, please share what you are facing, I'll listen to you without any judgement.</p>
              </div>
              {!modelsLoaded && <p style={{ color: 'red' }}>Models are loading, please wait...</p>}
            </div>
          )}
        </div>
      )}



      {/* VOICE MODE */}
      {mode === "voice" && (
        <div className="mode-content">
          <div className="visual-row">
            <button className="detect-btn" onClick={startVoiceListening} disabled={listening} style={{ marginBottom: 10 }}>
              {listening ? "Listening..." : "Speak Now"}
            </button>
          </div>
          <img className="avatar-img" src={avatarSrc} alt="Avatar" />
          <div className={`feedback-card ${mood}`}>
            <p className="mood-label">Detected Mood: <span>{mood}</span></p>
            <p>Avatar will show mood here</p>
            {voiceTranscript && <p>You said: {voiceTranscript}</p>}
            <p className="card-message">{consolingMessage}</p>
            {showFinalSupport && (
              <div className="final-support-message">
                <button onClick={saveResult}>Save Result</button>
                <button onClick={shareResult}>Share Result</button>
                <p>I'm here for your everything, please share what you are facing, I'll listen to you without any judgement.</p>
              </div>
            )}
            {!modelsLoaded && <p style={{ color: 'red' }}>Models are loading, please wait...</p>}
          </div>
        </div>
      )}
      
      {/* COPYRIGHT FOOTER on all user pages */}
      <span style={{ display: "none" }}>{sentMessage}</span>
      <div className="footer-signature">
        &copy; {new Date().getFullYear()} &mdash; Created by HARSHITHA M V
      </div>
    </div>
  );
}

export default App;
