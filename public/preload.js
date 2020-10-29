const fileIcon = require('./file-icon');

const fs = require('fs');
const path = require('path');
const os = require('os');

const folderIcon =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAk1BMVEUAAAD/yyn/ySf/nwD/wB7/oAD/oQD/nwD/yyn/qgD/xCL/yyf/yij/yyf/wCL/yij/yij/uxn/wyH/oQD/oAD/uBT/nwD/oAD/wR7/vRz/oAD/qgj/vBn/oAD/ySn/yyf/uRj/oQD/oAD/oAD/uhj/txf/ySj/ogD/nQD/zCj/yyn/yij/oAD/xyX/vRv/rgz/qAfeNa39AAAAK3RSTlMAqlVV4/2rWDkD/IZ7Tgr22NHQXE9BOPfl3Nm2rp6dnJKKgXx2WUw/Ly0sB6zbXAAAAORJREFUaN7t0VkOgkAURNFGQQEF53meh34I+1+d/L8mflAmxtTdwEmlDGOMMYYvnY6bjqZA4t6aibOgDTNOgajQykFUcGUsKrgSLeX7yk0+FYxqI0dR4bdsRIXf0pKy/JVZQLG/j6qQIraw4osbyTMLLDu7kKI0oMrEgbwsuLlGVhaenjLAI2uFLPDIQCE+HvGJEPk3ZIhHhgrx8IhHhAgRIkSIECFChAgRIj+LbPHITiEdPNJVSIhHQoVEfbTRj4wqQSNXReBf6RhnXfDr7h5eDyP0vKepLg2TRu2SMDWMMcYYvDcqK0d6s+l/JQAAAABJRU5ErkJggg==';
const fileDefaultIcon =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAAJFBMVEUAAACQyfmRyvqPxv+Py/mQyvuRyfmQyvnh9f6+4vug0/qZz/ohWhTlAAAAB3RSTlMAVbsIuT6drnBT7QAAAI9JREFUWMPtzbENQFAYRWFb6CV6O9jACiaQSKzABJhAYgTT+ZsbjeC8RHdP/+VkLrWmuK19IPlwW19BEtWUbLGBZI0NJMscG0im2EAyagOINoBoA4g2gGgDiDaAaAOINoBoA4g2hGgDiDaEaAOINpDEpqNk+kyOXX0mVyYmJiYmJiYmJiYmJr+QpnipzFxiJyWDEoYsQsYkAAAAAElFTkSuQmCC';

window.selectFile = type => {
  let paths = [];
  switch (type) {
    case 'file':
      paths = utools.showOpenDialog({
        properties: ['openFile']
      });
      break;
    case 'folder':
      paths = utools.showOpenDialog({
        properties: ['openDirectory']
      });
      break;
    default:
      paths = utools.showOpenDialog({
        properties: [
          'openDirectory',
          'openFile',
          'treatPackageAsDirectory',
          'createDirectory'
        ]
      });
  }
  return !paths || paths.length < 1 || paths[0] === '' ? '' : paths[0];
};

window.getFile = async currentPath => {
  let info = path.parse(currentPath);

  let state = fs.statSync(currentPath);
  let icon = '';

  if (os.platform() === 'darwin') {
    let buffer = await fileIcon.buffer(currentPath, {
      size: 128
    });
    icon = `data:image/png;base64,${buffer.toString('base64')}`;
  }
  else if (utools.getFileIcon) {
    icon = utools.getFileIcon(currentPath, {size: 'large'})
                 .toString('base64')
  }
  else {
    icon = fileDefaultIcon;
    if (state.isDirectory()) {
      icon = folderIcon;
    }
  }

  return {
    icon: icon,
    name: info.base,
    path: currentPath,
    type: state.isDirectory() ? 'folder' : 'file',
    aliases: [
      info.base
    ]
  };
};

const https = require('https')

window.get = (url, callback) => {
  https
      .get(url, response => {
        let data = ''
        response.on('data', chunk => data += chunk)
        response.on('end', () => callback(data))
      })
      .on('error', error => callback(''))
}

const result = (success, message = '') => {
  return {
    success: success,
    message: message,
  }
}

const generateDate = () => {
  let date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
}

window.exportSetting = (currentPath, data) => {
  let state = fs.statSync(currentPath)
  if (!state.isDirectory()) {
    return result(false, '请选择一个文件夹')
  }
  let filePath = path.join(currentPath, `utools-collect-setting-${generateDate()}.backup`)
  fs.writeFileSync(filePath, data)
  return result(true)
}

window.importSetting = currentPath => {
  let state = fs.statSync(currentPath)
  if (state.isDirectory()) {
    return result(false, '请选择一个文件')
  }
  let data = fs.readFileSync(currentPath, {encoding: 'utf8'})
  let array = data.split('\n')
                  .filter(s => s !== null && s !== '')
  return {
    code: array[0],
    text: array[1]
  }
}
