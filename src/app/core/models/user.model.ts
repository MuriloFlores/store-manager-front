export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
}

export interface PromoteUserResponse {
  role: 'admin' | 'manager' | 'salesperson' | 'client' | 'stock_person' | 'cashier';
}

export interface DecodedToken {
  id: string;
  role: 'admin' | 'manager' | 'salesperson' | 'client' | 'stock_person' | 'cashier';
  exp: number;
  name: string;
}

export interface AppClaims {
  user_id: string;
  role: 'admin' | 'manager' | 'salesperson' | 'client' | 'stock_person' | 'cashier';
  exp: number;
  name: string;
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
