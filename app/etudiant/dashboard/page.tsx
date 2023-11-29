'use client';import 'chart.js/auto';
import { Chart, registerables, ChartType } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface DashboardPageProps {
  id: string | undefined; // Ou le type approprié de votre ID
}

const DashboardPage: React.FC<DashboardPageProps> = ({ id }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null); // Référence pour stocker l'instance du graphique
  const [niveau, setNiveau] = useState('');
  const [assiduite, setAssiduite] = useState(0);
  const [absence, setAbsence] = useState(0);


  useEffect(() => {
    fetchNiveaux();
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Détruire le graphique existant s'il y en a un
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Données du graphique
        const data = {
          labels: ['Assiduité', 'Absence'],
          datasets: [
            {
              data: [80, 20], // Remplacez ces valeurs par les données réelles
              backgroundColor: ['#0d9488', '#84cc16'], // Couleurs des tranches
            },
          ],
        };

        // Configuration du graphique
        const config = {
          type: 'doughnut' as ChartType,
          data: data,
        };

        // Enregistrez le type 'doughnut' dans Chart.js
        Chart.register(...registerables);

        // Créez un nouveau graphique et stockez l'instance
        chartInstanceRef.current = new Chart(ctx, config);
      }
    }
  }, []);

  const fetchNiveaux = async () => {
    let id_niveau;
    try {
      const response = await axios.get(`http://localhost:3001/api/etudiants/${id}`);
       id_niveau = response.data.id_niveau;
       try {
        const response = await axios.get(`http://localhost:3001/api/niveaux/${id_niveau}`);
        setNiveau(response.data.niveau)
       }
       catch (error) {
        console.error('Erreur lors de la récupération de niveau', error);
       }
    } catch (error) {
      console.error('Erreur lors de la récupération de id niveau', error);
    }
  };

  return (
    <div className='w-full ' >
        <div className='flex  gap-3 justify-center items-center my-5'>
            <div  className="text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5">
               Niveau Courant {niveau}
            </div>
        </div>
        <div>
        <div className='bg-white bg-opacity-70 w-2/3 mx-auto rounded-2xl shadow'>
            <h3 className = " text-center pt-5 font-bold text-base">Votre taux d'Assiduité en {niveau}</h3>
            <div className='w-1/3 mx-auto p-8'>
                <canvas ref={chartRef}  />
            </div>
            </div>
        </div>
        <div className='bg-white mt-10 p-5 bg-opacity-70 w-2/3 mx-auto rounded-2xl shadow'>
            <p className="font-normal text-gray-700 "> Nombre d'absence :  <span className=" text-teal-700 ">5</span></p>
            <ul  className="list-disc px-5">
                <li><p className="font-normal text-gray-700 "> le 05 mars 2021, cours ADD, prof Ralaivao </p></li>
                <li><p className="font-normal text-gray-700 "> le 25 juin 2021, cours IA, prof Josue </p></li>
            </ul>
        </div>
    </div>
  );
};

export default DashboardPage;
