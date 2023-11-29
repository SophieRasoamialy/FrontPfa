'use client'
import React, {useState} from 'react';
import { useRouter } from 'next/navigation'
import Lottie from 'react-lottie';
import animationData from "../../../public/lotties/facial.json";
import Swal from 'sweetalert2';
import axios from 'axios';



export default function LoginPage() {
  const router = useRouter();
    const [etudiantId, setEtudiantId] = useState(0);
    
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };
    
      const handleEtudiantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const etudiantId = value === '' ? 0 : parseInt(value, 10);
        setEtudiantId(etudiantId);
      };
      

    const handleVerification = async () => {
      console.log("Tentative de vérification avec l'identifiant d'étudiant :", etudiantId);

      try {
        const response = await axios.get(`http://localhost:3001/api/etudiants/check/${etudiantId}`);
        const data = response.data;

        if (response.status === 200 && data.exists) {
          console.log("La vérification a réussi. Redirection en cours...");
          router.push(`/etudiant/${etudiantId}`);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Numéro matricule introuvable',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'existence de l\'étudiant:', error);
      }
    };  
    
  return (
    <div className='flex w-full'>
      <div className="w-1/6"></div>
      <div className='w-2/6 flex h-sceen justify-center items-center'>
        <div className=''>
         <Lottie options={defaultOptions} />
        </div>
      </div>

      <div className="flex w-2/6 justify-end items-center h-screen">
        <div className="w-full mr-20 max-w-sm bg-white bg-opacity-70 border border-gray-200 rounded-2xl shadow">
          <a href="#">
            <span className="p-8 rounded-t-lg block w-full h-20 md:h-32 lg:h-40 xl:h-48" style={{ backgroundImage: 'url(https://example.com/image.jpg)' }}></span>
          </a>

          <div className="px-5 pb-5">
            <div>
              <label htmlFor="helper-text" className="block mb-2 text-sm font-medium text-gray-900">Entrer votre numéro matricule</label>
              <input value={etudiantId} onChange={handleEtudiantChange} type="number" id="helper-text" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4" />
            </div>

            <div className="text-center">
              <button type="button" onClick={handleVerification} className="text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5">
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/6"></div>
    </div>
  );
}
