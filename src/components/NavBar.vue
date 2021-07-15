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
// import { Component, Vue } from "vue-property-decorator";
// @Component
// export default class App extends Vue {}
</script>

<style lang="scss" scoped>
@import "../red-theme.scss";

nav {
  position: sticky;
  top: 0px;
  background: white;
  border-bottom: 2px solid $--color-primary;
  z-index: 2;

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
        text-align: center;
        line-height: 70px;

        a {
          display: block;
          font-weight: 600;
          color: black;
          padding: 0 20px;
          text-decoration: none;
          height: inherit;

          &.router-link-exact-active {
            color: white;
            background: $--color-primary;
          }
          &:hover:not(.router-link-exact-active) {
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