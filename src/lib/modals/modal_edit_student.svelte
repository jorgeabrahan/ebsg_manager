<script lang="ts">
  import CustomButton from '$lib/custom_button.svelte';
  import CustomInput from '$lib/custom_input.svelte';
  import CustomSelect from '$lib/custom_select.svelte';
  import { ServiceStudents } from '$lib/services/service_students';
  import { grades, students, studentsPage } from '$lib/stores/store_dashboard';
  import {
    isEditStudentModalOpen,
    isStudentBeingUpdated,
    studentToManage
  } from '$lib/stores/store_modal';
  import { UtilToast } from '$lib/utils/util_toast';
  import WrapperModal from '$lib/wrappers/wrapper_modal.svelte';

  async function onSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    if ($isStudentBeingUpdated || $studentToManage == null) return;
    e.preventDefault();
    const form = e.currentTarget;
    const entries = Object.fromEntries(new FormData(form)) as {
      name: string;
      gradeId: string;
    };
    if (entries.name.trim().length === 0) {
      UtilToast.error('Porfavor escribe el nombre del estudiante.');
      return;
    }
    if (entries.gradeId === 'default') {
      UtilToast.error('Selecciona un grado.');
      return;
    }
    $isStudentBeingUpdated = true;
    try {
      const { isSuccess, error } = await ServiceStudents.edit({
        ...$studentToManage,
        name: entries.name,
        grade_id: parseInt(entries.gradeId)
      });
      if (!isSuccess) throw error;
      form.reset();
      $isEditStudentModalOpen = false;
      $studentToManage = null;
      students.set({});
      $studentsPage = 1;
    } catch {
      UtilToast.error('Ocurrió un error al crear el estudiante.');
    } finally {
      $isStudentBeingUpdated = false;
    }
  }
</script>

<WrapperModal
  isOpen={$isEditStudentModalOpen}
  title="Editar estudiante"
  onClose={() => {
    isEditStudentModalOpen.update((value) => !value);
  }}
  onToggle={(isOpen) => {
    if (
      (!$isEditStudentModalOpen && isOpen) ||
      ($isEditStudentModalOpen && !isOpen)
    ) {
      isEditStudentModalOpen.set(isOpen);
    }
  }}
  isClosingAllowed={!$isStudentBeingUpdated}
>
  <form class="space-y-4 mt-4" onsubmit={onSubmit}>
    <CustomInput
      label="Nombre"
      id="name"
      type="text"
      value={$studentToManage?.name}
      disabled={$isStudentBeingUpdated}
      required
    />
    <CustomSelect
      id="gradeId"
      label="Grado"
      options={$grades.map((grade) => ({
        value: grade.id?.toString(),
        label: grade.name
      }))}
      value={$studentToManage?.grade_id?.toString()}
      disabled={$isStudentBeingUpdated}
      includeDefaultOption
      required
    />
    <CustomButton
      type="submit"
      className="flex justify-center items-center gap-1 w-full bg-steel-blue"
      disabled={$isStudentBeingUpdated}
    >
      Guardar estudiante
    </CustomButton>
  </form>
</WrapperModal>
