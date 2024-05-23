<template>
  <ControlView @options="showModal = true" @convert="convert()" @exportCirc="exportCirc()" @importCC="importCC($event)" @saveCC="saveCC()" />
  <main role="main" class="container-fluid">
    <div class="row">
      <div class="col-xl-6 col-lg-7 col-md-12">
        <CodeEditor :model-value="defaultValue" @change="e => (editorCode = e)" />
      </div>
      <div class="col-xl-6 col-lg-7 col-md-12">
        <RestrictionCard :options="currentOptions" />
        <AssemberViewer :asm="asm" />
      </div>
    </div>
  </main>
  <SettingsModal :show="showModal" :options="currentOptions" @update:show="showModal = $event" @update:options="options($event)" />
</template>

<script setup lang="ts">
import {CCLine, type CCOptions, CompilerVersion} from "~/utils/objects";

const defaultValue = ref("");
const editorCode = ref(defaultValue);
const asm = ref<CCLine[]|null>(null);
const showModal = ref(false);

const currentOptions = ref<CCOptions>({
  compilerVersion: CompilerVersion.V1,
  interruptEnable: false,
  interruptPadding: 0,
  loadProgram: -1} as CCOptions);

let xmlTemplate: string = "";

onMounted(() => {
  loadXMLTemplate();
});

function options(opt: CCOptions) {
  console.log(opt);
  if (opt.loadProgram != -1) {
    editorCode.value = programs[opt.loadProgram].program;
    opt.loadProgram = -1;
  }

  currentOptions.value = opt;
}

function convert() {

  switch (currentOptions.value.compilerVersion) {
    case CompilerVersion.V05:
      asm.value = v05_compile_cc(editorCode.value.split("\n"), false);
      break;
    case CompilerVersion.V1:
      asm.value = v1_compile_cc(editorCode.value.split("\n"), true);
      break;
  }
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
</script>
