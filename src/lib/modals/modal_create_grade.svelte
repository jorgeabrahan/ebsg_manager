<script lang="ts">
  import CustomButton from '$lib/custom_button.svelte';
  import CustomInput from '$lib/custom_input.svelte';
  import { ServiceGrades } from '$lib/services/service_grades';
  import { grades } from '$lib/stores/store_dashboard';
  import {
    isGradeBeingCreated,
    isGradeModalOpen
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
    $isGradeBeingCreated = true;
    try {
      const { isSuccess, data, error } = await ServiceGrades.create({
        name: entries.name,
        tuition: parseInt(entries.tuition),
        installment: parseInt(entries.installment)
      });
      if (!isSuccess) throw error;
      form.reset();
      $isGradeModalOpen = false;
      grades.update((current) => [data, ...current]);
    } catch {
      UtilToast.error('Ocurrió un error al crear el grado.');
    } finally {
      $isGradeBeingCreated = false;
    }
  }
</script>

<WrapperModal
  isOpen={$isGradeModalOpen}
  title="Crear grado"
  onClose={() => {
    isGradeModalOpen.update((value) => !value);
  }}
  isClosingAllowed={!$isGradeBeingCreated}
>
  <form class="space-y-4 mt-4" onsubmit={onSubmit}>
    <CustomInput
      label="Nombre"
      id="name"
      type="text"
      disabled={$isGradeBeingCreated}
      required
    />
    <CustomInput
      label="Matrícula"
      id="tuition"
      type="number"
      disabled={$isGradeBeingCreated}
      required
    />
    <CustomInput
      label="Cuota"
      id="installment"
      type="number"
      disabled={$isGradeBeingCreated}
      required
    />
    <CustomButton
      type="submit"
      className="flex justify-center items-center gap-1 w-full bg-steel-blue"
      disabled={$isGradeBeingCreated}
    >
      Guardar grado
    </CustomButton>
  </form>
</WrapperModal>
