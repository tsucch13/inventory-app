import React, { FC, useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePage from "./InvoicePage";
import { Invoice, ProductLine } from "@/data/types";
import { getProducts, updateProduct } from "@/api";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import { notifications } from "@mantine/notifications";

interface Props {
  data: Invoice;
}

const Download: FC<Props> = ({ data }) => {
  const [show, setShow] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    console.log("im here");
    setShow(false);

    const timeout = setTimeout(() => {
      setShow(true);
    }, 500);

    fetchProducts();

    return () => clearTimeout(timeout);
  }, [data]);

  const fetchProducts = async () => {
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleQuantityOfProducts = async (productLine: ProductLine) => {
    if (products === undefined) {
      return;
    }

    console.log(productLine);
    const productFound = products.find((product) => {
      return product.name === productLine.description;
    });
    if (productFound === undefined) {
      return;
    }

    if (Number(productLine.quantity) > productFound.quantity) {
      notifications.show({
        title: "Warning",
        message: `The quantity you are selling, exceeds in ${
          Number(productLine.quantity) - productFound.quantity
        } the quantity of ${productFound.name} that you have stored `,
        withCloseButton: true,
        color: "yellow",
        icon: <FaExclamationCircle />,
      });
    }

    if (Number(productLine.quantity) === productFound.quantity) {
      notifications.show({
        title: "Warning",
        message: `The quantity of ${productFound.name} you are selling, it's the same that you have, after this sell, quantity will be 0`,
        withCloseButton: true,
        color: "yellow",
        icon: <FaExclamationCircle />,
      });
    }

    productFound.quantity -= Number(productLine.quantity);

    try {
      // Make changes to the product object
      console.log("entered here");
      const updatedProduct = await updateProduct(productFound);
      console.log("Product updated:", updatedProduct);
      notifications.show({
        title: "Success!",
        message: "The product has been updated successfully",
        withCloseButton: true,
        color: "green",
        icon: <FaCheck />,
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div
      className={"download-pdf " + (!show ? "loading" : "")}
      title="Save PDF"
    >
      {show && (
        <PDFDownloadLink
          document={<InvoicePage pdfMode={true} data={data} />}
          fileName={`${
            data.invoiceTitle ? data.invoiceTitle.toLowerCase() : "invoice"
          }.pdf`}
          onClick={() => {
            console.log("click");
            data.productLines.map((product) =>
              handleQuantityOfProducts(product)
            );
          }}
          aria-label="Save PDF"
        ></PDFDownloadLink>
      )}
    </div>
  );
};

export default Download;
