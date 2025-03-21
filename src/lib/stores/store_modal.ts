import type { Grade, Student } from '$lib/types/database';
import { writable } from 'svelte/store';

export const isCreateStudentModalOpen = writable(false);
export const isStudentBeingCreated = writable(false);

export const studentToManage = writable<Student | null>(null);
export const isStudentBeingDeleted = writable(false);
export const isEditStudentModalOpen = writable(false);
export const isStudentBeingUpdated = writable(false);

export const isGradeModalOpen = writable(false);
export const isGradeBeingCreated = writable(false);

export const gradeToManage = writable<Grade | null>(null);
export const isGradeBeingDeleted = writable(false);
export const isEditGradeModalOpen = writable(false);
export const isGradeBeingUpdated = writable(false);

export const studentToAddPayment = writable<Student | null>(null);
export const isAddingPaymentToStudent = writable(false);
