import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Text,
  Title,
  Container,
  useMantineTheme,
  Stack,
  Group,
} from "@mantine/core";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api";
import "../styles/globals.css";
import Navbar from "./NavBar";
import { useDisclosure } from "@mantine/hooks";
import CreateProductModal from "./CreateProductModal";
import { notifications } from "@mantine/notifications";
import ConfirmModal from "./ConfirmModal";
import { modals } from "@mantine/modals";
import { FaCheck } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [update, setUpdate] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    fetchProducts();
  }, [opened, update]);

  const fetchProducts = async () => {
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      notifications.show({
        title: "Success!",
        message: "The product has been deleted successfully",
        color: "green",
        withCloseButton: true,
        icon: <FaCheck />,
      });
      setUpdate(!update);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openConfirmModal = (product: Product) => {
    modals.openConfirmModal({
      title: <Title order={3}>{"Delete product"}</Title>,
      centered: true,
      children: (
        <Text size="sm">
          {"Are you sure that you want to delete this product?"}
        </Text>
      ),
      labels: { confirm: "Delete product", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => close(),
      onConfirm: () => handleDelete(product.id),
    });
  };

  const renderProducts = () => {
    return products.map((product) => (
      <tr key={product.id}>
        <td>
          <Text size="sm" color="gray">
            {product.id}
          </Text>
        </td>
        <td>
          <Text size="sm" weight={500} color="gray">
            {product.name}
          </Text>
        </td>
        <td>
          <Text size="sm" color="gray">
            ${product.price}
          </Text>
        </td>
        <td>
          <Text size="sm" color="gray">
            {product.quantity}
          </Text>
        </td>
        <td>
          <Text size="xs" color="gray">
            {product.description}
          </Text>
        </td>
        <td>
          <Group>
            <Button
              size="xs"
              variant="outline"
              color="blue"
              onClick={() => {
                setViewMode(true);
                setEditItem(product);
                open();
              }}
            >
              View
            </Button>
            <Button
              onClick={() => {
                setViewMode(false);
                setEditItem(product);
                open();
              }}
              size="xs"
              variant="outline"
              color="green"
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="outline"
              color="red"
              onClick={() => openConfirmModal(product)}
            >
              Delete
            </Button>
          </Group>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <CreateProductModal
        opened={opened}
        theme={theme}
        close={close}
        editItem={editItem!}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className="bg-custom-pink bg-pattern-pattern1">
        <Container size="sm" className="py-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Title order={2}>Product List</Title>
            <div className="text-right">
              <Button
                onClick={() => {
                  setEditItem(null);
                  open();
                }}
                size="sm"
                color={"pink"}
              >
                {<Text color="black">Add Product</Text>}
              </Button>
            </div>
          </div>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderProducts()}</tbody>
          </Table>
        </Container>
      </div>
    </>
  );
};

export default ProductList;
