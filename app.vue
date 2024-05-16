<template>
  <ControlView @changeCompiler="" @options="showModal = true" @help="showHelpModal = true" @convert="convert()" @exportCirc="exportCirc()" @programLoad="programLoad($event)" @importCC="importCC($event)" @saveCC="saveCC()" />
  <main role="main" class="container-fluid">
    <div class="row">
      <div class="col-xl-6 col-lg-7 col-md-12">
        <CodeEditor :model-value="defaultValue" @change="e => (editorCode = e)" />
      </div>
      <div class="col-xl-6 col-lg-7 col-md-12">
        <AssemberViewer :asm="asm" />
      </div>
    </div>
  </main>
  <SettingsModal :show="showModal" @update:show="showModal = $event" />
  <MarkdownModal :show="showHelpModal" @update:show="showHelpModal = $event" />
</template>

<script setup lang="ts">
import {type CCLine, compile_cc} from "~/utils/compiler";

const defaultValue = ref("");
const editorCode = ref(defaultValue);
const asm = ref<CCLine[]|null>(null);
const showModal = ref(false);
const showHelpModal = ref(false);

let xmlTemplate: string = "";

onMounted(() => {
  loadXMLTemplate();
});

function convert() {
  asm.value = compile_cc(editorCode.value.split("\n"), true);
}

async function loadXMLTemplate() {
  const response = await fetch('template.circ');
  xmlTemplate = await response.text();
}

function exportCirc() {
  let circ = xmlTemplate;
  for (let i = 0; i < Math.pow(2, 8); i++) {
    let c = asm.value?.at(i);
    if (c) {
      circ = circ.replace(`{{a${i}}}`, `0x${c.asm.toString(16)}`);
    } else {
      circ = circ.replace(`{{a${i}}}`, `0x5000`);
    }
  }
  const blob = new Blob([circ], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rom.circ';
  a.click();
  URL.revokeObjectURL(url);
}

function importCC(event: string) {
  editorCode.value = event;
}

function saveCC() {
  const blob = new Blob([editorCode.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rom.cc';
  a.click();
  URL.revokeObjectURL(url);
}

function programLoad(event: any) {
  //editorCode.value = programs.programs[event.target.value];
}
</script>
