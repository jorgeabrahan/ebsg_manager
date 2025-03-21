import type { Grade, PaymentMethod, Student } from '$lib/types/database';
import { writable } from 'svelte/store';

export const grades = writable<Grade[]>([]);
export const isGradesLoading = writable(false);

export const students = writable<{
  [page: string]: Student[];
}>({});
export const studentsPage = writable(1);
export const studentsGrade = writable<string>('all');
export const studentsLimit = writable(20);
export const studentsTotalPages = writable(0);
export const isStudentsLoading = writable(false);

export const paymentMethods = writable<PaymentMethod[]>([]);
