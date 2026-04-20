import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { ApiService } from './services/ApiService';
import { useAppActions } from './store/AppStore';

const apiService = new ApiService();

function App() {
  const actions = useAppActions();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [deviceStatus, recordings, sessions, presets] = await Promise.all([
          apiService.getDeviceStatus(),
          apiService.getRecordings(),
          apiService.getSessions(),
          apiService.getPresets(),
        ]);

        actions.setDeviceStatus(deviceStatus);
        recordings.forEach(recording => actions.addRecording(recording));
        sessions.forEach(session => actions.addSession(session));
        presets.forEach(preset => actions.addPreset(preset));
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, [actions]);

  return <AppRouter />;
}

export { App };
