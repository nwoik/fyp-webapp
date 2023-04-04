import React, {useRef, useEffect, useState} from "react";
import { noteFrequencies } from "./notes";
import GuitarTuner from "./GuitarTuner";

function Live() {
  const [videoDevice, setVideoDevice] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const videoRef = useRef(null);
  const [videoViewDrop, setVideoViewDrop] = useState(false);
  const [videoDeviceId, setVideoDeviceId] = useState(null);

  const [audioDevice, setAudioDevice] = useState(null);
  const [audioDevices, setAudioDevices] = useState([]);
  const audioRef = useRef(null);
  const [audioViewDrop, setAudioViewDrop] = useState(false);
  const [audioDeviceId, setAudioDeviceId] = useState(null);

  const [audioPlayback, setAudioPlayback] = useState(false);
  const playbackButtonRef = useRef(null);

  const canvasRef = useRef(null);

  const analyserRef = useRef(null);
  const audioCtx = new AudioContext();
  const analyserNode = audioCtx.createAnalyser();

  const noteFreqs = noteFrequencies;
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState('');

  

  function setVideo(e) {
    e.preventDefault();
    setVideoDeviceId(e.target.value);
  }

  function getCameras() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        let vDevices = devices.filter((device) => device.kind === 'videoinput');
        setVideoDevices(vDevices);
        if (vDevices.length > 0) {
          setVideoDevice(videoDevices[0]);
          setVideoDeviceId(videoDevices[0].deviceId)
          setVideoViewDrop(true);
        }
      })
      .catch((error) => {
        console.error('Unable to enumerate video devices:', error);
      }
    )
  }

  function getVideo() {
    if (!videoDeviceId) {
      getCameras();
      return
    }
    navigator.mediaDevices.getUserMedia({video: {deviceId:videoDeviceId}})
      .then(stream => {
        setVideoDevice(videoRef.current);
        videoDevice.srcObject = stream;
        videoDevice.play();
      })
      .catch(err => {
        console.error(err);
      }
    );
  }

  useEffect(() => {
    getVideo();
  })

  function setAudio(e) {
    e.preventDefault();
    setAudioDeviceId(e.target.value);
  }

  function setPlayback() {
    setAudioPlayback(!audioPlayback);
  }

  function getAudioInputs() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        let aDevices = devices.filter((device) => device.kind === 'audioinput');
        setAudioDevices(aDevices);
        if (aDevices.length > 0) {
          setAudioDevice(audioDevices[0]);
          setAudioDeviceId(audioDevices[0]);
          setAudioViewDrop(true);
        }
      })
      .catch((error) => {
        console.error('Unable to enumerate audio devices:', error);
      }
    )
  }

  function getAudio() {
    if (!audioDeviceId) {
      getAudioInputs();
      return
    }

    navigator.mediaDevices.getUserMedia({audio: {deviceId:audioDeviceId}, video:false})
      .then(stream => {
        let audio = audioRef.current
        setAudioDevice(audio);
        audioDevice.srcObject = stream;

        const sourceNode = audioCtx.createMediaStreamSource(audioDevice.srcObject);
        
        analyserNode.fftSize = 2048;
        sourceNode.connect(analyserNode);

        if (audioPlayback === true) {
          audioDevice.play();
        }
      })
      .catch(err => {
        console.error(err);
      }
    );
  }

  useEffect(() => {
    getAudio();
  })

  function monitorAudio() {
    if (analyserNode) { 
      const canvas = canvasRef.current;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvasCtx = canvas.getContext('2d');
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      const draw = () => {
        requestAnimationFrame(draw);

        analyserNode.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        const barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
          canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

          x += barWidth + 1;
        }
      }
      draw();
    }
  }

  useEffect(() => {
    monitorAudio();
  })

  return (
  <div onLoad={setVideo} className='App'>
    <nav>
      <a href="/">Home</a>
    </nav>
    <div className='camera-div'>
      <div className="video">
        <video ref={videoRef}></video>
        {videoViewDrop && 
        <select name="Video Devices" onChange={setVideo} onLoad={setVideo}>
          {videoDevices.map((v) => (<option value={v.deviceId}>{v.label}</option>))}
        </select>
        }
      </div>
    </div>
    <div onLoad={getAudio} className="audio-div">
      <canvas ref={canvasRef}></canvas>
      <div className="audio-test">
        <button ref={playbackButtonRef} onClick={setPlayback}>Audio Playback</button>
        {audioPlayback && <label>It's recommended that this is off while playing</label>}
      </div>
      <p>{frequency} {note}</p>
      <GuitarTuner/>
      
      {audioViewDrop &&
      <select name="Audio Devices" onChange={setAudio} onLoad={setAudio}>
        {audioDevices.map((a) => (<option value={a.deviceId}>{a.label}</option>))}
      </select>}
      <audio ref={audioRef}></audio>
    </div>
  </div>
  )
}

export default Live;