<template>
  <div class="settings-donate">
    <p
        style="font-family: serif"
        v-html="about.author.lines"
    />
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-image
              :src="about.author.donateCode"
              fit="fill"
          />
        </el-col>
        <el-col :span="16">
          <div class="business-card">
            <el-image
                class="avatar"
                :src="about.author.avatar"
            />
            <div class="name">
              {{ about.author.name }}
              <el-tooltip
                  effect="dark"
                  content="论坛找我"
                  placement="top"
              >
                <el-button
                    type="text"
                    icon="el-icon-link"
                    @click="openUtoolsHome"
                />
              </el-tooltip>
            </div>
            <div
                class="slogan"
                v-html="about.author.slogan"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'SettingsDonate',
  computed: {
    ...mapGetters([
      'about',
    ]),
  },
  methods: {
    openUtoolsHome() {
      let url = this.about.author.utoolsHome
      if (url && url !== '') {
        utools.shellOpenExternal(url)
      }
    }
  }
}
</script>

<style scoped>
.settings-donate .el-card {
  width: 360px;
}

.settings-donate .el-card .business-card {
  text-align: center;
}

.settings-donate .el-card .business-card .avatar {
  width: 40px;
}

.settings-donate .el-card .business-card .name {
  font-size: 1.3rem;
  font-weight: bold;
  font-family: serif;
}

.settings-donate .el-card .business-card .name .el-button {
  margin: 0;
  padding: 0;
}
</style>
