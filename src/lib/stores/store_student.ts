import type { Payment, Student } from '$lib/types/database';
import { writable } from 'svelte/store';

export const payments = writable<Payment[] | null>(null);
export const isPaymentsLoading = writable(false);
export const currentPaymentYear = writable(new Date().getFullYear());

export const invoice = writable<{
  student: Student | null;
  payments: Payment[];
}>({
  student: null,
  payments: []
});
