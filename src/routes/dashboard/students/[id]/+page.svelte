<script lang="ts">
  import { goto } from '$app/navigation';
  import CustomButton from '$lib/custom_button.svelte';
  import CustomSelect from '$lib/custom_select.svelte';
  import IconNavArrowRight from '$lib/icons/icon_nav_arrow_right.svelte';
  import IconTrash from '$lib/icons/icon_trash.svelte';
  import ModalInvoice from '$lib/modals/modal_invoice.svelte';
  import ModalRegisterPayment from '$lib/modals/modal_register_payment.svelte';
  import { ServicePaymentMethods } from '$lib/services/service_payment_methods.js';
  import { ServicePayments } from '$lib/services/service_payments.js';
  import { ServiceStudents } from '$lib/services/service_students.js';
  import { paymentMethods } from '$lib/stores/store_dashboard.js';
  import { studentToAddPayment } from '$lib/stores/store_modal.js';
  import {
    currentPaymentYear,
    invoice,
    isPaymentsLoading,
    payments
  } from '$lib/stores/store_student.js';
  import type { Payment, Student } from '$lib/types/database.js';
  import { UtilFormat } from '$lib/utils/util_format.js';
  import { UtilToast } from '$lib/utils/util_toast.js';
  import WrapperDelimiter from '$lib/wrappers/wrapper_delimiter.svelte';
  import { onMount } from 'svelte';

  let { data } = $props();
  let student = $state<Student | null>(null);
  let years = $state<number[]>([]);
  let selectedPayments = $state<Payment[]>([]);
  onMount(() => {
    (async () => {
      const { isSuccess, data: s } = await ServiceStudents.find(
        Number(data.id)
      );
      if (!isSuccess) {
        goto('/dashboard');
        return;
      }
      student = s;
    })();
  });
  onMount(() => {
    (async () => {
      const { isSuccess, data: y } = await ServicePayments.yearsWithPayments(
        Number(data.id),
        $currentPaymentYear
      );
      if (!isSuccess) return;
      const currentYear = new Date().getFullYear();
      if (y == null) {
        years = [currentYear];
        return;
      }
      if (
        y != null &&
        Array.isArray(y) &&
        y.find((ye) => ye?.payment_year === currentYear) == null
      ) {
        years = [
          ...(y?.map((yr: { payment_year: number }) => yr?.payment_year) ?? []),
          currentYear
        ];
        return;
      }
      years = y?.map((yr: { payment_year: number }) => yr?.payment_year) ?? [];
    })();
  });
  $effect(() => {
    if (student == null || $isPaymentsLoading || $payments != null) return;
    $isPaymentsLoading = true;
    (async () => {
      try {
        const { data, error } = await ServicePayments.findAll({
          filters: {
            studentId: student.id,
            year: $currentPaymentYear
          }
        });
        if (error || data == null) {
          return;
        }
        $payments = data;
      } finally {
        $isPaymentsLoading = false;
      }
    })();
  });
  $effect(() => {
    if ($paymentMethods.length > 0) return;
    (async () => {
      const { data, error } = await ServicePaymentMethods.findAll();
      if (error || data == null) return;
      $paymentMethods = data;
    })();
  });
  const onPaymentSelectToggle = (payment: Payment, isSelected: boolean) => {
    if (isSelected) {
      selectedPayments.push(payment);
      return;
    }
    selectedPayments = selectedPayments.filter((p) => p.id !== payment.id);
  };
  const onGenerateInvoice = () => {
    invoice.set({
      student,
      payments: selectedPayments
    });
  };
  const onDeletePayment = async (id: number) => {
    if ($isPaymentsLoading) return;
    $isPaymentsLoading = true;
    try {
      const { isSuccess, error } = await ServicePayments.remove(id);
      if (!isSuccess) throw error;
      $payments = null;
      selectedPayments = [];
    } catch {
      UtilToast.error('Ocurrió un error al eliminar el pago.');
    } finally {
      $isPaymentsLoading = false;
    }
  };
</script>

