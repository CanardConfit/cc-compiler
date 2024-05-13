<template>
  <div class="row">
    <div class="col-12">
      <div class="card bg-light mb-3">
        <div class="card-header">Code</div>
        <div class="card-body overflow-auto">
          <MonacoEditor id="editor" :model-value="modelValue" @update:model-value="emit('change', $event)" lang="c" :options="{ theme: 'vs-dark' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(["modelValue"]);
const emit = defineEmits(["change"]);
</script>

<style lang="scss">
  #editor {
    height: 600px;
    align-content: center;
  }
</style>
