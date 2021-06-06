<template>
  <div id="frame">
    <el-slider
      v-model="dProgress"
      :show-tooltip="false"
      @change="change"
    ></el-slider>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  data() {
    return {
      dProgress: this.$props.progress,
    };
  },
})
export default class HelloWorld extends Vue {
  @Prop({ default: 0 }) private progress!: number;
  change(value: number) {
    console.log(value);
  }
}
</script>
<style scoped lang="scss">
#frame {
  border-top: 1px solid grey;
  width: 100%;
  height: 70px;
  position: fixed;
  bottom: 0;
  background-color: #212124;
  .el-slider {
    width: 500px;
    margin: auto;
    padding: {
      top: 15px;
    }
  }
}
</style>
