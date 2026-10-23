import Navbar from './components/Navbar.jsx';
import TitleScreen from './components/TitleScreen.jsx';
import DemoStage from './components/DemoStage.jsx';
import About from './components/About.jsx';
import Characters from './components/Characters.jsx';
import Gameplay from './components/Gameplay.jsx';
import CaseFiles from './components/CaseFiles.jsx';
import HelpFeedback from './components/HelpFeedback.jsx';
import DownloadCTA from './components/DownloadCTA.jsx';
import Footer from './components/Footer.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

export default function App() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <TitleScreen />
        <DemoStage />
        <About />
        <Characters />
        <Gameplay />
        <CaseFiles />
        <HelpFeedback />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}
