export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_REQUIREMENTS = [
	{
		regex: /.{8,}/,
		message: 'La contraseña debe tener al menos 8 caracteres'
	},
	{
		regex: /[A-Z]/,
		message: 'La contraseña debe contener al menos una mayúscula'
	},
	{
		regex: /[a-z]/,
		message: 'La contraseña debe contener al menos una minúscula'
	},
	{
		regex: /[0-9]/,
		message: 'La contraseña debe contener al menos un número'
	},
	{
		regex: /[!@#$%^&*(),.?":{}|<>]/,
		message: 'La contraseña debe contener al menos un caracter especial (!@#$%^&*(),.?":{}|<>)'
	}
];
