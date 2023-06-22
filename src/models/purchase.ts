interface Purchase {
  id: number;
  created_at: string;
  client_name: string;
  client_mail: string;
  products: any; // TODO: List of products type
  total_price: number;
}
