import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    settings: {
      _id: 'Collect-setting6',
      data: {
        default: {
          data: {
            files: []
          }
        }
      },
      _rev: ''
    },
    about: {
      author: {},
      disclaimer: '',
      publish: '',
      plugins: [],
    },
  },
  getters: {
    settings: state => {
      let hash = utools.getLocalId();
      let settings = state.settings;
      if (settings._rev === '') {
        let result = utools.db.get(settings._id);
        if (result) {
          settings = result;
          store.commit('updateSettings', settings);
        }
      }
      if (!settings.data[hash]) {
        settings.data[hash] = {
          data: {
            files: []
          }
        };
      }
      return settings.data[hash];
    },
    about: state => state.about,
  },
  mutations: {
    updateSettings(state, settings) {
      state.settings = settings;
    },
    updateSettingsRev(state, rev) {
      state.settings._rev = rev;
    },
    updateSettingsFiles(state, files) {
      let hash = utools.getLocalId();
      state.settings.data[hash].data.files = files;
    },
    saveSettings(state) {
      let settings = state.settings;
      if (settings._rev === '') {
        let result = utools.db.put({
          _id: settings._id,
          data: settings.data
        });
        if (result.error) {
          return false;
        }
        store.commit('updateSettingsRev', result.rev);
      }
      else {
        let result = utools.db.put(settings);
        if (result.error) {
          return false;
        }
        store.commit('updateSettingsRev', result.rev);
      }
      return true;
    },
    updateAuthor: (state, author) => (state.about.author = author),
    updateDisclaimer: (state, disclaimer) => (state.about.disclaimer = disclaimer),
    updatePublish: (state, publish) => (state.about.publish = publish),
    updatePlugins: (state, plugins) => (state.about.plugins = plugins),
  },
});

export default store;
