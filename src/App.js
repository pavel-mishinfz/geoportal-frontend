import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Map from './pages/Map';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />}/>

      </Routes>
    </Router>
  );
}

export default App; 