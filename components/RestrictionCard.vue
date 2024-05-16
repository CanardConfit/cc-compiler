<template>
  <div class="row">
    <div class="col-12">
      <div class="card bg-light mb-3">
        <div class="card-header">
          <button
              class="btn p-0"
              type="button"
              data-toggle="collapse"
              data-target="#collapseRestrictionCard"
              aria-expanded="true"
              aria-controls="collapseRestrictionCard"
          >
            Restrictions
          </button>
        </div>
        <div id="collapseRestrictionCard" class="collapse show">
          <div class="card-body overflow-auto justify-content-center align-items-center">
            <table class="table">
              <tbody>
                <tr>
                  <th>Compiler Version</th>
                  <td class="text-center">{{ options.compilerVersion }}</td>
                </tr>
                <tr>
                  <th>Interruptions Routine</th>
                  <td class="text-center">{{ options.interruptEnable ? "Enabled" : "Disabled" }} ({{ options.interruptPadding == 0 ? "no padding" : options.interruptPadding }})</td>
                </tr>
                <tr>
                  <th>Compiler Information</th>
                  <td class="text-center">{{ getCompilerInfo(options.compilerVersion)?.info }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getCompilerInfo} from "~/utils/objects";

defineProps(["options"]);
</script>

<style scoped>

</style>
