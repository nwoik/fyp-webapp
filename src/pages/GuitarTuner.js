import React, { useEffect, useRef, useState } from 'react';
import { noteFrequencies} from "./notes";


const GuitarTuner = () => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);

  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState('');

  const noteFreqs = noteFrequencies;

  const getAudio = () => {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
      .then(stream => {
        let audio = audioRef.current;
        audio.srcObject = stream;

        const audioCtx = new AudioContext();
        const sourceNode = audioCtx.createMediaStreamSource(stream);
        const analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 2048; // Set the FFT size to 2048
        sourceNode.connect(analyserNode);
        console.log(analyserNode);

        analyserNode.connect(audioCtx.destination);
        analyserRef.current = analyserNode; // Save a reference to the analyserNode for later use
        console.log(analyserNode);
        // audio.play();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getNoteFromFrequency = (freq) => {
    const closestNote = noteFrequencies.reduce((prev, curr) => {
      return (Math.abs(curr.frequency - freq) < Math.abs(prev.frequency - freq) ? curr : prev);
    });
    // console.log(closestNote.note);
    return closestNote.note;
  };

  const drawFrequencyData = () => {
    const canvas = canvasRef.current;
    const analyserNode = analyserRef.current;
    if (canvas && analyserNode) {
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);
      const maxFrequency = dataArray.indexOf(Math.max(...dataArray));
      const freq = maxFrequency * (audioRef.current.duration / bufferLength);
      const note = getNoteFromFrequency(maxFrequency);
      setNote(note);
      setFrequency(maxFrequency);
    }
    requestAnimationFrame(drawFrequencyData);
  };

  useEffect(() => {
    getAudio();
    drawFrequencyData();
  }, [audioRef, canvasRef, analyserRef]);

  return (
    <div>
      <audio ref={audioRef} hidden="true" muted="true" />
      <canvas ref={canvasRef} width="640" height="480" hidden="true" />
      <p color='white'>Note: {note}</p>
      <p color='white'>Frequency: {frequency} Hz</p>
    </div>
  );
};

export default GuitarTuner;
