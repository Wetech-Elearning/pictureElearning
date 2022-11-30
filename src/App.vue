<template>
  <transition name="fade">
    <router-view :key="$route.fullPath"></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>
