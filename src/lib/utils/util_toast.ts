import { toast, type ExternalToast } from 'svelte-sonner';

export class UtilToast {
	static success(message: string, data?: ExternalToast) {
		toast.success(message, data);
	}
	static warning(message: string, data?: ExternalToast) {
		toast.warning(message, data);
	}
	static error(message: string, data?: ExternalToast) {
		toast.error(message, data);
	}
}
