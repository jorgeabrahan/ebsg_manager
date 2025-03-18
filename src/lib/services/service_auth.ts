import { supabase } from '$lib/supabaseClient';
import { UtilToast } from '$lib/utils/util_toast';
import type { AuthError, User } from '@supabase/supabase-js';

export class ServiceAuth {
	static async getUser(): Promise<{
		isSuccess: boolean;
		data: User | null;
		error: AuthError | null;
	}> {
		try {
			const {
				data: { user },
				error
			} = await supabase.auth.getUser();
			if (error || user == null) throw error;
			return {
				isSuccess: true,
				data: user,
				error: error
			};
		} catch (error) {
			const authError = error as AuthError;
			return {
				isSuccess: false,
				data: null,
				error: authError
			};
		}
	}
	static async signIn(user: { email: string; password: string }): Promise<{
		isSuccess: boolean;
		data: User | null;
		error: AuthError | null;
	}> {
		try {
			const { data, error } = await supabase.auth.signInWithPassword(user);
			if (error) throw error;
			return {
				isSuccess: true,
				data: data.user,
				error: null
			};
		} catch (error) {
			const authError = error as AuthError;
			UtilToast.error(
				typeof authError?.message === 'string'
					? authError?.message
					: 'Ocurrió un error al iniciar sesión.'
			);
			return {
				isSuccess: false,
				data: null,
				error: authError
			};
		}
	}
	static async signUp(user: {
		email: string;
		password: string;
		displayName: string;
	}): Promise<{ isSuccess: boolean; data: User | null; error: AuthError | null }> {
		try {
			const { data, error } = await supabase.auth.signUp({
				email: user.email,
				password: user.password,
				options: {
					data: {
						display_name: user.displayName
					}
				}
			});
			if (error) throw error;
			return {
				isSuccess: true,
				data: data.user,
				error: null
			};
		} catch (error) {
			const authError = error as AuthError;
			UtilToast.error(
				typeof authError?.message === 'string'
					? authError?.message
					: 'Ocurrió un error al registrarte.'
			);
			return {
				isSuccess: false,
				data: null,
				error: authError
			};
		}
	}
	static async signOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			return {
				isSuccess: true,
				data: null,
				error: null
			};
		} catch (error) {
			const authError = error as AuthError;
			UtilToast.error(
				typeof authError?.message === 'string'
					? authError?.message
					: 'Ocurrió un error al cerrar sesión.'
			);
			return {
				isSuccess: false,
				data: null,
				error: authError
			};
		}
	}
}
