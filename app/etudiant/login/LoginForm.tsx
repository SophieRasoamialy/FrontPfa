'use client';
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import animationData from "../../../public/lotties/facial.json";
import Swal from "sweetalert2";
import axios from "axios";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Link from "next/link";
import Image from "next/image";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const [etudiantId, setEtudiantId] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);


  const handleEtudiantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const etudiantId = value === "" ? 0 : parseInt(value, 10);
    setEtudiantId(etudiantId);
  };

  const handleVerification = async () => {
    console.log(
      "Tentative de vérification avec l'identifiant d'étudiant :",
      etudiantId
    );

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/etudiants/check/${etudiantId}`
      );
      const data = response.data;

      if (response.status === 200 && data.exists) {

        let faceMatch ;
        if (typeof window !== "undefined"){ faceMatch = await compareFaces();}

        if (faceMatch) {
          console.log("La vérification a réussi. Redirection en cours...");
          router.push(`/etudiant/${etudiantId}`);
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "La vérification faciale a échoué. Veuillez réessayer.",
          });
          setLoading(false);
          setCapturedImage(null);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Numéro matricule introuvable",
        });
        setLoading(false);
        setCapturedImage(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'existence de l'étudiant:",
        error
      );
      setLoading(false);
      setCapturedImage(null);
    }
    // router.push(`/etudiant/${etudiantId}`);
  };

  const compareFaces = async (): Promise<boolean> => {
    try {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);

        let photoPath = "";
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACK_URL}/api/etudiants/${etudiantId}/photo`
          );
          const data = await response.json();
          if (response.ok) {
            photoPath = data.photoPath;
          } else {
            console.error(
              "Erreur lors de la récupération du chemin de la photo de l'étudiant",
              data.message
            );
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du chemin de la photo de l'étudiant",
            error
          );
        }

        const image1 = await faceapi.fetchImage(photoPath);
        if (!imageSrc) {
          throw new Error("Impossible de capturer l'image");
        }
        const blob = await fetch(imageSrc as string).then((res) => res.blob());
        const image2 = await faceapi.bufferToImage(blob);

        if (typeof window !== "undefined"){ await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        ]);}

       
          const [face1, face2] = await Promise.all([
            faceapi.detectSingleFace(image1).withFaceLandmarks().withFaceDescriptor(),
            faceapi.detectSingleFace(image2).withFaceLandmarks().withFaceDescriptor()
          ]);

        const distance = faceapi.euclideanDistance(
          face1!.descriptor,
          face2!.descriptor
        );

        if (distance < 0.6) {
          console.log("mitovy");
          setError(null);
          return true;
        } else {
          console.log("tsy mitovy");
          setError("Les visages ne correspondent pas.");
          return false;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la comparaison des visages:", error);
      return false;
    }

    return false;
  };

  const WebcamComponent = () => {
    if (typeof window === "undefined") return null; // Rendu côté serveur : ne rien afficher
    return <Webcam audio={false} ref={webcamRef} className="w-full h-full object-cover rounded-t-2xl" screenshotFormat="image/jpeg" />;
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-white">
      {/* Dashboard Button */}
      <div className="absolute top-4 right-4">
        <Link
          href="/etudiant/dashboard"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-300 to-lime-300 text-black rounded-lg shadow hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 transition-all duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row w-full p-4 md:p-8">
        <div className="w-full md:w-1/6"></div>
        <div className="w-full md:w-2/6 flex h-auto md:h-screen justify-center items-center">
          <div className="w-full max-w-md">
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="flex w-full md:w-3/6 justify-end items-center h-auto md:h-screen">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-80">
            <div className="relative">
              <div className="rounded-t-2xl overflow-hidden">
                {capturedImage ? (
                  <Image
                    src={capturedImage}
                    alt="Captured"
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="relative w-full h-[300px] md:h-[400px]">
                   <WebcamComponent />
                    <canvas
                      id="faceCanvas"
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-4 md:mb-6">
                <label
                  htmlFor="student-id"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Enter your student ID
                </label>
                <input
                  value={etudiantId || ""}
                  onChange={handleEtudiantChange}
                  type="number"
                  id="student-id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition-all duration-300"
                  placeholder="Student ID"
                />
              </div>

              <div className="text-center">
                {loading ? (
                  <button
                    disabled
                    className="w-full py-3 px-5 flex items-center justify-center text-black bg-gradient-to-r from-teal-300 to-lime-300 opacity-50 rounded-lg cursor-not-allowed"
                  >
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-black"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </button>
                ) : (
                  <button
                    onClick={handleVerification}
                    className="w-full py-3 px-5 text-black bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/6"></div>
      </div>
    </div>
  );
}