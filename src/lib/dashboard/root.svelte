<script lang="ts">
  import CustomSelect from '$lib/custom_select.svelte';
  import ModalCreateStudent from '$lib/modals/modal_create_student.svelte';
  import { ServiceGrades } from '$lib/services/service_grades';
  import { ServiceStudents } from '$lib/services/service_students';
  import {
    grades,
    isStudentsLoading,
    students,
    studentsLimit,
    studentsPage
  } from '$lib/stores/store_dashboard';
  import WrapperDelimiter from '$lib/wrappers/wrapper_delimiter.svelte';
  import { onMount } from 'svelte';
  import GradesTable from './grades_table.svelte';
  import StudentsTable from './students_table.svelte';
  import {
    isGradeModalOpen,
    isStudentModalOpen
  } from '$lib/stores/store_modal';
  import ModalCreateGrade from '$lib/modals/modal_create_grade.svelte';

  const VIEW_KEYS = {
    students: 'students',
    grades: 'grades'
  };
  const VIEWS = {
    students: 'Estudiantes',
    grades: 'Grados'
  };
  let view = $state(VIEW_KEYS.students);
  $effect(() => {
    if (view === VIEW_KEYS.students) {
      if ($students[`page_${$studentsPage}`] != null) {
        return;
      }
      $isStudentsLoading = true;
      (async () => {
        try {
          const { data, error } = await ServiceStudents.findAll({
            pagination: {
              page: $studentsPage,
              limit: $studentsLimit
            }
          });
          if (data == null || error) {
            return;
          }
          $students[`page_${$studentsPage}`] = data;
        } finally {
          $isStudentsLoading = true;
        }
      })();
      return;
    }
  });
  // grades should be available immediately after the page is loaded
  onMount(async () => {
    const { data, error } = await ServiceGrades.findAll();
    if (data == null || error) {
      return;
    }
    $grades = data;
  });

  function handleCreateNew() {
    if (view === VIEW_KEYS.students) {
      isStudentModalOpen.set(true);
      return;
    }
    isGradeModalOpen.set(true);
  }
</script>

<WrapperDelimiter className="my-10">
  <CustomSelect
    className="w-[180px] mb-6"
    id="views"
    label="Vista"
    value={view}
    onchange={(e) => {
      if (!e.target || !(e.target instanceof HTMLSelectElement)) return;
      view = e.target.value;
    }}
    options={Object.entries(VIEWS).map(([value, label]) => ({
      value,
      label
    }))}
    isCompact
  />
  <div class="flex items-stretch justify-end gap-3 mb-2">
    <!-- <button
      class="bg-night-700 block px-4 py-2 text-sm rounded-sm border border-white/40 focus:border-white/80 transition-colors duration-300"
      >Filtrar</button
    > -->
    <button
      class="bg-night-700 block px-4 py-2 text-sm rounded-sm border border-white/40 focus:border-white/80 transition-colors duration-300"
      onclick={handleCreateNew}>Nuevo</button
    >
  </div>
  {#if view === VIEW_KEYS.students}
    <StudentsTable />
  {/if}
  {#if view === VIEW_KEYS.grades}
    <GradesTable />
  {/if}
</WrapperDelimiter>

<ModalCreateStudent />
<ModalCreateGrade />
