const withModularHeaders = (config) => {
  if (!config.modResults) {
    return config;
  }

  const contents = config.modResults.contents;
  if (!contents.includes('use_modular_headers!')) {
    const platformMatch = contents.match(/(platform :ios.*$)/m);
    if (platformMatch) {
      config.modResults.contents = contents.replace(
        platformMatch[0],
        `${platformMatch[0]}\nuse_modular_headers!`
      );
    }
  }

  return config;
};

module.exports = withModularHeaders; 