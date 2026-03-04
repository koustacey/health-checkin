import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CheckinPage } from './pages/CheckinPage/CheckinPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CheckinPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
