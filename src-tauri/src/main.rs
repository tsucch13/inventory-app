// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use tauri::command;
use tauri::Manager;
use tauri::{window::WindowBuilder, WindowUrl};

use crate::database::create_product;
use crate::database::create_purchase;
use crate::database::delete_purchase;
use crate::database::get_products;
use crate::database::list_purchases;
use crate::database::update_product;
use crate::database::delete_product;
use crate::database::update_purchase;
use crate::database::search_products;

mod database;
pub mod models;

fn main() {
    // Load the environment variables from the .env file
    dotenv().ok();

    // Initialize the database tables
    match database::create_tables() {
        Ok(()) => {
            println!("Database tables created successfully");
        }
        Err(err) => {
            eprintln!("Failed to create database tables: {}", err);
            return;
        }
    }

    // Start the Tauri application
    tauri::Builder::default()
    
        .invoke_handler(tauri::generate_handler![create_product, get_products, update_product, delete_product, list_purchases, create_purchase, update_purchase, delete_purchase, search_products ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
