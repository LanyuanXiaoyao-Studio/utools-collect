<template>
  <div class="settings">
    <el-card>
      <div
              slot="header"
              class="clearfix"
      >
        <span><b>关于插件</b></span>
      </div>
      <About/>
    </el-card>
    <el-card>
      <div
              slot="header"
              class="clearfix"
      >
        <span><b>交个朋友</b></span>
      </div>
      <Donate/>
    </el-card>
    <el-card>
      <div
              slot="header"
              class="clearfix"
      >
        <span><b>更多插件</b></span>
      </div>
      <Extra/>
    </el-card>
  </div>
</template>

<script>
  import About from './settings/About'
  import Donate from './settings/Donate'
  import Extra from './settings/Extra'

  export default {
    name: 'Settings',
    components: {
      About,
      Donate,
      Extra,
    },
  }
</script>

<style>
  .settings .el-card + .el-card {
    margin-top: 10px;
  }

  .settings .el-button {
    margin-top: 5px;
  }

  .settings .el-button + .el-button {
    margin-left: 5px;
  }
</style>
