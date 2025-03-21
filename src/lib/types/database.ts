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

export interface PaymentMethod {
  id: number;
  name: string;
}

export interface Payment {
  id: number;
  student_id: number;
  month_paid: string;
  amount_paid: number;
  payment_method: number;
  created_at: string;
  grade_name: string;
  is_tuition_payment: boolean;
}
