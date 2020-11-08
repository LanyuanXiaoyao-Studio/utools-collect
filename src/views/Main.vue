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
        <div class="operation-bar">
          <span v-if="isMac">
            <el-button
                class="add-button"
                type="text"
                @click="selectFile('all')"
            >
              添加文件/文件夹
            </el-button>
            <el-divider direction="vertical"/>
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
            <el-divider direction="vertical"/>
            <el-button
                class="add-button"
                type="text"
                @click="selectFile('folder')"
            >
              添加文件夹
            </el-button>
            <el-divider direction="vertical"/>
          </span>
          <el-tooltip
              content="当 uTools 主输入框中没有出现已添加的文件, 可尝试重建索引使其恢复"
              effect="dark"
              placement="top"
          >
            <el-button
                class="rebuild-button"
                type="text"
                @click="rebuild()"
            >
              重建索引
            </el-button>
          </el-tooltip>
          <el-divider direction="vertical"/>
          <el-dropdown
              trigger="click"
              @command="handleSettingDropdown"
          >
          <span style="cursor: pointer;color: #409eff">
            配置
            <i
                class="el-icon-arrow-down"
                style="font-size: 12px"
            />
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="in">导入</el-dropdown-item>
              <el-dropdown-item command="out">导出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
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
import md5 from 'md5'

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
      this.$message.info('文件/文件夹正在添加到收藏...')
      for (let i = 0, length = paths.length; i < length; i++) {
        let path = paths[i]
        if (isNil(path) || isEmpty(path)) {
          continue
        }
        await this.addFile(path)
      }
      this.$message.success('文件/文件夹添加成功...')
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
        this.$message.error('选择文件/文件夹失败, 请重试');
        return;
      }
      await this.addFile(path)
    },
    async addFile(path) {
      let file = await window.getFile(path);
      if (!file) {
        this.$message.error(`获取文件/文件夹信息失败, 请重试\n${path}`);
        return
      }

      let index = findIdx(this.files, f => f.path === file.path)
      if (index > -1) {
        this.$message.warning('文件/文件夹已存在');
        return
      }
      this.files.push(file)
      Utils.addFeature(file)
      this.commit()
      this.$message.success(`文件「${file.path}」添加成功`);
    },
    deleteFile(path) {
      let index = this.files.findIndex(f => f.path === path);
      if (index > -1) {
        Utils.removeFeature(this.files[index]);
        this.files.splice(index, 1);
      }
      this.commit()
      this.$message.success(`文件「${path}」已删除`);
    },
    rebuild() {
      utools.getFeatures()
            .forEach(i => utools.removeFeature(i.code))
      Utils.addFeatures(this.settings.data.files)
      this.$message.success('重建成功');
    },
    addAlias(path) {
      let file = find(this.files, f => f.path === path)
      if (file) {
        if (!file.aliases) {
          this.$message.error('该项为旧数据, 不支持多别名设置, 请删除后重新添加')
          return
        }
        this.$prompt('请输入别名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
            .then(({value}) => {
              if (contain(file.aliases, value)) {
                this.$message.warning('别名已存在')
              }
              else {
                file.aliases.push(value)
                Utils.updateFeature(file)
                this.commit()
                this.$message.success(`别名「${value}」添加成功`);
              }
            })
            .catch(() => this.$message.warning('输入已取消'))
      }
    },
    removeAlias(file, alias) {
      remove(file.aliases, value => value === alias)
      Utils.updateFeature(file)
      this.commit()
      this.$message.success(`别名「${alias}」已删除`);
    },
    commit() {
      this.$store.commit('updateSettingsFiles', this.files);
      this.$store.commit('saveSettings');
    },
    handleSettingDropdown(command) {
      switch (command) {
        case 'in':
          let filePath = window.selectFile('file')
          let input = window.importSetting(filePath)
          if (isNil(input.code) || isNil(input.text)) {
            this.$message.error(`文件解析错误`);
            return
          }
          let validateHash = md5(input.text)
          if (input.code !== validateHash) {
            this.$message.error(`文件校验错误`);
            return;
          }
          this.files = JSON.parse(input.text)
          this.commit()
          this.rebuild()
          this.$message.success(`导入成功`);
          break
        case 'out':
          let folderPath = window.selectFile('folder')
          let data = JSON.stringify(this.files)
          let hash = md5(data)
          let result = window.exportSetting(folderPath, `${hash}\n${data}`)
          if (result.success) {
            this.$message.success(`导出成功`);
          }
          else {
            this.$message.error(`导出失败 ${result.message}`);
          }
          break
      }
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

  .operation-bar {
    float: right;

    .add-button, .rebuild-button {
      padding: 3px 0 3px 0;
    }
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
