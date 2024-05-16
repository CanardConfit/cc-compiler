<template>
  <header>
    <nav class="navbar navbar-expand-xl fixed-top navbar-dark bg-dark form-inline">

      <div class="navbar-brand">
        <span class="navbar-brand mb-0 h1"><img src="/favicon.ico" alt="favicon" style="height: 30px;" class="mr-1" /> CC Compiler</span>

        <button class="btn btn-secondary mr-1 mb-1" @click="emit('options')">
         Options
        </button>

        <button class="btn btn-secondary mr-5 mb-1" @click="emit('convert')">
         Convert
        </button>

        <button class="btn btn-secondary mr-1 mb-1" @click="triggerFileUpload">
          Import a .cc
        </button>
        <input type="file" ref="fileInput" class="d-none" @change="handleFileUpload" accept=".cc"/>

        <button class="btn btn-secondary mr-1 mb-1" @click="emit('saveCC')">
          Save as .cc
        </button>

        <button class="btn btn-secondary mr-5 mb-1" @click="emit('exportCirc')">
          Export to .circ
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const fileInput = ref<HTMLInputElement|null>(null);
const emit = defineEmits(["convert", "importCC", "saveCC", "exportCirc", "options"]);

function triggerFileUpload() {
  fileInput.value?.click();
}

function handleFileUpload(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      emit('importCC', e.target.result);
    };
    reader.readAsText(file);
  }
}
</script>

<style scoped>

</style>
