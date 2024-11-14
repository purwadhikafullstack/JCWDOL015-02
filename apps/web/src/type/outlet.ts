export interface Outlet {
  id: string;
  name: string;
  city: string;
  address: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface OutletListResponse {
  data: Outlet[];
  totalPages: number;
  currentPage: number;
  ok: boolean;
}
