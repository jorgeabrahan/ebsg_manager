<script lang="ts">
  import { browser } from '$app/environment';
  import CustomButton from '$lib/custom_button.svelte';
  import { grades, paymentMethods } from '$lib/stores/store_dashboard';
  import { invoice } from '$lib/stores/store_student';
  import { UtilFormat } from '$lib/utils/util_format';
  import WrapperModal from '$lib/wrappers/wrapper_modal.svelte';
  import jsPDF from 'jspdf';

  const downloadInvoicePDF = async () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Eden Billingual School Garden', 10, 10);
      doc.setFontSize(12);
      doc.text('RTN: 050119011352909', 10, 20);
      doc.text(
        'Dirección: Colonia aurora 17 avenida entre 6 y 7 calle, Edificio 673',
        10,
        30
      );
      doc.setFontSize(14);
      doc.text('Datos del Estudiante', 10, 50);
      doc.setFontSize(12);
      doc.text(`Nombre: ${$invoice.student?.name}`, 10, 60);
      doc.text(
        `Grado: ${$grades.find((g) => g.id === $invoice.student?.grade_id)?.name}`,
        10,
        70
      );

      doc.setFontSize(14);
      doc.text('Datos de Pago', 10, 90);
      doc.setFontSize(12);

      let y = 100;
      $invoice.payments.forEach((payment) => {
        doc.text(
          `Mes pagado: ${payment.month_paid?.split('-').slice(0, 2).join(' - ')}`,
          10,
          y
        );
        doc.text(
          `Cantidad: ${UtilFormat.amountToCurrency(payment.amount_paid)}`,
          10,
          y + 10
        );
        doc.text(
          `Método: ${$paymentMethods.find((pm) => pm.id === payment.payment_method)?.name ?? payment.payment_method}`,
          10,
          y + 20
        );
        doc.text(`Grado pagado: ${payment.grade_name}`, 10, y + 30);
        doc.text(
          `Tipo: ${payment.is_tuition_payment ? 'Matrícula' : 'Cuota'}`,
          10,
          y + 40
        );
        doc.text(
          `Fecha: ${UtilFormat.timestampToLocaleDate(payment.created_at)}`,
          10,
          y + 50
        );
        y += 70;
      });

      doc.save(`factura_${$invoice.student?.name}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };
</script>

<WrapperModal
  isOpen={$invoice.student != null}
  onClose={() => {
    invoice.set({
      student: null,
      payments: []
    });
  }}
>
  <div
    id="invoice-content"
    class="max-h-[calc(100vh-160px)] overflow-y-auto my-4"
  >
    <img src="/ebsg_logo.png" alt="Logo de EBSG" class="mb-4 w-28 mx-auto" />
    <h2 class="font-bold text-2xl mt-3">Eden Billingual School Garden</h2>
    <div class="space-y-2 mt-2 mb-6">
      <p class="flex flex-col">
        <span class="text-sm font-medium text-[#ffffffB2]">RTN:</span>
        <span class="text-xs text-[#ffffff99]">050119011352909</span>
      </p>
      <p class="flex flex-col">
        <span class="text-sm font-medium text-[#ffffffB2]">Dirección:</span>
        <span class="text-xs text-[#ffffff99]"
          >Colonia aurora 17 avenida entre 6 y 7 calle, Edificio 673</span
        >
      </p>
    </div>

    {#if $invoice.student != null}
      <section class="mb-6">
        <h4 class="text-lg font-semibold mb-1">Datos del estudiante</h4>
        <div class="grid grid-cols-2 gap-2">
          <p class="flex flex-col">
            <span class="text-sm font-medium text-[#ffffffB2]">Nombre:</span>
            <span class="text-xs text-[#ffffff99]">{$invoice.student.name}</span
            >
          </p>
          <p class="flex flex-col">
            <span class="text-sm font-medium text-[#ffffffB2]">Grado:</span>
            <span class="text-xs text-[#ffffff99]"
              >{$grades.find((g) => g.id === $invoice.student?.grade_id)
                ?.name}</span
            >
          </p>
        </div>
      </section>
    {/if}
    <section>
      <h4 class="text-lg font-semibold mb-1">Datos de pago</h4>
      {#each $invoice.payments as payment}
        <div class="mb-4">
          <p class="flex justify-between items-center">
            <span class="text-xs font-medium text-[#ffffffB2]">Mes pagado:</span
            >
            <span class="text-xs text-[#ffffff99]"
              >{payment.month_paid?.split('-').slice(0, 2).join(' - ')}</span
            >
          </p>
          <p class="flex justify-between items-center">
            <span class="text-xs font-medium text-[#ffffffB2]">Cantidad:</span>
            <span class="text-xs text-[#ffffff99] font-mono"
              >{UtilFormat.amountToCurrency(payment.amount_paid)}</span
            >
          </p>
          <p class="flex justify-between items-center"
            ><span class="text-xs font-medium text-[#ffffffB2]"
              >Método de pago:</span
            >
            <span class="text-xs text-[#ffffff99]"
              >{$paymentMethods.find((pm) => pm.id === payment.payment_method)
                ?.name ?? payment.payment_method}</span
            >
          </p>
          <p class="flex justify-between items-center">
            <span class="text-xs font-medium text-[#ffffffB2]"
              >Grado pagado:</span
            >
            <span class="text-xs text-[#ffffff99]">{payment.grade_name}</span>
          </p>
          <p class="flex justify-between items-center">
            <span class="text-xs font-medium text-[#ffffffB2]"
              >Tipo de pago:</span
            >
            <span class="text-xs text-[#ffffff99]">
              {#if payment.is_tuition_payment}
                matrícula
              {:else}
                cuota
              {/if}
            </span>
          </p>
          <p class="flex justify-between items-center">
            <span class="text-xs font-medium text-[#ffffffB2]"
              >Fecha de pago:</span
            >
            <span class="text-xs text-[#ffffff99]"
              >{UtilFormat.timestampToLocaleDate(payment.created_at)}</span
            >
          </p>
        </div>
      {/each}
    </section>
  </div>
  <CustomButton
    type="submit"
    className="flex justify-center items-center gap-1 w-full bg-steel-blue"
    onclick={downloadInvoicePDF}
  >
    Descargar factura
  </CustomButton>
</WrapperModal>
