<script lang="ts">
  import CustomButton from '$lib/custom_button.svelte';
  import CustomInput from '$lib/custom_input.svelte';
  import { ServiceGrades } from '$lib/services/service_grades';
  import { grades } from '$lib/stores/store_dashboard';
  import {
    gradeToManage,
    isEditGradeModalOpen,
    isGradeBeingUpdated
  } from '$lib/stores/store_modal';
  import { UtilToast } from '$lib/utils/util_toast';
  import WrapperModal from '$lib/wrappers/wrapper_modal.svelte';

  async function onSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    if ($isGradeBeingUpdated || $gradeToManage == null) return;
    e.preventDefault();
    const form = e.currentTarget;
    const entries = Object.fromEntries(new FormData(form)) as {
      name: string;
      tuition: string;
      installment: string;
    };
    if (entries.name.trim().length === 0) {
      UtilToast.error('Porfavor escribe el nombre del grado.');
      return;
    }
    if (isNaN(parseInt(entries.tuition))) {
      UtilToast.error('La matrícula debe ser un número.');
      return;
    }
    if (isNaN(parseInt(entries.installment))) {
      UtilToast.error('La cuota debe ser un número.');
      return;
    }
    $isGradeBeingUpdated = true;
    try {
      const { isSuccess, data, error } = await ServiceGrades.edit({
        ...$gradeToManage,
        name: entries.name,
        tuition: parseInt(entries.tuition),
        installment: parseInt(entries.installment)
      });
      if (!isSuccess) throw error;
      form.reset();
      $isEditGradeModalOpen = false;
      $gradeToManage = null;
      grades.update((current) =>
        current.map((grade) => (grade.id === data.id ? data : grade))
      );
    } catch {
      UtilToast.error('Ocurrió un error al crear el grado.');
    } finally {
      $isGradeBeingUpdated = false;
    }
  }
</script>

<WrapperModal
  isOpen={$isEditGradeModalOpen}
  title="Editar grado"
  onClose={() => {
    isEditGradeModalOpen.update((value) => !value);
  }}
  isClosingAllowed={!$isGradeBeingUpdated}
>
  <form class="space-y-4 mt-4" onsubmit={onSubmit}>
    <CustomInput
      label="Nombre"
      id="name"
      type="text"
      value={$gradeToManage?.name}
      disabled={$isGradeBeingUpdated}
      required
    />
    <CustomInput
      label="Matrícula"
      id="tuition"
      type="number"
      value={$gradeToManage?.tuition}
      disabled={$isGradeBeingUpdated}
      required
    />
    <CustomInput
      label="Cuota"
      id="installment"
      type="number"
      value={$gradeToManage?.installment}
      disabled={$isGradeBeingUpdated}
      required
    />
    <CustomButton
      type="submit"
      className="flex justify-center items-center gap-1 w-full bg-steel-blue"
      disabled={$isGradeBeingUpdated}
    >
      Guardar grado
    </CustomButton>
  </form>
</WrapperModal>
