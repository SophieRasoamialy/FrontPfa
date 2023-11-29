'use client';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
// Importez vos pages personnalisées
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
    <div>
        <div id="toast-default" className="fixed top-4 right-4 flex items-center max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"></path>
            </svg>
            <span className="sr-only">Fire icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">Set yourself free.</div>
        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-default" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
            </svg>
        </button>
    </div>

      <Tabs>
        <TabList>
            <Tab>Dashboard</Tab>
            <Tab>Emploie du temps</Tab>
        </TabList>

        <TabPanel>
          <DashboardPage id={id} />
        </TabPanel>
        <TabPanel>
          <EdtPage id={id}/>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default EtudiantPage;
