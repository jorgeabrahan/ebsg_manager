<script lang="ts">
  import CustomButton from '$lib/custom_button.svelte';
  import CustomInput from '$lib/custom_input.svelte';
  import CustomSelect from '$lib/custom_select.svelte';
  import { ServiceGrades } from '$lib/services/service_grades';
  import { ServicePayments } from '$lib/services/service_payments';
  import {
    grades,
    isGradesLoading,
    paymentMethods
  } from '$lib/stores/store_dashboard';
  import {
    isAddingPaymentToStudent,
    studentToAddPayment
  } from '$lib/stores/store_modal';
  import { currentPaymentYear, payments } from '$lib/stores/store_student';
  import { UtilToast } from '$lib/utils/util_toast';
  import WrapperModal from '$lib/wrappers/wrapper_modal.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
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
  });
  const onSubmit = async (
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) => {
    if ($studentToAddPayment == null) return;
    e.preventDefault();
    const form = e.currentTarget;
    const entries = Object.fromEntries(new FormData(form)) as {
      monthPaid: string;
      amountPaid: string;
      paymentMethod: string;
      gradeId: string;
      paymentType: string;
    };
    const monthPaid = Number(entries.monthPaid);
    if (isNaN(monthPaid)) {
      UtilToast.error('Por favor selecciona un mes.');
      return;
    }
    const gradeName = $grades.find(
      (g) => g.id?.toString() === entries.gradeId
    )?.name;
    if (gradeName == null || gradeName?.trim().length === 0) {
      UtilToast.error('Por favor selecciona un grado.');
      return;
    }
    const amount = Number(entries.amountPaid);
    if (
      entries.amountPaid.trim().length === 0 ||
      isNaN(amount) ||
      amount <= 0
    ) {
      UtilToast.error('Por favor ingresa una cantidad a pagar valida.');
      return;
    }
    if (entries.paymentMethod === 'default') {
      UtilToast.error('Por favor selecciona un método de pago.');
      return;
    }

    const month = monthPaid.toString().padStart(2, '0');
    const date = `${$currentPaymentYear}-${month}-01`;
    const isTuitionPayment = entries.paymentType === 'matricula';
    if (isTuitionPayment && monthPaid !== 1) {
      UtilToast.error('La matrícula debe ser pagada el mes de enero.');
      return;
    }
    $isAddingPaymentToStudent = true;
    try {
      if (isTuitionPayment) {
        const { data: alreadyPaid } =
          await ServicePayments.hasStudentAlreadyPaidTuition(
            $currentPaymentYear,
            $studentToAddPayment.id
          );
        if (alreadyPaid) {
          UtilToast.error('Ya se ha pagado la matrícula del año seleccionado.');
          return;
        }
      } else {
        const { data: alreadyPaid } =
          await ServicePayments.hasStudentAlreadyPaidMonth(
            date,
            $studentToAddPayment.id
          );
        if (alreadyPaid) {
          UtilToast.error('Ya se ha pagado el mes seleccionado.');
          return;
        }
      }
      const { isSuccess, error } = await ServicePayments.create({
        month_paid: date,
        amount_paid: amount,
        payment_method: Number(entries.paymentMethod),
        grade_name: gradeName,
        is_tuition_payment: isTuitionPayment,
        student_id: $studentToAddPayment.id
      });
      if (!isSuccess) throw error;
      form.reset();
      $studentToAddPayment = null;
      $payments = null;
    } catch {
      UtilToast.error('Ocurrió un error al crear el estudiante.');
    } finally {
      $isAddingPaymentToStudent = false;
    }
  };
  let gradeIdToPay = $state<string>('');
  let paymentType = $state('cuota');
  $effect(() => {
    gradeIdToPay = $studentToAddPayment?.grade_id?.toString() ?? '';
  });
</script>

<WrapperModal
  isOpen={$studentToAddPayment != null}
  title="Registrar pago"
  onClose={() => {
    studentToAddPayment.set(null);
  }}
  isClosingAllowed={!$isAddingPaymentToStudent}
>
  <form class="mt-4" onsubmit={onSubmit}>
    <div class="max-h-[300px] overflow-y-scroll space-y-4 mb-4">
      <CustomSelect
        label="Mes a pagar"
        id="monthPaid"
        options={[
          {
            value: '1',
            label: 'Enero'
          },
          {
            value: '2',
            label: 'Febrero'
          },
          {
            value: '3',
            label: 'Marzo'
          },
          {
            value: '4',
            label: 'Abril'
          },
          {
            value: '5',
            label: 'Mayo'
          },
          {
            value: '6',
            label: 'Junio'
          },
          {
            value: '7',
            label: 'Julio'
          },
          {
            value: '8',
            label: 'Agosto'
          },
          {
            value: '9',
            label: 'Septiembre'
          },
          {
            value: '10',
            label: 'Octubre'
          },
          {
            value: '11',
            label: 'Noviembre'
          },
          {
            value: '12',
            label: 'Diciembre'
          }
        ]}
        value={(new Date().getMonth() + 1).toString()}
        disabled={$isAddingPaymentToStudent}
        required
      />
      <CustomSelect
        id="gradeId"
        label="Grado"
        options={$grades.map((grade) => ({
          value: grade.id?.toString(),
          label: grade.name
        }))}
        disabled={$isAddingPaymentToStudent || $isGradesLoading}
        value={gradeIdToPay}
        onchange={(e) => {
          if (!e.target || !(e.target instanceof HTMLSelectElement)) return;
          gradeIdToPay = e.target?.value;
        }}
        includeDefaultOption
        required
      />
      <CustomSelect
        label="Tipo de pago"
        id="paymentType"
        options={[
          { value: 'matricula', label: 'matrícula' },
          { value: 'cuota', label: 'cuota' }
        ]}
        disabled={$isAddingPaymentToStudent}
        value={paymentType}
        onchange={(e) => {
          if (!e.target || !(e.target instanceof HTMLSelectElement)) return;
          paymentType = e.target?.value;
        }}
        required
      />
      <CustomInput
        label="Cantidad"
        id="amountPaid"
        type="number"
        disabled={$isAddingPaymentToStudent}
        value={paymentType === 'cuota'
          ? $grades.find((g) => g.id?.toString() === gradeIdToPay)?.installment
          : $grades.find((g) => g.id?.toString() === gradeIdToPay)?.tuition}
        required
      />
      <CustomSelect
        label="Método de pago"
        id="paymentMethod"
        options={$paymentMethods.map((pm) => ({
          value: pm.id?.toString(),
          label: pm.name
        }))}
        disabled={$isAddingPaymentToStudent}
        includeDefaultOption
        required
      />
    </div>
    <CustomButton
      type="submit"
      className="flex justify-center items-center gap-1 w-full bg-steel-blue"
      disabled={$isAddingPaymentToStudent}
    >
      Registrar pago
    </CustomButton>
  </form>
</WrapperModal>
