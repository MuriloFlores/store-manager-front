export interface ClientItemResponse {
  id: string
  name: string
  description: string
  sku: string
  price_sale: number
  active: boolean
}

export interface InternalItemResponse extends ClientItemResponse {
  item_type: string;
  active: boolean;
  can_be_sold: boolean;
  price_cost: number;
  stock_quantity: number;
  unit_of_measure: string;
  minimum_stock_level: number;
}

export interface CreateItemRequest {
  name: string
  sku: string
  description: string
  item_type: 'MANUFACTURED' | 'MATERIAL'
  can_be_sold: boolean
  active: boolean
  price_in_cents: number
  price_cost_in_cents: number
  stock_quantity: number
  minimum_stock_level: number
  unit_of_measure: string
}

export interface UpdateItemRequest {
  name?: string
  description?: string
  active?: boolean
  can_be_sold?: boolean
  price_sale_in_cents?: boolean
  minimum_stock_level?: number
}
