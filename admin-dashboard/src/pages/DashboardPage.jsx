import React from 'react';
import { Link } from 'react-router-dom';

// Basic inline styles for the dashboard
const styles = {
  dashboardContainer: {
    padding: '20px',
  },
  welcomeMessage: {
    marginBottom: '30px',
    fontSize: '1.5em',
  },
  statsContainer: {
    display: 'flex',
    flexWrap: 'wrap', // Allow wrapping on smaller screens
    gap: '20px', // Space between stat cards
    marginBottom: '30px',
  },
  statCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flex: '1', // Distribute space equally
    minWidth: '200px', // Minimum width before wrapping
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#007bff', // Primary color for numbers
    margin: '0 0 10px 0',
  },
  statLabel: {
    fontSize: '1em',
    color: '#555',
  },
  quickLinksContainer: {
    marginTop: '20px',
  },
  quickLink: {
    display: 'inline-block', // Or 'block' for full width links
    margin: '0 10px 10px 0',
    padding: '10px 15px',
    background: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  // Add a hover effect for quickLink if desired
  // quickLinkHover: {
  //   backgroundColor: '#0056b3',
  // }
};

const DashboardPage = () => {
  // Mock data for summary statistics - will be replaced with API calls later
  const summaryStats = {
    pendingUsers: 5,    // Mock data
    pendingListings: 12, // Mock data
    activeUsers: 150,   // Mock data
    publishedListings: 300, // Mock data
  };

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.welcomeMessage}>Admin Dashboard</h1>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{summaryStats.pendingUsers}</p>
          <p style={styles.statLabel}>Pending User Approvals</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{summaryStats.pendingListings}</p>
          <p style={styles.statLabel}>Listings Awaiting Review</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{summaryStats.activeUsers}</p>
          <p style={styles.statLabel}>Total Active Users</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{summaryStats.publishedListings}</p>
          <p style={styles.statLabel}>Total Published Listings</p>
        </div>
      </div>

      <div style={styles.quickLinksContainer}>
        <h2>Quick Links</h2>
        <Link to="/admin/users?status=pending" style={styles.quickLink}>
          View Users Awaiting Approval
        </Link>
        <Link to="/admin/listings?status=pending_approval" style={styles.quickLink}>
          View Listings Awaiting Review
        </Link>
        {/* Add more quick links as needed */}
      </div>

      {/*
        Future sections for Dashboard:
        - Recent Activity Feeds
        - Charts and Graphs
        - Notifications
      */}
    </div>
  );
};

export default DashboardPage;
