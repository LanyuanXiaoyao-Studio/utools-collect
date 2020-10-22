export default {
  addFeatures(files) {
    for (let key in files) {
      let file = files[key];
      this.addFeature(file);
    }
  },
  addFeature(file) {
    let cmds = file.aliases ? [...file.aliases] : [file.name]
    let conf = {
      icon: file.icon,
      code: '#' + file.path,
      explain: file.path,
      cmds: cmds
    };
    return utools.setFeature(conf);
  },
  updateFeature(file) {
    this.removeFeature(file);
    this.addFeature(file);
  },
  removeFeature(file) {
    utools.removeFeature('#' + file.path);
  },
};
