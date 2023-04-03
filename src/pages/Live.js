import React, {useRef, useEffect, useState} from "react";

function Live() {
  const [videoDevice, setVideoDevice] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const videoRef = useRef(null);
  const [viewDrop, setViewDrop] = useState(false);
  const [videoDeviceId, setVideoDeviceId] = useState(null);

  function setVideo(e) {
    e.preventDefault();
    setVideoDeviceId(e.target.value);
  }


  function getCameras() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        setVideoDevices(devices.filter((device) => device.kind === 'videoinput'));
        setVideoDevice(videoDevices[0]);
        setVideoDeviceId(videoDevices[0].deviceId)
        setViewDrop(true);
      })
      .catch((error) => {
        console.error('Unable to enumerate video devices:', error);
      })
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
    });
  }

  useEffect(() => {
    getVideo();
  })

  return (
  <div onLoad={getVideo} className='App'>
    <nav>
      <a href="a">Home</a>
    </nav>
    <div className='camera'>
      <video ref={videoRef}></video>
      {viewDrop && 
        <select name="Video Devices" onChange={setVideo} onLoad={setVideo}>
         {videoDevices.map((v) => (<option value={v.deviceId}>{v.label}</option>))}
      </select>}
    </div>
  </div>
  )
}

export default Live;