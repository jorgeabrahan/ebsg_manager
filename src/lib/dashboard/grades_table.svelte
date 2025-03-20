<script lang="ts">
  import { grades } from '$lib/stores/store_dashboard';
  import { gradeToManage } from '$lib/stores/store_modal';
  import type { Grade } from '$lib/types/database';

  const handleRowClick = (grade: Grade) => {
    gradeToManage.set(grade);
  };
</script>

<table class="w-full border-collapse">
  <thead>
    <tr class="bg-steel-blue text-white">
      <th class="px-3 py-2 text-left text-sm font-semibold">Nombre</th>
      <th class="px-3 py-2 text-left text-sm font-semibold">Matricula</th>
      <th class="px-3 py-2 text-left text-sm font-semibold">Cuota</th>
    </tr>
  </thead>
  <tbody>
    {#if $grades != null}
      {#each $grades as grade}
        <tr
          class="border-b border-white/30"
          onclick={() => handleRowClick(grade)}
        >
          <td class="px-3 py-2 text-sm">{grade.name}</td>
          <td class="px-3 py-2 text-sm">{grade.tuition}</td>
          <td class="px-3 py-2 text-sm">{grade.installment}</td>
        </tr>
      {/each}
    {:else}
      <tr>
        <td colspan="3" class="px-3 py-2 text-center text-sm"
          >No hay datos disponibles</td
        >
      </tr>
    {/if}
  </tbody>
</table>
