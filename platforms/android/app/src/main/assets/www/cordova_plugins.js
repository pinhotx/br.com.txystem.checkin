cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-animated-splashscreen.AnimatedSplashScreen",
    "file": "plugins/cordova-plugin-animated-splashscreen/www/animatedsplashscreen.js",
    "pluginId": "cordova-plugin-animated-splashscreen",
    "clobbers": [
      "navigator.animatedSplashScreen"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-splashscreen": "5.0.2",
  "cordova-plugin-animated-splashscreen": "1.1.3"
};
// BOTTOM OF METADATA
});