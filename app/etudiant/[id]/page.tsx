'use client';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import EdtPage from '../edt/page';
import DashboardPage from '../dashboard/page';

// Interface pour les paramètres
interface EtudiantPageProps {
  params: {
    id: string;
  };
}

// Composant fonctionnel avec les paramètres déstructurés
const EtudiantPage: React.FC<EtudiantPageProps> = ({ params }) => {
  const { id } = params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white p-5">
      <div className="container mx-auto">
        <h2 className="text-center text-3xl font-bold text-teal-600 mb-5">Espace Étudiant</h2>
        <Tabs>
          <TabList className="flex justify-center mb-5">
            <Tab className="px-4 py-2 text-teal-600 font-semibold border-b-2 border-teal-600 hover:bg-teal-100 rounded-t-lg">
              Dashboard
            </Tab>
            <Tab className="px-4 py-2 text-teal-600 font-semibold border-b-2 border-teal-600 hover:bg-teal-100 rounded-t-lg">
              Emploi du temps
            </Tab>
          </TabList>

          <TabPanel>
            <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-5">
              <DashboardPage id={id} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-5">
              <EdtPage id={id} />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default EtudiantPage;
