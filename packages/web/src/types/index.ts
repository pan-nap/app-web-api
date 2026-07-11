export interface Student {
  id: string;
  name: string;
  gender: string;
  school: string;
  grade: string;
  className: string;
  idCard: string;
  phone: string;
  status: number;
  hasOrder: boolean;
}

export interface BatchForm {
  grade: string;
  className: string;
}

export interface Order {
  id?: string;
  orderDate: string;
  orderNo: string;
  school: string;
  grade: number;
  className: string;
  studentName: string;
  idCard: string;
  parentPhone: string;
  packageName: string;
  packageAmount: number;
  paymentStatus: string;
  paymentTime: string;
  orderStatus: string;
  creator: string;
}

export interface DictionaryItem {
  id: number;
  type: string;
  label: string;
  value: string;
  sort_order: number;
}
