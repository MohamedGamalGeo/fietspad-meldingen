import React from 'react';
import { Link } from 'react-router-dom';
import VideoContainer from '../VideoContainer/VideoContainer';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.homeContainer}>
            {/* Header Section */}
            <header className={styles.header}>
                <h1>Welcome to Cycle Path Reporter</h1>
                <p>Your platform to report and resolve cycle path issues efficiently</p>
            </header>

            {/* Video Section */}
            <section className={styles.videoSection}>
                <h2>How It Works</h2>
                <VideoContainer videoId="ayPDlDi9Ug4" />
                <p>Watch this video to learn how to report cycle path issues and help make cycling safer.</p>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <h2>Why Use Cycle Path Reporter?</h2>
                <div className={styles.featureList}>
                    <div className={styles.feature}>
                        <h3>Report Issues</h3>
                        <p>Easily report damages, obstructions, or hazards on cycle paths in your area.</p>
                    </div>
                    <div className={styles.feature}>
                        <h3>Track Your Reports</h3>
                        <p>Log in to track the status of the issues you’ve reported.</p>
                    </div>
                    <div className={styles.feature}>
                        <h3>Admin Dashboard</h3>
                        <p>Municipal authorities can view reports and take action to fix problems.</p>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className={styles.ctaSection}>
                <h2>Get Started Today!</h2>
                <p>Make your cycling experience safer by reporting issues in your area.</p>
                <div className={styles.ctaButtons}>
                    <Link to="/signup" className={styles.ctaButton}>Sign Up</Link>
                    <Link to="/login" className={styles.ctaButton}>Log In</Link>
                </div>
            </section>

            {/* Footer Section */}
            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Cycle Path Reporter. All rights reserved.</p>
                <div className={styles.footerLinks}>
                    <Link to="/terms">Terms of Service</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                </div>
            </footer>
        </div>
    );
};

export default Home;
