export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'salesperson' | 'client' | 'stock_person' | 'cashier';
}


export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}


export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}


export interface ChangePasswordRequest {
  old_password?: string;
  new_password?: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: string;
}
