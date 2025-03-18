<script lang="ts">
  import CustomButton from '$lib/custom_button.svelte';
  import CustomInput from '$lib/custom_input.svelte';
  import CustomSelect from '$lib/custom_select.svelte';
  import { ServiceStudents } from '$lib/services/service_students';
  import { grades, students, studentsPage } from '$lib/stores/store_dashboard';
  import {
    isStudentBeingCreated,
    isStudentModalOpen
  } from '$lib/stores/store_modal';
  import { UtilToast } from '$lib/utils/util_toast';
  import WrapperModal from '$lib/wrappers/wrapper_modal.svelte';

  async function onSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
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
    $isStudentBeingCreated = true;
    try {
      const { isSuccess, error } = await ServiceStudents.create({
        name: entries.name,
        grade_id: parseInt(entries.gradeId)
      });
      if (!isSuccess) throw error;
      form.reset();
      $isStudentModalOpen = false;
      $studentsPage = 1;
      students.set({});
    } catch {
      UtilToast.error('Ocurrió un error al crear el estudiante.');
    } finally {
      $isStudentBeingCreated = false;
    }
  }
</script>

<WrapperModal
  isOpen={$isStudentModalOpen}
  title="Crear estudiante"
  onClose={() => {
    isStudentModalOpen.update((value) => !value);
  }}
  isClosingAllowed={!$isStudentBeingCreated}
>
  <form class="space-y-4 mt-4" onsubmit={onSubmit}>
    <CustomInput
      label="Nombre"
      id="name"
      type="text"
      disabled={$isStudentBeingCreated}
      required
    />
    <CustomSelect
      id="gradeId"
      label="Grado"
      options={$grades.map((grade) => ({
        value: grade.id?.toString(),
        label: grade.name
      }))}
      disabled={$isStudentBeingCreated}
      includeDefaultOption
      required
    />
    <CustomButton
      type="submit"
      className="flex justify-center items-center gap-1 w-full bg-steel-blue"
      disabled={$isStudentBeingCreated}
    >
      Guardar estudiante
    </CustomButton>
  </form>
</WrapperModal>
