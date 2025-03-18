import { EMAIL_REGEX, PASSWORD_REQUIREMENTS } from '$lib/constants/validation';

export class UtilValidation {
	static name(name: string) {
		const isValid = name.trim().split(' ').length >= 2;
		return {
			isValid,
			message: isValid ? '' : 'El nombre completo debe tener al menos 2 palabras.'
		};
	}
	static email(email: string) {
		const isValid = EMAIL_REGEX.test(email);
		return {
			isValid,
			message: isValid ? '' : 'El formato del correo electrónico no es válido.'
		};
	}

	static password(password: string) {
		for (const criterion of PASSWORD_REQUIREMENTS) {
			if (!criterion.regex.test(password)) {
				return {
					isValid: false,
					message: criterion.message
				};
			}
		}
		return {
			isValid: true,
			message: ''
		};
	}
}
