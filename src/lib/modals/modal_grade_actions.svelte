<script lang="ts">
  import CustomButton from '$lib/custom_button.svelte';
  import { ServiceGrades } from '$lib/services/service_grades';
  import { grades } from '$lib/stores/store_dashboard';
  import {
    gradeToManage,
    isEditGradeModalOpen,
    isGradeBeingDeleted
  } from '$lib/stores/store_modal';
  import { UtilToast } from '$lib/utils/util_toast';
  import WrapperModal from '$lib/wrappers/wrapper_modal.svelte';

  let hasAtLeastOneStudent = $state(false);
  const onDelete = async (id: number) => {
    if ($isGradeBeingDeleted) return;
    $isGradeBeingDeleted = true;
    try {
      const { isSuccess, error } = await ServiceGrades.remove(id);
      if (!isSuccess) throw error;
      $gradeToManage = null;
      grades.set([]);
    } catch {
      UtilToast.error('Ocurrió un error al eliminar el grado.');
    } finally {
      $isGradeBeingDeleted = false;
    }
  };
  const onEdit = () => {
    isEditGradeModalOpen.set(true);
  };
  $effect(() => {
    if ($gradeToManage == null) return;
    (async () => {
      const { data, error } = await ServiceGrades.hasAtLeastOneStudent(
        $gradeToManage.id
      );
      if (error || data == null) return;
      hasAtLeastOneStudent = data;
    })();
  });
</script>

<WrapperModal
  isOpen={$gradeToManage != null}
  title="Administrar grado"
  onClose={() => {
    gradeToManage.set(null);
  }}
  isClosingAllowed={!$isGradeBeingDeleted}
>
  <p class="text-xs mt-4 mb-3"
    >¿Que acción deseas tomar con el grado {$gradeToManage?.name}?</p
  >
  <div class="mb-3">
    <CustomButton
      className="bg-night-700 border border-white/40"
      disabled={$isGradeBeingDeleted}
      onclick={onEdit}>Editar</CustomButton
    >
    <CustomButton
      className="bg-night-700 border border-white/40"
      disabled={$isGradeBeingDeleted || hasAtLeastOneStudent}
      onclick={() => {
        if ($gradeToManage == null || hasAtLeastOneStudent) return;
        UtilToast.action(
          `¿Seguro que deseas eliminar el grado ${$gradeToManage.name}?`,
          {
            action: {
              label: 'Eliminar',
              onClick: () => {
                if ($gradeToManage == null) return;
                onDelete($gradeToManage.id);
              }
            }
          }
        );
      }}>Eliminar</CustomButton
    >
  </div>
  {#if hasAtLeastOneStudent}
    <p class="text-xs text-white/60"
      >Este grado no puede ser eliminado porque tiene estudiantes asociados.</p
    >
  {/if}
</WrapperModal>
