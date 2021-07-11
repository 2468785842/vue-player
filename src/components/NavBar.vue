<template>
  <nav>
    <div class="content">
      <ul>
        <li>
          <router-link to="/">首页</router-link>
        </li>
        <li>
          <router-link to="/about">ABOUT</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
@import "../red-theme.scss";

nav {
  width: 100vw;

  .content {
    width: 1100px;
    height: fit-content;
    margin: auto;

    ul {
      list-style: none;
      margin: 0px;
      padding: 0px;

      li {
        float: left;
        height: 70px;
        padding: 0 10px;
        text-align: center;
        line-height: 70px;

        a {
          color: black;
          text-decoration: none;

          &:hover {
            color: $--color-primary;
          }
        }
      }

      &::after {
        display: block;
        content: "";
        clear: both;
      }
    }
  }
}
</style>