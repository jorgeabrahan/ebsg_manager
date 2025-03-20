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
  static async edit(student: Student) {
    try {
      const { error } = await supabase
        .from('students')
        .update(student)
        .eq('id', student.id);
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
  static async remove(id: number) {
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
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
    const pagination = options?.pagination ?? {};
    const filters = options?.filters ?? {};
    const limit = pagination?.limit || 10;
    const page = pagination?.page || 1;
    const offset = (page - 1) * limit;
    try {
      let query = supabase
        .from('students')
        .select('id, name, grade_id, created_at', { count: 'exact' });

      if (filters?.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      if (filters?.gradeId) {
        query = query.eq('grade_id', filters.gradeId);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      const totalPages = Math.ceil((count || 0) / limit);
      return {
        isSuccess: true,
        data: data,
        pagination: {
          totalItems: count || 0,
          totalPages,
          currentPage: page,
          limit
        },
        error: null
      };
    } catch (error) {
      return {
        isSuccess: false,
        data: null,
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          limit: limit
        },
        error: error
      };
    }
  }
}
