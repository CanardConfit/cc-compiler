<template>
  <div v-if="errors && errors.length" class="alert alert-danger" role="alert">
    <div v-for="error in errors">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps(["errors"]);
</script>

<style scoped>

</style>
