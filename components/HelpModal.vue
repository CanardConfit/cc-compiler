<template>
  <div v-if="show" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="settingsModalLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Markdown Content</h5>
          <button type="button" class="close" @click="closeModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps(["show"]);
const emit = defineEmits(["update:show"]);

const markdownContent = ref("");

onMounted(() => {
  loadMarkdownReadme();
});

function closeModal() {
  emit("update:show", false);
}

async function loadMarkdownReadme() {
  const response = await fetch("https://raw.githubusercontent.com/CanardConfit/cc-compiler/master/README.md");
  markdownContent.value = await response.text();
}
</script>

<style scoped>
.modal-body {
  white-space: pre-wrap;
}
</style>
