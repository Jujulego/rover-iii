import { FC, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import { TopBar } from './components/bar/TopBar';

// Pages
const AuthPage = lazy(() => import(/* webpackChunkName: "auth.page" */'./pages/AuthPage'));
const HomePage = lazy(() => import(/* webpackChunkName: "home.page" */'./pages/HomePage'));
const EnvPage = lazy(() => import(/* webpackChunkName: "env.page" */'./pages/EnvPage'));

// Component
export const App: FC = () => {
  // Render
  return (
    <>
      <TopBar />
      <Suspense fallback={<Typography>loading ...</Typography>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/env" element={<EnvPage />} />
        </Routes>
      </Suspense>
    </>
  );
};
