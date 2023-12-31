"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import CreateProduct from "@/components/CreateProduct";
import "../styles/globals.css";
import Navbar from "@/components/NavBar";
import { AppShell, Title } from "@mantine/core";
import Demo from "@/components/AppShell";
import AppShellDemo from "@/components/AppShell";
import ProductList from "@/components/ProductsList";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@/scss/main.scss";

export default function Home() {
  //eslint-disable jsx-a11y/alt-text
  return (
    <ModalsProvider>
      <Notifications />
      <AppShellDemo>
        <Title>Welcome!</Title>
      </AppShellDemo>
    </ModalsProvider>
  );
}
