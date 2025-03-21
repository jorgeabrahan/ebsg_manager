import { supabase } from '$lib/supabaseClient';
import type { Payment } from '$lib/types/database';

export class ServicePayments {
  static async create(payment: Omit<Payment, 'id' | 'created_at'>) {
    try {
      const { error } = await supabase.from('payments').insert(payment);
      if (error) throw error;
      return {
        isSuccess: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        isSuccess: false,
        data: null,
        error: error
      };
    }
  }
  static async remove(id: number) {
    try {
      const { error } = await supabase.from('payments').delete().eq('id', id);
      if (error) throw error;
      return {
        isSuccess: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        isSuccess: false,
        data: null,
        error: error
      };
    }
  }
  static async yearsWithPayments(studentId: number, year: number) {
    try {
      const { data, error } = await supabase.rpc('get_student_payment_years', {
        s_id: studentId,
        year
      });
      if (error) throw error;
      return {
        isSuccess: true,
        data: data,
        error: null
      };
    } catch (error) {
      return {
        isSuccess: false,
        data: null,
        error: error
      };
    }
  }
  static async hasStudentAlreadyPaidTuition(year: number, studentId: number) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('id, month_paid, student_id', { count: 'exact' })
        .eq('student_id', studentId)
        .eq('is_tuition_payment', true)
        .gte('month_paid', `${year}-01-01`)
        .lt('month_paid', `${year + 1}-01-01`)
        .limit(1);

      if (error) throw error;

      return {
        isSuccess: true,
        data: Array.isArray(data) && data.length > 0,
        error: null
      };
    } catch (error) {
      return {
        isSuccess: false,
        data: null,
        error: error
      };
    }
  }

  static async hasStudentAlreadyPaidMonth(
    monthPaid: string,
    studentId: number
  ) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('id, month_paid, student_id')
        .eq('month_paid', monthPaid)
        .eq('student_id', studentId)
        .limit(1);
      if (error) throw error;
      return {
        isSuccess: true,
        data: Array.isArray(data) && data.length > 0,
        error: error
      };
    } catch {
      return {
        isSuccess: false,
        data: null,
        error: null
      };
    }
  }
  static async findAll(
    options: {
      filters?: {
        studentId?: number;
        year?: number;
      };
    } = {}
  ) {
    const filters = options?.filters ?? {};
    try {
      let query = supabase
        .from('payments')
        .select(
          'id, student_id, month_paid, amount_paid, payment_method, created_at, grade_name, is_tuition_payment'
        );

      if (filters?.studentId) {
        query = query.eq('student_id', filters.studentId);
      }

      if (filters?.year) {
        const startDate = `${filters.year}-01-01`;
        const endDate = `${filters.year + 1}-01-01`;
        query = query.gte('month_paid', startDate).lt('month_paid', endDate);
      }

      query = query.order('month_paid', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return { isSuccess: true, data, error: null };
    } catch (error) {
      return { isSuccess: false, data: null, error };
    }
  }
}
