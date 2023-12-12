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
