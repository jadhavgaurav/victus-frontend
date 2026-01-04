import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toasts';
import { AuthProvider } from './auth/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ToastProvider>
              <AppRouter />
          </ToastProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
