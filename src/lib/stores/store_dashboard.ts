import type { Grade, Student } from '$lib/types/database';
import { writable } from 'svelte/store';

export const grades = writable<Grade[]>([]);
export const students = writable<{
  [page: string]: Student[];
}>({});
export const studentsPage = writable(1);
export const studentsLimit = writable(10);
export const isStudentsLoading = writable(false);
