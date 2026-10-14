import { AudioProvider } from './context/AudioProvider.jsx';
import { GameProvider, useGame, VIEWS } from './context/GameProvider.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import CaseFilesScreen from './components/CaseFilesScreen.jsx';
import DashboardPanel from './components/DashboardPanel.jsx';
import AnalyticsPanel from './components/AnalyticsPanel.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import LevelModal from './components/LevelModal.jsx';
import DialogueIntro from './components/DialogueIntro.jsx';
import QuizWorkstation from './components/QuizWorkstation.jsx';
import LevelResults from './components/LevelResults.jsx';

const PANELS = {
  dashboard: DashboardPanel,
  cases: CaseFilesScreen,
  analytics: AnalyticsPanel,
  settings: SettingsPanel,
};

function Screens() {
  const { state } = useGame();
  const Panel = PANELS[state.panel];

  if (state.view === VIEWS.DIALOGUE_INTRO) return <DialogueIntro />;
  if (state.view === VIEWS.QUIZ_WORKSTATION) return <QuizWorkstation />;
  if (state.view === VIEWS.LEVEL_RESULTS) return <LevelResults />;

  // DASHBOARD, with the LEVEL_MODAL layered on top when a case is open.
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="dotted-paper min-w-0 flex-1 overflow-hidden bg-ep-sand p-3 sm:p-5 lg:p-6">
          <Panel />
        </main>
      </div>
      {state.view === VIEWS.LEVEL_MODAL && <LevelModal />}
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <GameProvider>
        <div className="h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-ep-royal/90 via-ep-navy to-ep-deep">
          <Screens />
        </div>
      </GameProvider>
    </AudioProvider>
  );
}
