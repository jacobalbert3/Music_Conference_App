const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withPodfileFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.projectRoot, 'ios', 'Podfile');

      if (fs.existsSync(podfilePath)) {
        let podfileContents = fs.readFileSync(podfilePath, 'utf8');

        // Ensure static frameworks linking is set correctly
        podfileContents = podfileContents.replace(
          /use_frameworks!.*\n/g, 
          'use_frameworks! :linkage => :static\n'
        );

        // Add modular headers for Firebase
        if (!podfileContents.includes("pod 'Firebase/Auth', :modular_headers => true")) {
          podfileContents = podfileContents.replace(
            "use_frameworks! :linkage => :static\n",
            `use_frameworks! :linkage => :static

# Ensure Firebase dependencies use modular headers
pod 'Firebase/Auth', :modular_headers => true
pod 'Firebase/Core', :modular_headers => true
pod 'Firebase/CoreOnly', :modular_headers => true
pod 'FirebaseAuthInterop', :modular_headers => true
pod 'FirebaseAppCheckInterop', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
pod 'RecaptchaInterop', :modular_headers => true

`
          );
        }

        fs.writeFileSync(podfilePath, podfileContents, 'utf8');
      }

      return config;
    },
  ]);
};
