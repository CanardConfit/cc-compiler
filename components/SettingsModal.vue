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
              <select class="form-control" id="compilerVersion" v-model="compilerVersion">
                <option :value="version" v-for="version in CompilerVersion" :key="version">
                  {{ version }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="loadProgram">Charger un programme</label>
              <select class="form-control" id="loadProgram" v-model="loadProgram">
                <option :value="program.id" v-for="program in programs" :key="program.id">
                  {{ program.name }}
                </option>
              </select>
            </div>
            <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="interruptEnable" v-model="interruptEnable">
              <label class="form-check-label" for="interruptEnable">Activer l'interruption</label>
            </div>
            <div class="form-group">
              <label for="interruptPadding">Padding d'interruption</label>
              <input type="number" class="form-control" id="interruptPadding" v-model="interruptPadding">
            </div>
            <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="only8variables" v-model="only8variables">
              <label class="form-check-label" for="only8variables">Seulement 8 variables</label>
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
