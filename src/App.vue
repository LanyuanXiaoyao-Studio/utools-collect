<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Utils from './utils'

  export default {
    mounted() {
      utools.onPluginReady(() => {
        utools.getFeatures()
              .forEach(i => utools.removeFeature(i.code))
        Utils.addFeatures(this.settings.data.files)
        window.get('https://gitee.com/lanyuanxiaoyao/utools-data/raw/master/common.json', result => {
          let data = JSON.parse(result)
          this.$store.commit('updateAuthor', data['author'])
          this.$store.commit('updateDisclaimer', data['disclaimer'])
        })
        window.get('https://gitee.com/lanyuanxiaoyao/utools-data/raw/master/utools-collect/common.json', result => {
          let data = JSON.parse(result)
          this.$store.commit('updatePublish', data['publish'])
        })
        window.get('https://gitee.com/lanyuanxiaoyao/utools-data/raw/master/plugins.json', result => {
          let data = JSON.parse(result)
          this.$store.commit('updatePlugins', data)
        })
      })
      utools.onPluginEnter(({code, type, payload}) => {
        if (utools.isDarkColors && utools.isDarkColors()) {
          document.body.className = 'dark-mode'
        }
        switch (type) {
          case 'text':
            if (code[0] === '#') {
              utools.shellOpenItem(code.substring(1, code.length))
              utools.outPlugin()
            }
            else {
              this.$router.push('/main')
            }
            break
          case 'files':
            this.$router.push({
              name: 'Main',
              params: {
                paths: payload.map(f => f.path)
              }
            })
            break
          case 'window':
            let path = utools.getCurrentFolderPath()
            this.$router.push({
              name: 'Main',
              params: {
                paths: [path]
              }
            })
            break
          default:
            this.$router.push('/main')
        }
      })
      utools.onPluginOut(() => {
        this.$router.push('/')
      })
    },
    computed: mapGetters({
      settings: 'settings'
    })
  }
</script>

<style lang="scss">
  :root {
    --info-color: #525252;
    --primary-color: #0754bf;
    --danger-color: #a03a3a;
    --text-color: #c1c1c1;
    --background-color: #343438;
    --border-color: #4e4e50;
    --card-text-color: var(--text-color);
    --card-background-color: var(--background-color);
    --card-border-color: var(--border-color);
    --dialog-text-color: var(--text-color);
    --tag-backgroud-color: #575757;
    --tag-border-color: #424242;
    --tag-text-color: #a8a8a8;
    --message-background-color: var(--background-color);
    --message-border-color: var(--border-color);
  }

  .dark-mode {
    .el-card {
      color: var(--card-text-color);
      border-color: var(--card-border-color);

      .el-card__header, .el-card__body {
        background-color: var(--card-background-color);
        border-color: var(--card-border-color);
      }
    }

    .el-table {
      th.is-leaf, td {
        border-color: var(--card-border-color);
      }

      .el-table__header thead th {
        background-color: var(--card-background-color);
      }

      .el-table__body tbody td {
        background-color: var(--card-background-color);
      }

      &:before, .el-table__fixed-right:before {
        background-color: var(--border-color);
      }
    }

    .el-dialog {
      .el-dialog__title {
        color: var(--dialog-text-color);
      }

      .el-dialog__header, .el-dialog__body {
        background-color: var(--card-background-color);
      }
    }

    .el-button {
      background-color: var(--info-color);
      border-color: var(--info-color);
      color: var(--text-color);
    }

    .el-button.el-button--text {
      color: var(--primary-color);
      border-color: transparent;
      background-color: transparent;
    }

    .el-button--primary {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    .el-button--danger {
      background-color: var(--danger-color);
      border-color: var(--danger-color);
    }

    .el-tag--plain.el-tag--info {
      color: var(--tag-text-color);
      border-color: var(--tag-border-color);
      background-color: var(--tag-backgroud-color);
    }

    .el-input__inner {
      background-color: var(--info-color);
      border-color: var(--background-color);
      color: var(--text-color);

      &:focus {
        border-color: var(--border-color);
      }
    }

    .el-message-box {
      background-color: var(--message-background-color);
      border-color: var(--message-border-color);

      .el-message-box__title {
        color: var(--text-color);
      }
    }

    .name {
      color: var(--text-color);
    }
  }
</style>
