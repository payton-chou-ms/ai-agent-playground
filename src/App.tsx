import { ConsolePage } from './pages/ConsolePage';
import './App.scss';
import { AppProvider } from './providers/AppProvider';
import { SettingsProvider } from './providers/SettingsProvider';
import { AssistantProvider } from './providers/AssistantProvider';
import { AvatarProvider } from './providers/AvatarProvider';
import { SttProvider } from './providers/SttProvider';
import { RealtimeProvider } from './providers/RealtimeProvider';
import LocalStorageViewer from './pages/LocalStorageViewer';
import Loading from './pages/Loading';

function App() {
  return (
    <div data-component="App">
      <SettingsProvider>
        <AppProvider>
          <AvatarProvider>
            <AssistantProvider>
              <SttProvider>
                <RealtimeProvider>
                  <Loading />
                  <LocalStorageViewer />
                  <ConsolePage />
                </RealtimeProvider>
              </SttProvider>
            </AssistantProvider>
          </AvatarProvider>
        </AppProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;
