<template>
  <div class="main">
    <el-card>
      <div
          slot="header"
          class="clearfix"
      >
        <span class="title">
          <b>文件/文件夹 收藏管理</b>
          <el-button
              class="info"
              icon="el-icon-link"
              type="text"
              @click="settingDialog.show = true"
          />
        </span>
        <span v-if="isMac">
          <el-button
              class="add-button"
              type="text"
              @click="selectFile('all')"
          >
            添加文件/文件夹
          </el-button>
        </span>
        <span v-else>
          <el-button
              class="add-button"
              style="margin-left: 10px"
              type="text"
              @click="selectFile('file')"
          >
            添加文件
          </el-button>
          <el-button
              class="add-button"
              type="text"
              @click="selectFile('folder')"
          >
            添加文件夹
          </el-button>
        </span>
      </div>
      <el-table
          :data="files"
          style="width: 100%"
      >
        <el-table-column
            label="#"
            width="80"
        >
          <template slot-scope="scope">
            <span class="icon">
              <img :src="scope.row.icon"/>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="路径">
          <template slot-scope="scope">
            <div class="name">
              <b>{{ scope.row.name }}</b>
            </div>
            <div class="path">{{ scope.row.path }}</div>
            <div class="alias">
              <el-tag
                  v-for="alias in scope.row.aliases"
                  :key="alias"
                  closable
                  effect="plain"
                  size="small"
                  type="info"
                  @close="removeAlias(scope.row, alias)"
              >
                {{ alias }}
              </el-tag>
              <el-tag
                  effect="plain"
                  size="small"
                  style="cursor: pointer"
                  type="info"
              >
                <i
                    class="el-icon-plus"
                    @click="addAlias(scope.row.path)"
                />
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="160"
        >
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                @click="openPath(scope.row.path)"
            >
              打开
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="deleteFile(scope.row.path)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :visible.sync="settingDialog.show"
        title="设置"
        top="20px"
        width="80%"
    >
      <Settings/>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Utils from '../utils';
import find from 'licia/find'
import findIdx from 'licia/findIdx'
import contain from 'licia/contain'
import remove from 'licia/remove'
import isEmpty from 'licia/isEmpty'
import isNil from 'licia/isNil'
import Settings from '../components/Settings'

export default {
  name: 'Main',
  components: {
    Settings,
  },
  data() {
    return {
      files: [],
      settingDialog: {
        show: false,
      },
    };
  },
  async mounted() {
    this.files = this.settings.data.files;
    utools.setExpendHeight(500);
    if (!isNil(this.$route.params) && !isNil(this.$route.params.paths && !isEmpty(this.$route.params.paths))) {
      let paths = this.$route.params.paths
      this.$warning('文件/文件夹正在添加到收藏...')
      for (let i = 0, length = paths.length; i < length; i++) {
        let path = paths[i]
        if (isNil(path) || isEmpty(path)) {
          continue
        }
        await this.addFile(path)
      }
      this.$success('文件/文件夹添加成功...')
    }
  },
  destroyed() {
    utools.setExpendHeight(1);
  },
  computed: {
    ...mapGetters(['settings']),
    isMac() {
      return utools.isMacOs();
    }
  },
  methods: {
    openPath(path) {
      utools.shellOpenItem(path);
    },
    async selectFile(type) {
      let path = window.selectFile(type);
      if (path === null || path === '') {
        this.$error('选择文件/文件夹失败, 请重试');
        return;
      }
      await this.addFile(path)
    },
    async addFile(path) {
      let file = await window.getFile(path);
      if (!file) {
        this.$error(`获取文件/文件夹信息失败, 请重试\n${path}`);
        return
      }

      let index = findIdx(this.files, f => f.path === file.path)
      if (index > -1) {
        this.$warning('文件/文件夹已存在');
        return
      }
      this.files.push(file)
      Utils.addFeature(file)
      this.commit()
    },
    deleteFile(path) {
      let index = this.files.findIndex(f => f.path === path);
      if (index > -1) {
        Utils.removeFeature(this.files[index]);
        this.files.splice(index, 1);
      }
      this.commit()
    },
    addAlias(path) {
      let file = find(this.files, f => f.path === path)
      if (file) {
        if (!file.aliases) {
          this.$error('该项为旧数据, 不支持多别名设置, 请删除后重新添加')
          return
        }
        this.$prompt('请输入别名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
            .then(({value}) => {
              if (contain(file.aliases, value)) {
                this.$warning('别名已存在')
              }
              else {
                file.aliases.push(value)
                Utils.updateFeature(file)
                this.commit()
              }
            })
            .catch(() => this.$warning('输入已取消'))
      }
    },
    removeAlias(file, alias) {
      remove(file.aliases, value => value === alias)
      Utils.updateFeature(file)
      this.commit()
    },
    commit() {
      this.$store.commit('updateSettingsFiles', this.files);
      this.$store.commit('saveSettings');
    }
  }
};
</script>

<style
    lang="scss"
    scoped
>
.main {
  padding: 5px;
  margin: 5px;

  .title {
    font-size: 1.15em;
  }

  .info {
    padding: 0;
    margin-left: 10px;

    .el-button--text {
      font-size: 1.15em;
    }
  }

  .add-button {
    float: right;
    padding: 3px 0;
  }

  $image_size: 55px;

  .icon > img {
    width: $image_size;
    height: $image_size;
  }

  .name {
    font-size: 1.1rem;
  }

  .path {
    color: #919191;
    word-break: break-word;
  }

  .alias {
    margin-top: 5px;

    .el-tag + .el-tag {
      margin-left: 3px;
    }
  }
}
</style>
