<script lang="ts">
  import IconNavArrowRight from '$lib/icons/icon_nav_arrow_right.svelte';
  import {
    grades,
    isStudentsLoading,
    students,
    studentsPage,
    studentsTotalPages
  } from '$lib/stores/store_dashboard';
  import { studentToManage } from '$lib/stores/store_modal';
  import type { Student } from '$lib/types/database';

  const changePage = (page: number) => {
    if (page >= 1 && page <= $studentsTotalPages) {
      studentsPage.set(page);
    }
  };
  const handleRowClick = (student: Student) => {
    studentToManage.set(student);
  };
  const getPaginationRange = () => {
    const currentPage = $studentsPage;
    const totalPages = $studentsTotalPages;
    const maxButtons = 5;
    const halfRange = Math.floor(maxButtons / 2);

    let start = Math.max(currentPage - halfRange, 1);
    let end = Math.min(start + maxButtons - 1, totalPages);

    if (end - start < maxButtons - 1) {
      start = Math.max(end - maxButtons + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
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
        <tr
          class="border-b border-white/30"
          onclick={() => {
            handleRowClick(student);
          }}
        >
          <td class="px-3 py-2 text-sm">{student.name}</td>
          <td class="px-3 py-2 text-sm">
            {$grades.find((g) => g.id === student.grade_id)?.name ?? ''}
          </td>
        </tr>
      {/each}
    {:else}
      <tr>
        <td colspan="2" class="px-3 py-2 text-center text-sm">
          {#if $isStudentsLoading}
            Cargando...
          {:else}
            No hay datos disponibles
          {/if}
        </td>
      </tr>
    {/if}
  </tbody>
</table>

<footer class="flex justify-center items-center gap-2 mt-4">
  <button
    class="p-1 text-sm [&>svg]:rotate-180 [&>svg]:pointer-events-none disabled:opacity-50"
    disabled={$studentsPage === 1 || $isStudentsLoading}
    onclick={() => changePage($studentsPage - 1)}
  >
    <IconNavArrowRight strokeWidth={3} />
  </button>

  {#each getPaginationRange() as page}
    <button
      class="px-3 py-1 text-sm rounded hover:bg-steel-blue text-white disabled:opacity-50"
      class:bg-steel-blue={$studentsPage === page}
      disabled={$isStudentsLoading}
      onclick={() => changePage(page)}
    >
      {page}
    </button>
  {/each}

  <button
    class="p-1 text-sm [&>svg]:pointer-events-none disabled:opacity-50"
    disabled={$studentsPage === $studentsTotalPages || $isStudentsLoading}
    onclick={() => changePage($studentsPage + 1)}
  >
    <IconNavArrowRight strokeWidth={3} />
  </button>
</footer>
