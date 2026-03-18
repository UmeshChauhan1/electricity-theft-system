import React from 'react';
import StatsCard from '../components/StatsCard';
import AlertsTable from '../components/AlertsTable';
import RegionCards from '../components/RegionCards';
import Charts from '../components/Charts';

const DashboardPage = () => {
    const sampleStats = { totalAlerts: 10, resolvedAlerts: 7, pendingAlerts: 3 };
    const sampleAlerts = [
        { id: 1, region: 'Region 1', status: 'Pending' },
        { id: 2, region: 'Region 2', status: 'Resolved' },
        { id: 3, region: 'Region 3', status: 'Pending' }
    ];

    return (
        <div>
            <h1>Electricity Theft Dashboard</h1>
            <StatsCard stats={sampleStats} />
            <AlertsTable alerts={sampleAlerts} />
            <RegionCards />
            <Charts />
        </div>
    );
};

export default DashboardPage;