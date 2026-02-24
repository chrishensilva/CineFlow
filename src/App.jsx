import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy loading components for better performance
const Home = lazy(() => import('./pages/Home'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Suspense fallback={<div className="flex-center" style={{ height: '100vh', color: 'white' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
