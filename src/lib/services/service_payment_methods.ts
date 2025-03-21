import { supabase } from '$lib/supabaseClient';

export class ServicePaymentMethods {
  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('id, name');
      if (error) throw error;
      return {
        isSuccess: true,
        data: data,
        error: error
      };
    } catch (error) {
      return {
        isSuccess: false,
        data: null,
        error: error
      };
    }
  }
}
