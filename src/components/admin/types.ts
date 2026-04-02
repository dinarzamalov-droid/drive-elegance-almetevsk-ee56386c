export interface Booking {
  id: string;
  car_label: string;
  car_value: string;
  date_from: string;
  date_to: string;
  days: number;
  daily_rate: number;
  extras_cost: number;
  total_cost: number;
  prepay: number;
  remaining: number;
  deposit: number;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  phone: string;
  email: string;
  passport_series: string | null;
  passport_number: string | null;
  passport_date: string | null;
  passport_code: string | null;
  license_number: string | null;
  license_date: string | null;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  city: string;
  delivery_time: string | null;
  age_category: string;
  experience_category: string;
  selected_extras: string[] | null;
  promo_code: string | null;
  preferred_messenger: string | null;
}

export interface FleetCar {
  id: string;
  car_value: string;
  car_label: string;
  status: string;
  mileage: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  phone: string;
  email: string;
  loyalty_level: string;
  bonus_balance: number;
  total_spent: number;
  total_rentals: number;
  list_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const statusLabels: Record<string, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  completed: "Завершена",
  cancelled: "Отменена",
};

export const paymentLabels: Record<string, string> = {
  pending: "Ожидание",
  paid: "Оплачено",
};

export const methodLabels: Record<string, string> = {
  cash: "Наличные",
  transfer: "Перевод",
  online: "Онлайн",
};

export const fleetStatusLabels: Record<string, string> = {
  free: "Свободен",
  busy: "Занят",
  maintenance: "На ТО",
};

export const listStatusLabels: Record<string, string> = {
  normal: "Обычный",
  white: "Белый список",
  black: "Чёрный список",
};
