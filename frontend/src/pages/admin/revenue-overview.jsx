import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RevenueGraph from '../../components/graph';

const RevenueOverview = () => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <div style={styles.layout}>
                <main style={styles.mainContent}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Revenue Overview</h1>
                    </div>

                    <div style={styles.grid}>
                        <div style={styles.card}>
                            <p style={styles.cardLabel}>Total Revenue</p>
                            <h2 style={styles.cardValue}>250.000.000đ</h2>
                        </div>
                        <div style={styles.card}>
                            <p style={styles.cardLabel}>Active Orders</p>
                            <h2 style={styles.cardValue}>1,250</h2>
                        </div>
                        <div style={styles.card}>
                            <p style={styles.cardLabel}>Customers</p>
                            <h2 style={styles.cardValue}>45.2K</h2>
                        </div>
                    </div>

                    <p style={styles.cardLabel}>Monthly Revenue</p>
                    <div style={styles.chartArea}>
                        <RevenueGraph />
                    </div>


                </main>
            </div>

            <Footer />
        </div>
    );
};

const styles = {
    layout: {
        display: 'flex',
        backgroundColor: '#fff'
    },
    mainContent: {
        flex: 1,
        padding: '48px',
        backgroundColor: '#fafafa',
        minHeight: 'calc(100vh - 64px)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        letterSpacing: '-1px'
    },
    exportBtn: {
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '30px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '40px'
    },
    card: {
        backgroundColor: '#fff',
        padding: '32px',
        paddingTop: '20px',
        border: '1px solid #000000', borderRadius: '8px'
    },
    cardLabel: {
        color: '#757575',
        fontSize: '13px',
        textTransform: 'uppercase',
        marginBottom: '8px'
    },
    cardValue: {
        fontSize: '32px',
        fontWeight: '700',
        margin: '0'
    },
    chartArea: {
        height: '400px',
        backgroundColor: '#fff',
        border: '1px solid #000000',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#aaa',
        fontSize: '14px'
    }
};

export default RevenueOverview;