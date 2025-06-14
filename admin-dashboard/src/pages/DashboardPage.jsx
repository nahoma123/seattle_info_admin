import React from 'react';
import { Link } from 'react-router-dom';
// We will use classes from index.css. No separate DashboardPage.css for now unless complex.

const DashboardPage = () => {
  // Mock data for summary statistics - will be replaced with API calls later
  const summaryStats = {
    pendingUsers: 5,
    pendingListings: 12,
    activeUsers: 150,
    publishedListings: 300,
  };

  // Define styles that might be more specific or compositional,
  // or could be moved to index.css if they become more general.
  const styles = {
    dashboardContainer: { /* Uses global padding via .p-3 or .container if full width */ },
    welcomeMessage: { fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }, // Matches h2 more or less
    statsContainer: {
      display: 'grid', // Using grid for responsiveness
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', // Responsive columns
      gap: 'var(--spacing-md)',
      marginBottom: 'var(--spacing-lg)',
    },
    statCardCustom: { // For any minor overrides to .card if needed.
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '2.5em', // Larger numbers
      fontWeight: 'bold',
      color: 'var(--primary-color)',
      margin: '0 0 var(--spacing-xs) 0',
    },
    statLabel: {
      fontSize: '1em',
      color: 'var(--text-muted-color)',
    },
    quickLinksContainer: {
      marginTop: 'var(--spacing-lg)',
    },
    // .btn and .btn-primary will be used for quick links
  };

  return (
    <div className="p-3"> {/* Use global padding utility */}
      <h2 style={styles.welcomeMessage}>Admin Dashboard</h2>

      <div style={styles.statsContainer}>
        <div className="card" style={styles.statCardCustom}>
          <div className="card-body">
            <p style={styles.statNumber}>{summaryStats.pendingUsers}</p>
            <p style={styles.statLabel}>Pending User Approvals</p>
          </div>
        </div>
        <div className="card" style={styles.statCardCustom}>
          <div className="card-body">
            <p style={styles.statNumber}>{summaryStats.pendingListings}</p>
            <p style={styles.statLabel}>Listings Awaiting Review</p>
          </div>
        </div>
        <div className="card" style={styles.statCardCustom}>
          <div className="card-body">
            <p style={styles.statNumber}>{summaryStats.activeUsers}</p>
            <p style={styles.statLabel}>Total Active Users</p>
          </div>
        </div>
        <div className="card" style={styles.statCardCustom}>
          <div className="card-body">
            <p style={styles.statNumber}>{summaryStats.publishedListings}</p>
            <p style={styles.statLabel}>Total Published Listings</p>
          </div>
        </div>
      </div>

      <div style={styles.quickLinksContainer}>
        <h3>Quick Links</h3>
        <Link to="/admin/users?status=Pending Approval" className="btn btn-primary mt-1 mb-1">
          View Users Awaiting Approval
        </Link>
        <Link to="/admin/listings?status=pending_approval" className="btn btn-primary mt-1 mb-1">
          View Listings Awaiting Review
        </Link>
        {/* Add more quick links as needed, styled as buttons */}
      </div>
    </div>
  );
};

export default DashboardPage;
