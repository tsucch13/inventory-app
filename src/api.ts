import { invoke } from "@tauri-apps/api/tauri";

export async function getProducts(): Promise<Product[]> {
  return await invoke("get_products");
}

export async function createProduct(product: Omit<Product, "id">) {
  await invoke("create_product", { product });
}
export async function updateProduct(product: Product) {
  return await invoke("update_product", {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    description: product.description,
  });
}

export async function deleteProduct(id: number) {
  return await invoke("delete_product", { id });
}

export async function getPurchases(): Promise<Purchase[]> {
  return await invoke("get_purchases");
}

export async function createPurchase(purchase: Omit<Purchase, "id">) {
  await invoke("create_purchase", { purchase });
}
export async function updatePurchase(purchase: Purchase) {
  return await invoke("update_product", {
    id: purchase.id,
    created_at: purchase.created_at,
    client_name: purchase.client_name,
    client_mail: purchase.client_mail,
    products: purchase.products,
    total_price: purchase.total_price,
  });
}

export async function deletePurchase(id: number) {
  return await invoke("delete_purchase", { id });
}

export async function searchProducts(name: string): Promise<Product[]> {
  return await invoke("search_products", { name });
}
