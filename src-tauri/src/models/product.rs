use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: Option<i32>,
    pub name: String,
    pub price: f64,
    pub quantity: i32,
    pub description: String,
}

impl Product {
    pub fn new(id: Option<i32>, name: String, price: f64, quantity: i32, description: String) -> Self {
        Product {
            id,
            name,
            price,
            quantity,
            description,
        }
    }
}
