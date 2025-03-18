<script>
  import { grades, students, studentsPage } from '$lib/stores/store_dashboard';
</script>

<table class="w-full border-collapse">
  <thead>
    <tr class="bg-steel-blue text-white">
      <th class="px-3 py-2 text-left text-sm font-semibold">Nombre</th>
      <th class="px-3 py-2 text-left text-sm font-semibold">Grado</th>
    </tr>
  </thead>
  <tbody>
    {#if $students[`page_${$studentsPage}`] != null}
      {#each $students[`page_${$studentsPage}`] as student}
        <tr class="border-b border-white/30">
          <td class="px-3 py-2 text-sm">{student.name}</td>
          <td class="px-3 py-2 text-sm"
            >{$grades.find((g) => g.id === student.grade_id)?.name ?? ''}</td
          >
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
