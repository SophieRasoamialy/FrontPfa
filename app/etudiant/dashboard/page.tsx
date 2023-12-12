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
  const [cours, setCours] = useState(0);
  const [unattendedCourses, setUnattendedCourses] = useState([]);


  useEffect(() => {
    fetchNiveaux();
    calculData();
    fetchUnattendedCourses();
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

  const fetchAssuidite = async() => {
    let nbAssuidite;
    try {
      const response = await axios.get(`http://localhost:3001/api/etudiants/etudiant/${id}/presence-count`);
       nbAssuidite = response.data;
      return nbAssuidite;
    } catch (error) {
      console.error('Erreur lors de la récupération de nombre de presence', error);
    }
  }

  const fetchAbsence  = async() => {
    let nbAbsence;
    try {
          const response = await axios.get(`http://localhost:3001/api/etudiants/etudiant/${id}/absence-count`);
          nbAbsence = response.data;
          return nbAbsence;
        } catch (error) {
          console.error('Erreur lors de la récupération de nombre d\'absence ', error);
        }
  }

  const fetchNbCours = async() => {
    let nbCours;
    try {
          const response = await axios.get(`http://localhost:3001/api/etudiants/etudiant/${id}/past-courses-count`);
          nbCours = response.data;
          return nbCours;
        } catch (error) {
          console.error('Erreur lors de la récupération de nombre de cours', error);
        }
  }

  const calculData = async () => {
    const p = await fetchAssuidite();
    const a = await fetchAbsence();
    const c = await fetchNbCours();
    setCours(c);
    const tauxPresence = (p/c) * 100;
    setAssiduite(tauxPresence);
    const tauxAbsence = (a/c) * 100;
    setAbsence(tauxAbsence);

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
              data: [tauxPresence, tauxAbsence], // Remplacez ces valeurs par les données réelles
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
  }

  const fetchUnattendedCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/etudiants/etudiant/${id}/unattended-courses`);
      setUnattendedCourses(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des cours non suivis', error);
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
            <h3 className = " text-center pt-5 font-bold text-base">Votre taux d'Assiduité (en %) en {niveau}</h3>
            <div className='w-1/3 mx-auto p-8'>
                <canvas ref={chartRef}  />
            </div>
            </div>
        </div>
        <div className='bg-white mt-10 p-5 bg-opacity-70 w-2/3 mx-auto rounded-2xl shadow'>
            <p className="font-normal text-gray-700 "> Nombre d'absence :  <span className=" text-teal-700 font-bold ">{cours}</span></p>
            <ul className="list-disc px-5">
          {unattendedCourses.map(course => (
            <li key={course.id_edt}>
              <p className="font-normal text-gray-700">
                {`le ${new Date(course.date).toLocaleDateString()}, Cours ${course.matiere}, Prof ${course.nom_enseignant} ${course.prenom_enseignant}`}
              </p>
            </li>
          ))}
        </ul>
        </div>
    </div>
  );
};

export default DashboardPage;
