import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import NFCScanner from './components/NFCScanner';
import AssetList from './components/AssetList';
import UserList from './components/UserList';
import UserAssets from './components/UserAssets';
import History from './components/History';
import Issues from './components/Issues';
import Settings from './components/Settings';
import DatabaseStatus from './components/DatabaseStatus';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'scanner':
        return <QRScanner />;
      case 'nfc':
        return <NFCScanner />;
      case 'assets':
        return <AssetList />;
      case 'users':
        return <UserList />;
      case 'user-assets':
        return <UserAssets />;
      case 'history':
        return <History />;
      case 'issues':
        return <Issues />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <DatabaseStatus />
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderCurrentView()}
      </Layout>
    </>
  );
}

export default App;