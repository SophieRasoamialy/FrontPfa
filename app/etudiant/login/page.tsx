'use client'
import React, {useState, useRef, useEffect} from 'react';
import { useRouter } from 'next/navigation'
import Lottie from 'react-lottie';
import animationData from "../../../public/lotties/facial.json";
import Swal from 'sweetalert2';
import axios from 'axios';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Canvas } from 'canvas';


export default function LoginPage() {
  const router = useRouter();
    const [etudiantId, setEtudiantId] = useState(0);
    const webcamRef = useRef<Webcam>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };

      useEffect(() => {
        const fetchDataAndDraw = async () => {
          console.log("Before webcam initialization");
          
           // console.log("Webcam is active. Waiting before capturing screenshot.");
            setTimeout(async () => {
              const imageSrc = webcamRef.current.getScreenshot();
              if (imageSrc) {
                console.log("Screenshot captured successfully");
                
                await drawFaceDetection();
              } else {
                console.log("Image source is null.");
              }
            }, 5000);
          
        };
      
        fetchDataAndDraw();
      }, []);
      
      
      
      
    
      const handleEtudiantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const etudiantId = value === '' ? 0 : parseInt(value, 10);
        setEtudiantId(etudiantId);
      };
      

    const handleVerification = async () => {
      console.log("Tentative de vérification avec l'identifiant d'étudiant :", etudiantId);

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/etudiants/check/${etudiantId}`);
        const data = response.data;

        if (response.status === 200 && data.exists) {
          const faceMatch = await compareFaces();
      
          if (faceMatch) {
            console.log("La vérification a réussi. Redirection en cours...");
            router.push(`/etudiant/${etudiantId}`);
          }

          else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'La vérification faciale a échoué. Veuillez réessayer.',
            });
            setLoading(false);
            setCapturedImage(null);
          }
          
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Numéro matricule introuvable',
          });
          setLoading(false);
          setCapturedImage(null);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'existence de l\'étudiant:', error);
        setLoading(false);
        setCapturedImage(null);
      }
    };  

    const drawFaceDetection = async () => {
      try {
        if (webcamRef.current) {
          // Capture the screenshot with the specified quality
          const imageSrc = webcamRef.current.getScreenshot({
            quality: 0.9,
          });
    
          // Load face detection and landmarks models
          await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    
          // Fetch the image
          const response = await fetch(imageSrc);
    
          if (!response.ok) {
            throw new Error("Échec de la récupération de l'image");
          }
    
          // Convert the image to blob
          const blob = await response.blob();
    
          // Create an Image element and wait for it to load
          const loadImage = () => {
            return new Promise((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve(image);
              image.onerror = reject;
              image.src = URL.createObjectURL(blob);
            });
          };
    
          const image = await loadImage();
    
          // Detect faces and landmarks in the image
          const detectionsWithLandmarks = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
         
          // Retrieve the canvas context
          const canvas = document.getElementById('faceCanvas') as HTMLCanvasElement;
          const context = canvas.getContext('2d');
    
          if (context) {
            // Clear the previous content
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            // Draw a rectangle, key points, and an oval around each detected face
            detectionsWithLandmarks.forEach((result) => {
              const { detection, landmarks } = result;
              const { x, y, width, height } = detection.box;
    
              // Draw rectangle around the face
              context.strokeStyle = 'red';
              context.lineWidth = 2;
              context.strokeRect(x, y, width, height);
    
              // Draw key points on the face
              landmarks.positions.forEach((point) => {
                context.fillStyle = 'blue';
                context.fillRect(point.x - 2, point.y - 2, 4, 4);
              });
    
              // Draw oval around the face
              const leftEye = landmarks.getLeftEye()[0];
              const rightEye = landmarks.getRightEye()[3];
              const middleX = (leftEye.x + rightEye.x) / 2;
              const middleY = (leftEye.y + rightEye.y) / 2;
    
              context.beginPath();
              context.ellipse(middleX, middleY, width / 2, height / 2, 0, 0, 2 * Math.PI);
              context.strokeStyle = 'green';
              context.lineWidth = 2;
              context.stroke();
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors de la détection du visage:', error);
      }
    };

    const compareFaces = async (): Promise<boolean> => {
      try {
        if (webcamRef.current) {
          console.log("haha1");
          const imageSrc = webcamRef.current.getScreenshot();
          setCapturedImage(imageSrc);

          let photoPath = "";
          try {
            const response = await fetch(`http://localhost:3001/api/etudiants/${etudiantId}/photo`);
            const data = await response.json();
            if (response.ok) {
              photoPath = data.photoPath;
            } else {
              console.error('Erreur lors de la récupération du chemin de la photo de l\'étudiant', data.message);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du chemin de la photo de l\'étudiant', error);
          }

          // Charger l'image existante à comparer
          const image1 = await faceapi.fetchImage(photoPath).catch(error => console.error("Error loading image:", error));
  
          // Convertir l'image capturée en blob
          console.log("haha2");
          const blob = await fetch(imageSrc).then((res) => res.blob());
         // const blob1 = await fetch(photoPath).then((res) => res.blob());
        //  const webpBlob = await convertJPEGtoWebP(blob1);
          //console.log('webpBlob', webpBlob); 
          //console.log("blob  ",blob);
          //console.log("blob 1 ",blob1);
          const image2 = await faceapi.bufferToImage(blob);
         // const image3 = await faceapi.bufferToImage(webpBlob);
         // console.log("image2 ",image2);
          //console.log("image3 ",image3);
          // Charger le modèle de reconnaissance faciale
          await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
          await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
          await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

          console.log("haha5");

         // const detectionsWithLandmarks1 = await faceapi.detectAllFaces(image1, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks();

          const detectionsWithLandmarks1 = await faceapi.detectAllFaces(image1, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
          const detectionsWithLandmarks2 = await faceapi.detectAllFaces(image2, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
          console.log("detectionsWithLandmarks1 =>>",detectionsWithLandmarks1);
          console.log("detectionsWithLandmarks2 =>>", detectionsWithLandmarks2);
          
           if (detectionsWithLandmarks1.length > 0 && detectionsWithLandmarks2.length > 0) {
            // Comparer les descripteurs de visage
            const distance = faceapi.euclideanDistance(detectionsWithLandmarks1[0].descriptor, detectionsWithLandmarks2[0].descriptor);
    
            if (distance < 0.6) {
              console.log("mitovy");
              // Les visages correspondent, rediriger vers une autre page
              setError(null);
              return true;
            } else {
              console.log("tsy mitovy");
              // Les visages ne correspondent pas, afficher un message d'erreur
              setError('Les visages ne correspondent pas.');
              return false;
            }
          } else {
            console.log("Aucun visage détecté dans l'une des images.");
            setError('Aucun visage détecté dans l\'une des images.');
            return false;
          }
        }
      } catch (error) {
        console.error('Erreur lors de la comparaison des visages:', error);
      }
    
      return false;
    };

    async function convertJPEGtoWebP(jpegBlob:any) {
      const jpegDataURL = await blobToDataURL(jpegBlob);
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
    
          // Convertir l'image en WebP
          canvas.toBlob((webpBlob) => {
            resolve(webpBlob);
          }, 'image/webp', 1);
        };
    
        img.src = jpegDataURL;
      });
    }
    
    async function blobToDataURL(blob:any) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    
    
    
  return (
    <div className='flex w-full'>
      <div className="w-1/6"></div>
      <div className='w-2/6 flex h-sceen justify-center items-center'>
        <div className=''>
         <Lottie options={defaultOptions} />
        </div>
      </div>

      <div className="flex w-3/6 justify-end items-center h-screen">
        <div className="w-full mr-20 max-w-sm bg-white bg-opacity-70 border border-gray-200 rounded-2xl shadow  ">
          <div >
            <span className="p-8 rounded-t-lg  w-full  " >
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Webcam audio={false} ref={webcamRef} className="w-full h-full object-cover rounded-t-lg" />
                
                {/* Ajouter la balise canvas pour le cadre de détection au-dessus de la webcam */}
                <canvas id="faceCanvas" style={{ position: 'absolute', top: -105, left: -45, width: '100%', height: '100%' }} />
              </div>
            </>

              )}
            </span>
          </div>

          <div className="px-5 pb-5">
            <div>
              <label htmlFor="helper-text" className=" mb-2 text-sm font-medium text-gray-900">Entrer votre numéro matricule</label>
              <input value={etudiantId} onChange={handleEtudiantChange} type="number" id="helper-text" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4" />
            </div>

            <div className="text-center">
              {loading ? (
                <button disabled type="button" className="py-2.5 px-5 me-2  inline-flex font-medium opacity-50 items-center justify-center cursor-not-allowed  text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-sm mx-auto">
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                  </svg>
                  Verification en cours...
                </button>
              ) : (
                <button type="button" onClick={handleVerification} className="text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5">
                  Se connecter
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
      <div className="w-1/6"></div>
    </div>
  );
}
