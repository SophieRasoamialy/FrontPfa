"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import s3 from "../../../../aws-config";
import { Trykker } from "next/font/google";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Niveau {
  id_niveau: number;
  niveau: string;
}

const AjoutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [selectedNiveau, setSelectedNiveau] = useState("none");
  const [studentPhoto, setStudentPhoto] = useState<File | null>(null);

  // Fonction pour envoyer les données au backend
  const handleEnregistrer = async () => {
    try {
      let fileName = "";
      if (studentPhoto) {
        const s3Params = {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
          Key: `students/${Date.now()}_${studentPhoto.name}`, // Nom unique
          Body: studentPhoto,
          ContentType: studentPhoto.type,
        };

        const uploadResult = await s3.upload(s3Params).promise();
        fileName = uploadResult.Location; // URL publique du fichier
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/etudiants`,
        {
          nom_etudiant: firstName,
          prenom_etudiant: lastName,
          id_niveau: selectedNiveau,
          photo_etudiant: fileName,
        }
      );

      if (response.status === 200) {
        Swal.fire("Succès", "Données enregistrées avec succès", "success");
        onClose();
      } else {
        Swal.fire(
          "Erreur",
          "Erreur lors de l'enregistrement des données",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching niveaux...");
    fetchNiveaux();
  }, []);

  const fetchNiveaux = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/niveaux`
      );
      console.log("Niveaux reçus :", response.data);
      setNiveaux(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des niveaux", error);
    }
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleNiveauChange = async (event: { target: { value: any } }) => {
    setSelectedNiveau(event.target.value);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
        <h3 className="text-2xl font-bold mb-4">Nouveau Etudiant</h3>
        <div>
          <form className=" rounded-lg ">
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-900"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter first name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-900"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={handleLastNameChange}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter last name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="studentPhoto"
                className="block text-sm font-medium text-gray-900"
              >
                Photo de étudiant
              </label>
              <input
                type="file"
                id="studentPhoto"
                name="studentPhoto"
                onChange={(e) =>
                  setStudentPhoto(e.target.files ? e.target.files[0] : null)
                }
                className="block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <select
                id="niveaux"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleNiveauChange}
                value={selectedNiveau}
              >
                <option value="none">Choisir un niveau</option>
                {niveaux.map((niveau, index) => (
                  <option key={niveau.id_niveau} value={niveau.id_niveau}>
                    {niveau.niveau}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className=" inline-block px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300"
          >
            Close
          </button>
          <button
            onClick={handleEnregistrer}
            type="button"
            className=" inline-block px-8 py-4 bg-gradient-to-r from-teal-300 to-lime-300 text-black rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 transition-all duration-300"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};
export default AjoutModal;
