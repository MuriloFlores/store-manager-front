import {UserResponse} from './user.model';

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse {
  data: UserResponse[];
  pagination: PaginationInfo
}
