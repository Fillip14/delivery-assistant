export default ({ config }) => {
  // Detecta profile automaticamente pelo canal do EAS Update
  let profile = process.env.APP_ENV || 'dev';
  if (process.env.EAS_UPDATE_CHANNEL) {
    if (process.env.EAS_UPDATE_CHANNEL === 'preview') profile = 'preview';
    if (process.env.EAS_UPDATE_CHANNEL === 'development') profile = 'dev';
  }

  const variants = {
    dev: {
      name: 'Frontend Dev',
      slug: 'frontend',
      version: '0.0.1-preview',
      androidPackage: 'com.fillip13.frontend.dev',
      iosBundle: 'com.fillip13.frontend.dev',
    },
    preview: {
      name: 'Frontend Preview',
      slug: 'frontend',
      version: '0.0.1-preview',
      androidPackage: 'com.fillip13.frontend.preview',
      iosBundle: 'com.fillip13.frontend.preview',
    },
  };

  const v = variants[profile];

  return {
    owner: 'fillip13',
    name: v.name,
    slug: v.slug,
    version: v.version,
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'frontend',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: v.iosBundle,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: v.androidPackage,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'sentry-expo',
      'expo-background-task',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'a9cbd707-4ebd-4809-b11c-49f5a168d64e',
      },
    },

    updates: {
      url: 'https://u.expo.dev/a9cbd707-4ebd-4809-b11c-49f5a168d64e',
    },
    runtimeVersion: v.version,
  };
};