<WrapperDelimiter>
  {#if student == null}
    <p>Cargando...</p>
  {:else}
    <header class="flex items-stretch gap-2 mt-10 mb-4">
      <a
        href="/dashboard"
        class="flex items-center justify-center w-max rounded-lg p-1 bg-night-700 border border-white/40"
      >
        <IconNavArrowRight className="rotate-180 pointer-events-none" />
      </a>
      <CustomButton
        className="bg-night-700 border border-white/40"
        onclick={() => studentToAddPayment.set(student)}
        >Registrar pago</CustomButton
      >
      <CustomButton
        className="bg-night-700 border border-white/40"
        disabled={selectedPayments.length === 0}
        onclick={onGenerateInvoice}>Generar factura</CustomButton
      >
    </header>
    <h2 class="text-xl mb-4"
      >Historial de pagos de <strong>{student.name}</strong></h2
    >
    <CustomSelect
      className="w-[100px] ml-auto mb-3"
      id="currentYear"
      label="Año"
      value={$currentPaymentYear.toString()}
      onchange={(e) => {
        if (!e.target || !(e.target instanceof HTMLSelectElement)) return;
        $currentPaymentYear = Number(e.target.value);
      }}
      options={years?.map((y) => ({
        value: y.toString(),
        label: y.toString()
      }))}
      isCompact
    />
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-steel-blue text-white">
            <th class="px-3 py-2 text-left text-sm font-semibold text-nowrap"
              >Acciones</th
            >
            <th class="px-3 py-2 text-left text-sm font-semibold text-nowrap"
              >Mes pagado</th
            >
            <th class="px-3 py-2 text-left text-sm font-semibold">Cantidad</th>
            <th class="px-3 py-2 text-left text-sm font-semibold text-nowrap"
              >Método de pago</th
            >
            <th class="px-3 py-2 text-left text-sm font-semibold text-nowrap"
              >Grado pagado</th
            >
            <th class="px-3 py-2 text-left text-sm font-semibold text-nowrap"
              >Tipo de pago</th
            >
            <th class="px-3 py-2 text-left text-sm font-semibold text-nowrap"
              >Fecha de pago</th
            >
          </tr>
        </thead>
        <tbody>
          {#if $payments != null && $payments.length > 0}
            {#each $payments as payment}
              <tr class="border-b border-white/30">
                <td class="px-3 py-2">
                  <div class="text-sm flex items-center gap-2">
                    <input
                      class="w-[18px] h-[18px] cursor-pointer"
                      type="checkbox"
                      id={`paymentSelect-${payment.id}`}
                      name={`paymentSelect-${payment.id}`}
                      onchange={(e) => {
                        if (
                          !e.target ||
                          !(e.target instanceof HTMLInputElement)
                        )
                          return;
                        onPaymentSelectToggle(payment, e.target.checked);
                      }}
                      disabled={$isPaymentsLoading}
                    />
                    <button
                      class="flex items-center justify-center w-max rounded-lg p-1 bg-night-700 border border-white/40"
                      onclick={() => {
                        UtilToast.action(
                          `¿Seguro que deseas eliminar el pago del ${payment.month_paid?.split('-').slice(0, 2).join(' - ')}?`,
                          {
                            action: {
                              label: 'Eliminar',
                              onClick: () => {
                                onDeletePayment(payment.id);
                              }
                            }
                          }
                        );
                      }}
                      disabled={$isPaymentsLoading}
                    >
                      <IconTrash className="pointer-events-none" size={12} />
                    </button>
                  </div>
                </td>
                <td class="px-3 py-2 text-sm"
                  >{payment.month_paid?.split('-').slice(0, 2).join(' - ')}</td
                >
                <td class="px-3 py-2 text-sm font-mono"
                  >{UtilFormat.amountToCurrency(payment.amount_paid)}</td
                >
                <td class="px-3 py-2 text-sm"
                  >{$paymentMethods.find(
                    (pm) => pm.id === payment.payment_method
                  )?.name ?? payment.payment_method}</td
                >
                <td class="px-3 py-2 text-sm">{payment.grade_name}</td>
                <td class="px-3 py-2 text-sm">
                  {#if payment.is_tuition_payment}
                    matrícula
                  {:else}
                    cuota
                  {/if}
                </td>
                <td class="px-3 py-2 text-sm"
                  >{UtilFormat.timestampToLocaleDate(payment.created_at)}</td
                >
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="7" class="px-3 py-2 text-center text-sm">
                {#if $isPaymentsLoading}
                  Cargando...
                {:else}
                  No hay datos disponibles
                {/if}
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</WrapperDelimiter>

<ModalRegisterPayment />
<ModalInvoice />
