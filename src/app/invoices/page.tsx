"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import CreateProduct from "@/components/CreateProduct";
import Navbar from "@/components/NavBar";
import { AppShell, Title } from "@mantine/core";
import Demo from "@/components/AppShell";
import AppShellDemo from "@/components/AppShell";
import ProductList from "@/components/ProductsList";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import Page from "@/components/pdf/Page";
import { Invoice } from "@/data/types";
import InvoicePage from "@/components/pdf/InvoicePage";

export default function Home() {
  const savedInvoice =
    typeof window !== "undefined" && window.localStorage.getItem("invoiceData");
  let data = null;

  try {
    if (savedInvoice) {
      data = JSON.parse(savedInvoice);
    }
  } catch (_e) {}

  const onInvoiceUpdated = (invoice: Invoice) => {
    typeof window !== "undefined" &&
      window.localStorage.setItem("invoiceData", JSON.stringify(invoice));
  };

  return (
    <ModalsProvider>
      <Notifications />
      <AppShellDemo>
        <div className="app">
          <InvoicePage data={data} onChange={onInvoiceUpdated} />
        </div>
      </AppShellDemo>
    </ModalsProvider>
  );
}
