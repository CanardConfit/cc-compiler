<template>
  <div v-if="show" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="copyLinkModalLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="copyLinkModalLabel">Copy Link</h5>
          <button type="button" class="close" @click="closeModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="linkInput">Your Link</label>
              <input type="text" class="form-control" id="linkInput" v-model="link" readonly>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" :disabled="isSupported" class="btn btn-primary" @click="copyToClipboard">Copy Link</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits(['update:show']);
const props = defineProps(["show", "link"]);

const isSupported = computed(() => navigator.clipboard == undefined);

const link = ref<string>(props.link);

watch(() => props.link, (newLink) => {
  link.value = newLink;
}, { immediate: true });

function closeModal() {
  emit('update:show', false);
}

async function copyToClipboard() {
  if (navigator.clipboard)
    await navigator.clipboard.writeText(link.value);
}
</script>

<style scoped>

</style>
