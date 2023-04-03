import React, {useRef, useEffect, useState} from "react";

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
        setAudioDevice(audioRef.current);
        audioDevice.srcObject = stream;
        audioDevice.play();
      })
      .catch(err => {
        console.error(err);
      }
    );
  }

  useEffect(() => {
    getAudio();
  })

  return (
  <div onLoad={setVideo} className='App'>
    <nav>
      <a href="/">Home</a>
    </nav>
    <div className='camera-tab'>
      <div className="video">
        <video ref={videoRef}></video>
        {videoViewDrop && 
        <select name="Video Devices" onChange={setVideo} onLoad={setVideo}>
          {videoDevices.map((v) => (<option value={v.deviceId}>{v.label}</option>))}
        </select>
        }
      </div>
    </div>
    <div>
      {audioViewDrop &&
      <select name="Audio Devices" onChange={setAudio} onLoad={setAudio}>
        {audioDevices.map((a) => (<option value={a.deviceId}>{a.label}</option>))}
      </select>
      }
      <audio ref={audioRef}></audio>
    </div>
  </div>
  )
}

export default Live;