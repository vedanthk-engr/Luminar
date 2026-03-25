import { Routes, Route } from 'react-router-dom'
import Background from './components/layout/Background'
import Sidebar from './components/layout/Sidebar'
import FilmTicker from './components/layout/FilmTicker'
import Home from './pages/Home'
import SceneAutopsy from './pages/SceneAutopsy'
import ScriptAlchemist from './pages/ScriptAlchemist'
import EmotiCine from './pages/EmotiCine'
import ShotComposer from './pages/ShotComposer'
import PromptStudio from './pages/VeoPrompt'
import FestivalOracle from './pages/FestivalOracle'
import CineAccess from './pages/CineAccess'
import CineChat from './pages/CineChat'
import './App.css'

export default function App() {
  return (
    <div className="app-root">
      <Background />
      <Sidebar />
      <main className="app-main">
        <FilmTicker />
        <div className="page-content">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/scene"    element={<SceneAutopsy />} />
            <Route path="/script"   element={<ScriptAlchemist />} />
            <Route path="/emotion"  element={<EmotiCine />} />
            <Route path="/shots"    element={<ShotComposer />} />
            <Route path="/veo"      element={<PromptStudio />} />
            <Route path="/festival" element={<FestivalOracle />} />
            <Route path="/access"   element={<CineAccess />} />
            <Route path="/chat"     element={<CineChat />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
