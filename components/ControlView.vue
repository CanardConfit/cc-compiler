<template>
  <header>
    <nav class="navbar navbar-expand-xl fixed-top navbar-dark bg-dark form-inline">

      <div class="navbar-brand">
        <span class="navbar-brand mb-0 h1">CC Compiler</span>

        <button class="btn btn-secondary mr-1 mb-1" @click="emit('convert')">
         Convert
        </button>

        <select class="custom-select mr-1 mb-1" @change="emit('programLoad', $event)">
         <option value="-">--</option>
         <option value="0">Fibonacci Suite</option>
         <option value="1">Test if</option>
        </select>

        <button class="btn btn-secondary mr-1 mb-1" @click="emit('importCC')">
          Import a .cc
        </button>

        <button class="btn btn-secondary mr-1 mb-1" @click="emit('saveCC')">
          Save as .cc
        </button>

        <button class="btn btn-secondary mr-1 mb-1" @click="emit('exportCirc')">
          Export to .circ
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits(["changeCompiler", "convert", "importCC", "saveCC", "exportCirc", "programLoad"]);
</script>

<style scoped>

</style>
