<script lang="ts">
  import CustomSelect from '$lib/custom_select.svelte';
  import ModalCreateStudent from '$lib/modals/modal_create_student.svelte';
  import { ServiceGrades } from '$lib/services/service_grades';
  import { ServiceStudents } from '$lib/services/service_students';
  import {
    grades,
    isGradesLoading,
    isStudentsLoading,
    students,
    studentsLimit,
    studentsPage,
    studentsTotalPages
  } from '$lib/stores/store_dashboard';
  import WrapperDelimiter from '$lib/wrappers/wrapper_delimiter.svelte';
  import { onMount } from 'svelte';
  import GradesTable from './grades_table.svelte';
  import StudentsTable from './students_table.svelte';
  import {
    isGradeModalOpen,
    isCreateStudentModalOpen
  } from '$lib/stores/store_modal';
  import ModalCreateGrade from '$lib/modals/modal_create_grade.svelte';
  import ModalStudentActions from '$lib/modals/modal_student_actions.svelte';
  import CustomButton from '$lib/custom_button.svelte';
  import ModalEditStudent from '$lib/modals/modal_edit_student.svelte';
  import ModalGradeActions from '$lib/modals/modal_grade_actions.svelte';
  import ModalEditGrade from '$lib/modals/modal_edit_grade.svelte';

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
          const { data, pagination, error } = await ServiceStudents.findAll({
            pagination: {
              page: $studentsPage,
              limit: $studentsLimit
            }
          });
          if (data == null || error) {
            return;
          }
          $students[`page_${$studentsPage}`] = data;
          $studentsTotalPages = pagination.totalPages;
        } finally {
          $isStudentsLoading = false;
        }
      })();
      return;
    }
    if (view === VIEW_KEYS.grades) {
      if ($grades.length > 0) return;
      $isGradesLoading = true;
      (async () => {
        try {
          const { data, error } = await ServiceGrades.findAll();
          if (data == null || error) {
            return;
          }
          $grades = data;
        } finally {
          $isGradesLoading = false;
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
      isCreateStudentModalOpen.set(true);
      return;
    }
    if (view === VIEW_KEYS.grades) {
      isGradeModalOpen.set(true);
    }
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
    <CustomButton
      className="bg-night-700 border border-white/40"
      onclick={handleCreateNew}>Nuevo</CustomButton
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
<ModalStudentActions />
<ModalEditStudent />
<ModalGradeActions />
<ModalEditGrade />
