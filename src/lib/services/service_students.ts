import { supabase } from '$lib/supabaseClient';
import type { Student } from '$lib/types/database';

export class ServiceStudents {
  static async create(student: Omit<Student, 'id' | 'created_at'>) {
    try {
      const { error } = await supabase.from('students').insert(student);
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

  static async findAll(
    options: {
      pagination?: {
        page?: number;
        limit?: number;
      };
      filters?: {
        name?: string;
        gradeId?: number;
      };
    } = {}
  ) {
    try {
      const pagination = options?.pagination ?? {};
      const filters = options?.filters ?? {};
      const limit = pagination?.limit || 10;
      const page = pagination?.page || 1;
      const offset = (page - 1) * limit;
      let query = supabase
        .from('students')
        .select('id, name, grade_id, created_at');
      if (filters?.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      if (filters?.gradeId) {
        query = query.eq('grade_id', filters.gradeId);
      }
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error } = await query;
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
}
