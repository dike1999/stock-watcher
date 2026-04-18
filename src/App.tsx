import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FloatWindow from './pages/FloatWindow';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<FloatWindow />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
