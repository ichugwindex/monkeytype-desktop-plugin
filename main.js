const { app, BrowserWindow, screen } = require('electron');

// const backgroundOpacity = '7F'; //https://stackoverflow.com/questions/7015302/css-hexadecimal-rgba
const backgroundOpacity = 'FF';
const textDarkness = '100%';
const sectionsToRemove = ['top', 'bottom'];
const stylesToApply = [
  {
    id: 'centerContent',
    key: 'display',
    value: 'block'
  },
  {
    id: 'words',
    key: 'filter',
    value: `brightness(${textDarkness})`
  }
];

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

app.on('ready', () => {
  const { workAreaSize } = screen.getPrimaryDisplay();
  const window = new BrowserWindow({
    show:false,
    frame: false,
    transparent: true,
    // width: 980,
    // height: 300,
    resizable: false,
    skipTaskbar: true,
    icon: './mt-favicon.ico',
  });

  window.loadURL('https://monkeytype.com');
  window.webContents.openDevTools({ mode: 'detach' });

  // window.on('show', () => {
  //   window.setSize(workAreaSize.width, workAreaSize.height);
  //   window.center();
  // });

  // window.on('hide', () => {
  //   window.setSize(workAreaSize.width - 1, workAreaSize.height - 1);
  // });
  window.webContents.on('ready-to-show', () => {
    // Set the transparent background
    window.webContents.executeJavaScript(`
      const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-color');
      document.body.style.backgroundColor = bgColor + '${backgroundOpacity}';
    `);
    // Delete Sections
    sectionsToRemove.forEach(removeElemById(window));
    // Apply Styles
    stylesToApply.forEach(applyStylesById(window));
    window.show();
  });
});
app.on ('browser-window-blur', function (event, browserWindow)
{
    browserWindow.setOpacity (0.1);
});
//
app.on ('browser-window-focus', function (event, browserWindow)
{
    browserWindow.setOpacity (1.0);
});