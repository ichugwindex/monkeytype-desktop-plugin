const { app, BrowserWindow, screen } = require('electron');
const fs = require('fs');

const monkeytypeURL = 'https://monkeytype.com';

const noGridContentStyle = {
  id: 'centerContent',
  key: 'display',
  value: 'block'
};

const wordBrightnessStyle = (textBrightness) => ({
  id: 'words',
  key: 'filter',
  value: `brightness(${textBrightness})`
});

const getConfig = (path) => {
  var configObj = {};
  try {
    configObj = JSON.parse(fs.readFileSync(path, {encoding: "utf8"}));
  } catch (e) {
    console.log('failed to parse config file');
    console.debug(e);
  }
  return configObj;
}

const removeElemById = (window) => (id) =>
  window.webContents.executeJavaScript(`
    const ${id}RemoveElem = document.getElementById('${id}');
    ${id}RemoveElem.remove();
  `);

const applyStylesById = (window) => ({id, key, value}) =>
  window.webContents.executeJavaScript(`
    const ${id}StyleElem = document.getElementById('${id}');
    ${id}StyleElem.style.${key} = '${value}';
  `);

const setupBackgroundColor = (window) => {
   window.webContents.executeJavaScript(`
    const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-color');
  `);
}

const setBackgroundOpacity = (window, backgroundOpacity) => {
   window.webContents.executeJavaScript(`
    document.body.style.backgroundColor = bgColor + '${backgroundOpacity}';
  `);
}

const makeKeyDownDraggableHandle = (window, elemID, keyCode) => {
  window.webContents.executeJavaScript(`
    const draggableElem = document.getElementById('${elemID}');
    let keyDown = false;
    document.addEventListener('keydown', (evt) => {
      if(evt.keyCode === ${keyCode} && !keyDown) {
        keyDown = true;
        draggableElem.style['-webkit-user-select'] = 'none';
        draggableElem.style['-webkit-app-region'] = 'drag';
      }
    });
    document.addEventListener('keyup', (evt) => {
      if(evt.keyCode === ${keyCode} && keyDown) {
        keyDown = false;
        draggableElem.style['-webkit-user-select'] = '';
        draggableElem.style['-webkit-app-region'] = '';
      }
    });
  `);
}

const config = getConfig('./config.json');
console.log(config);
const sectionsToRemove = config.idsToRemove || [];
let stylesToApply = [];
if (sectionsToRemove.includes('top') && sectionsToRemove.includes('bottom')) {
  // Removes the grid style to remove the scrollbar
  stylesToApply = [...stylesToApply, noGridContentStyle]
}
if (!!config.wordsBrightness) {
  stylesToApply = [...stylesToApply, wordBrightnessStyle(config.wordsBrightness)]
}
if (!!config.blurOpacity) {
  app.on('browser-window-blur', (event, browserWindow) => {
    if (!!config.blurBackgroundOpacity) {
      setBackgroundOpacity(browserWindow, config.blurBackgroundOpacity)
    }
    browserWindow.setOpacity(config.blurOpacity)
  });
  app.on('browser-window-focus', (event, browserWindow) => {
    if (!!config.blurBackgroundOpacity) {
      setBackgroundOpacity(browserWindow, !!config.backgroundOpacity ? config.backgroundOpacity : 'FF')
    }
    browserWindow.setOpacity(1.0)
  });
}

app.on('ready', () => {
  const { workAreaSize } = screen.getPrimaryDisplay();
  const window = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    icon: './assets/mt-favicon.ico',
    ...(!!config.windowConfig && config.windowConfig),
  });
  window.loadURL(monkeytypeURL);
  if (!!config.showDevTools) {
    window.webContents.openDevTools({ mode: 'detach' });
  }
  window.webContents.on('ready-to-show', () => {
    setupBackgroundColor(window);
    // Set the transparent background
    if (!!config.backgroundOpacity) {
     setBackgroundOpacity(window, config.backgroundOpacity);
    }
    if (!!config.draggable) {
      makeKeyDownDraggableHandle(window, config.draggable.elemID, config.draggable.keyCode);
    }
    // Delete Sections
    sectionsToRemove.forEach(removeElemById(window));
    // Apply Styles
    stylesToApply.forEach(applyStylesById(window));
    window.show();
    if (!!config.blurOnStart) {
      window.blur();
    }
  });
});
