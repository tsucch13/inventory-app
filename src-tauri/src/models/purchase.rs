use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use super::product::Product;

mod ts_seconds_option {
    use chrono::{DateTime, TimeZone, Utc};
    use serde::{self, Deserialize, Deserializer, Serializer};

    const FORMAT: &str = "%Y-%m-%d %H:%M:%S";

    pub fn serialize<S>(
        date: &Option<DateTime<Utc>>,
        serializer: S,
    ) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        if let Some(date) = date {
            let formatted = date.format(FORMAT).to_string();
            serializer.serialize_some(&formatted)
        } else {
            serializer.serialize_none()
        }
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Option<DateTime<Utc>>, D::Error>
    where
        D: Deserializer<'de>,
    {
        let opt_string: Option<String> = Option::deserialize(deserializer)?;
        Ok(opt_string.and_then(|s| Utc.datetime_from_str(&s, FORMAT).ok()))
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Purchase {
    pub id: Option<i32>,
    pub created_at: Option<String>,
    pub client_name: String,
    pub client_mail: String,
    pub products: Vec<Product>,
    pub total_price: f32,
}

impl Purchase {
    pub fn new(
        id: Option<i32>,
        client_name: String,
        client_mail: String,
        products: Vec<Product>,
    ) -> Self {
        let total_price = products.iter().fold(0.0, |acc, product| {
            acc + (product.price * product.quantity as f64)
        });

        Purchase {
            id,
            created_at: Some(Utc::now().to_rfc3339()),
            client_name,
            client_mail,
            products,
            total_price: total_price as f32,
        }
    }
}
