'use client';
import React, { useState, useCallback, useRef } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import img1 from "../../../public/images/visa.png";

const Compare: NextPage = () => {
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
const capture = useCallback(async () => {
  if (webcamRef.current) {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setError('Impossible de capturer une image. Veuillez vérifier la webcam.');
      return;
    }

    // Charger l'image existante à comparer
    const image1 = await faceapi.fetchImage('images/visaaa.jpg');

    // Convertir l'image capturée en blob
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const image2 = await faceapi.bufferToImage(blob);

    // Charger le modèle de reconnaissance faciale
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

   
    
    // Détecter les visages dans les images
    const face2 = await faceapi.detectSingleFace(image2).withFaceLandmarks().withFaceDescriptor();
    const face1 = await faceapi.detectSingleFace(image1).withFaceLandmarks().withFaceDescriptor();
    console.log("face2 =>> "+face2);
console.log("face1 =>> "+face1);

    // Comparer les descripteurs de visage
    const distance = faceapi.euclideanDistance(face1!.descriptor, face2!.descriptor);

    if (distance < 0.6) {
      console.log("mitovy");
      // Les visages correspondent, rediriger vers une autre page
      setError(null);
      // Ajoutez ici votre logique de redirection
    } else {
      console.log("tsy mitovy");
      // Les visages ne correspondent pas, afficher un message d'erreur
      setError('Les visages ne correspondent pas.');
    }
  }
}, []);


  return (
    <div>
     <Webcam audio={false} ref={webcamRef} />
      <button onClick={capture}>Comparer les visages</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Compare;
