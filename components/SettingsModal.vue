<template>
  <div v-if="show" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="settingsModalLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="settingsModalLabel">Paramètres</h5>
          <button type="button" class="close" @click="closeModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="compilerVersion">Version du compilateur</label>
              <input type="text" class="form-control" id="compilerVersion" v-model="compilerVersion">
            </div>
            <div class="form-group">
              <label for="includeInterruptZone">Inclusion d'une zone d'interruption</label>
              <input type="checkbox" class="form-control" id="includeInterruptZone" v-model="includeInterruptZone">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
          <button type="button" class="btn btn-primary" @click="saveSettings">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {CCOptions} from "~/utils/objects";

const emit = defineEmits(["update:show", "update:options"]);
defineProps(["show"]);

const compilerVersion = ref("");
const interruptEnable = ref(false);
const interruptPadding = ref(0);
const loadProgram = ref(0);
const only8variables = ref(false);

function closeModal() {
  emit("update:show", false);
}
function saveSettings() {
  emit("update:options", {
    compilerVersion: compilerVersion,
    interruptEnable: interruptEnable,
    interruptPadding: interruptPadding,
    loadProgram: loadProgram,
    only8variables: only8variables,
  } as unknown as CCOptions);

  closeModal();
}
</script>

<style scoped>

</style>
