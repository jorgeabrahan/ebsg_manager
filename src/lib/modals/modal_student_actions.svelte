<script lang="ts">
  import { goto } from '$app/navigation';
  import CustomButton from '$lib/custom_button.svelte';
  import { ServiceStudents } from '$lib/services/service_students';
  import { students, studentsPage } from '$lib/stores/store_dashboard';
  import {
    isEditStudentModalOpen,
    isStudentBeingDeleted,
    studentToManage
  } from '$lib/stores/store_modal';
  import { UtilToast } from '$lib/utils/util_toast';
  import WrapperModal from '$lib/wrappers/wrapper_modal.svelte';

  const onDelete = async (id: number) => {
    if ($isStudentBeingDeleted) return;
    $isStudentBeingDeleted = true;
    try {
      const { isSuccess, error } = await ServiceStudents.remove(id);
      if (!isSuccess) throw error;
      $studentToManage = null;
      students.set({});
      $studentsPage = 1;
    } catch {
      UtilToast.error('Ocurrió un error al eliminar el estudiante.');
    } finally {
      $isStudentBeingDeleted = false;
    }
  };
  const onEdit = () => {
    isEditStudentModalOpen.set(true);
  };
</script>

<WrapperModal
  isOpen={$studentToManage != null}
  title={`Administrar estudiante`}
  onClose={() => {
    studentToManage.set(null);
  }}
  isClosingAllowed={!$isStudentBeingDeleted}
>
  <p class="text-xs mt-4 mb-3"
    >¿Que acción deseas tomar con el/la estudiante {$studentToManage?.name}?</p
  >
  <CustomButton
    className="bg-night-700 border border-white/40"
    disabled={$isStudentBeingDeleted}
    onclick={() => {
      goto(`/dashboard/students/${$studentToManage?.id}`);
    }}>Detalles</CustomButton
  >
  <CustomButton
    className="bg-night-700 border border-white/40"
    disabled={$isStudentBeingDeleted}
    onclick={onEdit}>Editar</CustomButton
  >
  <CustomButton
    className="bg-night-700 border border-white/40"
    disabled={$isStudentBeingDeleted}
    onclick={() => {
      if ($studentToManage == null) return;
      UtilToast.action(
        `¿Seguro que deseas eliminar al estudiante ${$studentToManage.name}?`,
        {
          action: {
            label: 'Eliminar',
            onClick: () => {
              if ($studentToManage == null) return;
              onDelete($studentToManage.id);
            }
          }
        }
      );
    }}>Eliminar</CustomButton
  >
</WrapperModal>
