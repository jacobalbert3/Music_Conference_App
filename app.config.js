require('dotenv').config();
const withPodfileFix = require('./plugins/withPodfileFix');

module.exports = ({ config }) => {
  return withPodfileFix({
    ...config,
    ios: {
      ...config.ios,
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST || "./GoogleService-Info.plist"
    },
    plugins: [
      [
        "@react-native-firebase/app",
        {
          ios_config: {
            googleServicesFile: process.env.GOOGLE_SERVICES_PLIST || "./GoogleService-Info.plist"
          }
        }
      ],
      withPodfileFix,
      ...config.plugins.filter(plugin => 
        typeof plugin === 'string' || plugin[0] !== "@react-native-firebase/app"
      )
    ]
  });
};