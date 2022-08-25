import { FC, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Typography from '@mui/material/Typography';

// Pages
const HomePage = lazy(() => import(/* webpackChunkName: "home.page" */'./pages/HomePage'));
const EnvPage = lazy(() => import(/* webpackChunkName: "env.page" */'./pages/EnvPage'));

// Component
export const App: FC = () => {
  // Render
  return (
    <Suspense fallback={<Typography>loading ...</Typography>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/env" element={<EnvPage />} />
      </Routes>
    </Suspense>
  );
};
