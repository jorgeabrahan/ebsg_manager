export interface Grade {
  id: number;
  name: string;
  tuition: number;
  installment: number;
  created_at: string;
}

export interface Student {
  id: number;
  name: string;
  grade_id: number;
  created_at: string;
}
