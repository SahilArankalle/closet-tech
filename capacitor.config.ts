
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.247db1eff88e4f1d97a5b0a0a165acb7',
  appName: 'ClosetIQ',
  webDir: 'dist',
  server: {
    url: 'https://247db1ef-f88e-4f1d-97a5-b0a0a165acb7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;
