import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy loading components for better performance
const Home = lazy(() => import('./pages/Home'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
