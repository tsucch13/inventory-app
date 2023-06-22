mod errori;
#[path = "../models/product.rs"]
mod product;

#[path = "../models/purchase.rs"]
mod purchase;

use rusqlite::Connection;
use rusqlite::params;
use rusqlite::Result;
use chrono::{DateTime, Utc};
use chrono::offset::FixedOffset;
use serde_json;
use serde_json::Value;
use serde_json::json;
use serde_json::to_string;
use serde_json::from_str;
use serde_json::Error;


use self::{errori::CommandResult, product::Product, purchase::Purchase};

pub fn connect() -> Result<Connection> {
    Connection::open("inventory.db")
}

pub fn create_tables() -> Result<()> {
    let conn = connect()?;
    conn.execute(
        r#"
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            description TEXT
        )
        "#,
        [],
    )?;

    conn.execute(
        r#"
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            client_name TEXT NOT NULL,
            client_mail TEXT NOT NULL,
            products TEXT NOT NULL,
            total_price REAL NOT NULL
        )
        "#,
        params![],
    )?;

    Ok(())
}


/*
    Products
    TODO: Define a better structure for this
 */

#[tauri::command]
pub fn create_product(product: Product) -> CommandResult<()> {
    let conn = connect()?;
    conn.execute(
        r#"
        INSERT INTO products (name, price, quantity, description)
        VALUES (?, ?, ?, ?)
        "#,
        [product.name, product.price.to_string(), product.quantity.to_string(), product.description],
    )?;
    Ok(())
}

#[tauri::command]
pub fn get_products() -> CommandResult<Vec<Product>> {
    let conn = Connection::open("inventory.db")?;

    let mut stmt = conn.prepare("SELECT * FROM products")?;
    let product_rows = stmt.query_map([], |row| {
        Ok(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            price: row.get(2)?,
            quantity: row.get(3)?,
            description: row.get(4)?,
        })
    })?;

    let mut products = Vec::new();

    for product_result in product_rows {
        products.push(product_result?);
    }

    Ok(products)
}

#[tauri::command]
pub fn update_product(
    id: i32,
    name: &str,
    price: f64,
    quantity: i32,
    description: &str,
) -> CommandResult<()> {
    let conn = Connection::open("inventory.db")?;

    conn.execute(
        "UPDATE products SET name = ?1, price = ?2, quantity = ?3, description = ?4 WHERE id = ?5",
        params![name, price, quantity, description, id],
    )?;

    Ok(())
}

#[tauri::command]
pub fn delete_product(id: i32) -> CommandResult<()> {
    let conn = Connection::open("inventory.db")?;

    conn.execute("DELETE FROM products WHERE id = ?1", params![id])?;

    Ok(())
}

#[tauri::command]
pub fn search_products(name: &str) -> CommandResult<Vec<Product>> {
    let conn = Connection::open("inventory.db")?;

    let mut stmt = conn.prepare("SELECT * FROM products WHERE name LIKE '%' || ? || '%'")?;
    let product_rows = stmt.query_map([name], |row| {
        Ok(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            price: row.get(2)?,
            quantity: row.get(3)?,
            description: row.get(4)?,
        })
    })?;

    let mut products = Vec::new();

    for product_result in product_rows {
        products.push(product_result?);
    }

    Ok(products)
}



/*
    Purchases
    TODO: Define a better structure for this
 */

// List all purchases
#[tauri::command]
pub fn list_purchases() -> CommandResult<Vec<Purchase>> {
    let conn = Connection::open("inventory.db")?;

    let mut stmt = conn.prepare("SELECT * FROM purchases")?;
    let purchases = stmt.query_map(params![], |row| {
        Ok(Purchase {
            id: row.get(0)?,
            created_at: row.get(1)?,
            client_name: row.get(2)?,
            client_mail: row.get(3)?,
            total_price: row.get(4)?,
            products: from_str(&row.get::<_, String>(5)?).unwrap(),
        })
    })?;

    let mut result = Vec::new();
    for purchase in purchases {
        result.push(purchase?);
    }

    Ok(result)
}

// Create purchase
#[tauri::command]
pub fn create_purchase(purchase: Purchase) -> CommandResult<()> {
    let conn = Connection::open("inventory.db")?;
    let serialized_products = to_string(&purchase.products).unwrap();

    conn.execute(
        "INSERT INTO purchases (created_at, client_name, client_mail, total_price, products) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            purchase.created_at,
            purchase.client_name,
            purchase.client_mail,
            purchase.total_price.to_string(),
            serialized_products
        ],
    )?;

    Ok(())
}

// Get purchase by id
// pub fn get_purchase(conn: &Connection, purchase_id: i32) -> Result<Option<Purchase>> {
//     let mut stmt = conn.prepare("SELECT * FROM purchases WHERE id = ?1")?;
//     let purchase = stmt.query_row(params![purchase_id], |row| {
//         Ok(Purchase {
//             id: Some(row.get(0)?),
//             created_at: row.get(1)?,
//             client_name: row.get(2)?,
//             client_mail: row.get(3)?,
//             total_price: row.get(4)?,
//             products: from_str(&row.get::<_, String>(5)?).unwrap(),
//         })
//     }).optional()?;

//     Ok(purchase)
// }

// Update purchase
#[tauri::command]
pub fn update_purchase( purchase: Purchase) -> CommandResult<()> {
    let conn = Connection::open("inventory.db")?;
    let serialized_products = to_string(&purchase.products).unwrap();

    conn.execute(
        "UPDATE purchases SET created_at = ?1, client_name = ?2, client_mail = ?3, total_price = ?4, products = ?5 WHERE id = ?6",
        params![
            purchase.created_at,
            purchase.client_name,
            purchase.client_mail,
            purchase.total_price,
            serialized_products,
            purchase.id
        ],
    )?;

    Ok(())
}

// Delete purchase
#[tauri::command]
pub fn delete_purchase(purchase_id: i32) -> CommandResult<()> {
    let conn = Connection::open("inventory.db")?;
    conn.execute("DELETE FROM purchases WHERE id = ?1", params![purchase_id])?;
    Ok(())
}