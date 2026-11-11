import React from 'react';
import RevenueGraph from '../../../components/graph';
import './revenueOverview.css';

const RevenueOverview = () => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <div className="revenue-layout">
                <main className="revenue-main">
                    <div className="revenue-header">
                        <h2>Revenue Overview</h2>
                    </div>

                    <div className="revenue-grid">
                        <div className="revenue-card">
                            <p className="revenue-label">Total Revenue</p>
                            <h2 className="revenue-value">250.000.000đ</h2>
                        </div>

                        <div className="revenue-card">
                            <p className="revenue-label">Active Orders</p>
                            <h2 className="revenue-value">1,250</h2>
                        </div>

                        <div className="revenue-card">
                            <p className="revenue-label">Customers</p>
                            <h2 className="revenue-value">45.2K</h2>
                        </div>
                    </div>

                    <p className="revenue-label">Monthly Revenue</p>
                    <div className="revenue-chart-area">
                        <RevenueGraph />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RevenueOverview;