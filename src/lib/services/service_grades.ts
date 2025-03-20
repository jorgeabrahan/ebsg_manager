import { supabase } from '$lib/supabaseClient';
import type { Grade } from '$lib/types/database';

export class ServiceGrades {
  static async create(grade: Omit<Grade, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('grades')
        .insert(grade)
        .select()
        .maybeSingle();
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

  static async edit(grade: Grade) {
    try {
      const { data, error } = await supabase
        .from('grades')
        .update(grade)
        .eq('id', grade.id)
        .select()
        .maybeSingle();
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

  static async remove(id: number) {
    try {
      const { error } = await supabase.from('grades').delete().eq('id', id);
      if (error) throw error;
      return {
        isSuccess: true,
        data: null,
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

  static async hasAtLeastOneStudent(id: number) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, grade_id')
        .eq('grade_id', id)
        .limit(1);
      if (error) throw error;
      return {
        isSuccess: true,
        data: Array.isArray(data) && data.length > 0,
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

  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('id, name, tuition, installment, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return {
        isSuccess: true,
        data: data,
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
}
