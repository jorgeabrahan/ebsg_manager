import { writable } from 'svelte/store';

export const isStudentModalOpen = writable(false);
export const isStudentBeingCreated = writable(false);

export const isGradeModalOpen = writable(false);
export const isGradeBeingCreated = writable(false);
