<template>
  <footer class="bg-dark text-white py-3 mt-auto">
    <div class="container text-center">
      <p class="mb-0">Made by CanardConfit (Tom Andrivet) | Version : <a style="color: white" :href="'https://github.com/CanardConfit/cc-compiler/tree/' + commitHash">{{ commitHash }}</a></p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const commitHash = ref("");

onMounted(async () => {
  const response = await fetch("commit-hash.txt");
  commitHash.value = await response.text();
});
</script>

<style scoped>

</style>
