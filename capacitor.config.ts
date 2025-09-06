import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.momentum.productivityapp',
  appName: 'Momentum',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
