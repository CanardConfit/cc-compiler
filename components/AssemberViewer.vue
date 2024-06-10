<template>
  <div class="row">
    <div class="col-12">
      <div class="card bg-light mb-3">
        <div class="card-header">
          <button
              class="btn p-0"
              type="button"
              data-toggle="collapse"
              data-target="#collapseMemoryCard"
              aria-expanded="true"
              aria-controls="collapseMemoryCard"
          >
            Memory
          </button>
        </div>
        <div id="collapseMemoryCard" class="collapse show">
          <div class="card-body overflow-auto justify-content-center align-items-center">
            <table v-for="(item, index) in asm" class="table w-100">
              <thead class="thead-light">
              <tr>
                <th class="text-center">Address</th>
                <th class="text-center">Hex</th>
                <th class="text-center">Assembler</th>
                <th style="width: 25%;">Description</th>
                <th class="text-center" v-for="t in item.fields">{{ t.key }}</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="text-center"><span class="badge badge-dark">{{ index }}</span></td>
                <td class="text-center"><pre>0x{{ item.asm.toString(16).toUpperCase() }}</pre></td>
                <td class="text-center"><code>{{ item.line }}</code></td>
                <td>{{ getInstructionInfo(item.type)?.info }}</td>
                <td class="text-center" v-for="t in item.fields">{{ t.value }} ({{ parseInt(t.value.length >= 8 && t.value[0] === "1" ? t.value.padStart(32, "1") : t.value.padStart(32, "0"), 2) >> 0 }})</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card bg-light mb-3">
        <div class="card-header">
          <button
              class="btn p-0"
              type="button"
              data-toggle="collapse"
              data-target="#collapseMachineCodeCard"
              aria-expanded="true"
              aria-controls="collapseMachineCodeCard"
          >
            Machine Code
          </button>
        </div>
        <div id="collapseMachineCodeCard" class="collapse show">
          <div class="card-body overflow-auto justify-content-center align-items-center">
            <pre class="text-center">{{ machineCode }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {type CCLine, getInstructionInfo} from "~/utils/objects";

const props = defineProps(["asm"]);
const machineCode = computed(() => props.asm?.map((el: CCLine) => `0x${el.asm.toString(16).toUpperCase()}`).join("\n"));
</script>

<style scoped>

</style>
