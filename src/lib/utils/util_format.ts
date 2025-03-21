export class UtilFormat {
  static amountToCurrency(amount: number): string {
    return amount.toLocaleString('es-HN', {
      style: 'currency',
      currency: 'HNL'
    });
  }
  static capitalizeWords(input: string): string {
    return input
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  static timestampToLocaleDate(timestamp: string) {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    const formattedDate = new Intl.DateTimeFormat('es-HN', options).format(
      date
    );
    return formattedDate;
  }
  static getInitials(input: string): string {
    const words = input.split(' ').filter((word) => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
}
