"use client";

import { useState } from "react";
import { createProduct } from "../../api";
import ProductList from "@/components/ProductsList";
import Navbar from "@/components/NavBar";
import AppShellDemo from "@/components/AppShell";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const ProductsPage = () => {
  const [newProductName, setNewProductName] = useState("");

  return (
    <>
      <ModalsProvider>
        <Notifications />
        <AppShellDemo>
          <ProductList />
        </AppShellDemo>
      </ModalsProvider>
    </>
  );
};

export default ProductsPage;
