import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import ListPage from './List/ListPage';
import GalleryPage from './Gallery/GalleryPage';
import DetailsPage from './Details/DetailsPage';
import styles from './App.module.css';

const App: React.FC = () => {
    return (
        <Router basename='/409_mp2'>
            <header>
                <nav className={styles.nav}>
                    <NavLink
                        to="/list"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                        }
                    >
                        List
                    </NavLink>
                    <NavLink
                        to="/gallery"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                        }
                    >
                        Gallery
                    </NavLink>
                </nav>
            </header>
            <main>
                <Routes>
                    <Route path="/list" element={<ListPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/details/:name" element={<DetailsPage />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
