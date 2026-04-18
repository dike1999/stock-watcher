import { HashRouter, Routes, Route } from 'react-router-dom';
import FloatWindow from './pages/FloatWindow';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<FloatWindow />} />
        <Route path='/float' element={<FloatWindow />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
