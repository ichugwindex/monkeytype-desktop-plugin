## Configuration Options

The app reads a config.json configuration file stored in the same directory as the app executable.
See configSampleOptions.json for a sample of the different options available.

These options are for customizing the desktop plugin, not for customizing Monkeytype.  *Press the 'esc' key or go the settings page of Monkeytype in the browser to customize your profile settings.* 

### Options

* windowConfig: options passed into the Electron BrowserWindow, provided as an object.  Suggested options are 'height', 'width', 'x', and 'y' to set the window size and position.  See the [BrowserWindow API](https://www.electronjs.org/docs/v14-x-y/api/browser-window) for the exact options.  
* idsToRemove: array of html ids to remove from the page.  Pass 'top' and 'bottom' to remove the page header and footer for a minimal look.  Useful for removing any custom elements which have a html id.
* backgroundOpacity: the opacity of the background color, provided in a hexadecimal color notation i.e. FF or 00.  Useful for making the background completely clear.  Can see [stackoverflow](https://stackoverflow.com/questions/7015302/css-hexadecimal-rgba) for more details.
* wordsBrightness: sets the brightness of the type test words, provided in a percentage string i.e. 100%.  Helpful for darkening or lightening the text when changing the background opacity.
* showDevTools: shows the devtools window on launch, provided as a boolean value.  Helpful for debugging the application.  
* draggable: enables the moving of the window by holding down a key and target element as the handle, i.e. holding ctrl and click-dragging the center content.  Provided as an object with keys: elemID (string id of the dragging handle, i.e. top, middle, bottom), keyCode (number key to hold down to enable dragging, i.e. 17 for ctrl)
* blurOpacity: sets the opacity of the app when not in focus, provided by a double number i.e. 0.1.   Useful for hiding the app *completely* when you aren't using it.
* blurBackgroundOpacity: sets the opacity of the background of the app when not in focus, provided by a hexadecimal string i.e. 00 for transparent.  Useful for hiding the app *background* when not in focus, but still showing the text.
* blurOnStart: blurs(de-focuses) the application on start up.  Useful for hiding the app in the background on start up.