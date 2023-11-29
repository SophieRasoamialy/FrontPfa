'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id_etudiant: number;
}

const InfoModal: React.FC<ModalProps> = ({ isOpen, onClose, id_etudiant }) => {
  const [absentTimetable, setAbsentTimetable] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchStudentTimetable();
    }
  }, [isOpen]);

  const fetchStudentTimetable = async () => {
    if(id_etudiant !== 0)
    {
      try {
        const response = await axios.get(`http://localhost:3001/api/etudiants/etudiants/${id_etudiant}`);
        if (response.status === 200) {
          const data = response.data;
          setAbsentTimetable(data);
        } else {
          console.error('Erreur lors de la récupération des détails d\'absence de l\'étudiant');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails d\'absence de l\'étudiant:', error);
      }
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8">
        <h1 className = "font-bold mb-5">Details des cours non assiste</h1>
        <dl className="max-w-md text-gray-900 divide-y divide-gray-200">
        {absentTimetable.map((timetable) => (
          <div className="flex flex-col pb-3" key={timetable.id_edt}>
              <dt className="mb-1 text-gray-500 "> Date : Le {timetable.date} a {timetable.heure}</dt>
              <dd className="font-semibold">Matiere: {timetable.matiere}</dd>
          </div>
         ))}
      </dl>
      <button onClick={onClose} className="mt-4 mx-auto bg-red-500 text-white px-4 py-2 rounded-lg">
        Close
      </button>
        </div>
      </div>
    )
  );
};

export default InfoModal;
