import './App.css';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import Notes from './components/Notes';
import { Routes, Route } from 'react-router-dom';
import AllNotes from './components/AllNotes';
import Login from './components/Login';
import Trash from './components/Trash';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<><Sidebar /><Notes /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/mynotes" element={<><Sidebar /><AllNotes /></>} />
        <Route path="/trash" element={<><Sidebar /><Trash /></>} />
      </Routes>
    </div>
  );
}

export default App;
