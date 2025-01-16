'use client';
import 'chart.js/auto';
import { Chart, registerables, ChartType } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface UnattendedCourse {
  id_edt: number;
  date: string;
  matiere: string;
  nom_enseignant: string;
  prenom_enseignant: string;
}

const DashboardPage: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [niveau, setNiveau] = useState('L1');
  const [assiduite, setAssiduite] = useState(0);
  const [absence, setAbsence] = useState(0);
  const [cours, setCours] = useState(0);
  const [unattendedCourses, setUnattendedCourses] = useState<UnattendedCourse[]>([]);

  // Valeurs par défaut pour les graphiques
  const defaultAssiduite = 75; // Valeur par défaut d'assiduité
  const defaultAbsence = 25; // Valeur par défaut d'absence

  useEffect(() => {
    fetchNiveaux();
    calculData();
    fetchUnattendedCourses();
  }, []);

  const fetchNiveaux = async () => {
    let id_niveau;
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/etudiants/${id}`);
      id_niveau = response.data.id_niveau;
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/niveaux/${id_niveau}`);
        setNiveau(response.data.niveau);
      } catch (error) {
        console.error('Erreur lors de la récupération de niveau', error);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de id niveau', error);
    }
  };

  const calculData = async () => {
    // Utilisation des valeurs par défaut si les données ne sont pas disponibles
    const p = defaultAssiduite; // Remplacez par fetchAssuidite() si nécessaire
    const a = defaultAbsence; // Remplacez par fetchAbsence() si nécessaire
    const c = 100; // Total des cours, ajustez selon vos besoins

    setCours(c);
    setAssiduite(p);
    setAbsence(a);

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
              data: [p, a], // Utilisation des valeurs par défaut
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
  };

  const fetchUnattendedCourses = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/etudiants/etudiant/${id}/unattended-courses`);
      setUnattendedCourses(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des cours non suivis', error);
    }
  };

  return (
    <div className='w-full bg-gradient-to-br from-teal-100 to-white p-5'>
      <div className='flex gap-3 justify-center items-center my-5'>
        <div className="text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5">
          Niveau Courant: {niveau}
        </div>
      </div>
      <div className='bg-white bg-opacity-70 w-2/3 mx-auto rounded-2xl shadow'>
        <h3 className="text-center pt-5 font-bold text-base">Votre taux d&apos;Assiduité (en %) en {niveau}</h3>
        <div className='w-1/3 mx-auto p-8'>
          <canvas ref={chartRef} />
        </div>
      </div>
      <div className='bg-white mt-10 p-5 bg-opacity-70 w-2/3 mx-auto rounded-2xl shadow'>
        <p className="font-normal text-gray-700">Nombre d&apos;absence: <span className="text-teal-700 font-bold">{absence}</span></p>
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
