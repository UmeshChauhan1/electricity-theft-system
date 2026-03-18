import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
    return (
        <div className="stats-card">
            {icon && <div className="icon">{icon}</div>}
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

export default StatsCard;