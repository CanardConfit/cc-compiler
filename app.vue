<template>
    <ControlView @changeCompiler="" @convert="convert()" @exportCirc="exportCirc()" @programLoad="programLoad($event)" @importCC="importCC()" @saveCC="saveCC()" />
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
</template>

<script setup lang="ts">
import {type CCLine, compile_cc} from "~/utils/compiler";
import programs from "~/utils/programs";

const defaultValue = ref("");
const editorCode = ref(defaultValue);
const asm = ref<CCLine[]|null>(null);

function convert() {
  asm.value = compile_cc(editorCode.value.split("\n"), true);
}

function exportCirc() {
  console.log("hello");
}

function importCC() {
  console.log("hello");
}

function saveCC() {
  console.log("hello");
}

function programLoad(event: any) {
  editorCode.value = programs.programs[event.target.value];
}
</script>
