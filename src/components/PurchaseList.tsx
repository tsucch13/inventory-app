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
  getPurchases,
} from "../api";
import "../styles/globals.css";
import Navbar from "./NavBar";
import { useDisclosure } from "@mantine/hooks";
import CreateProductModal from "./CreateProductModal";
import { notifications } from "@mantine/notifications";
import ConfirmModal from "./ConfirmModal";
import { modals } from "@mantine/modals";
import { FaCheck } from "react-icons/fa";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editPurchase, setEditPurchase] = useState<Purchase | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [update, setUpdate] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    fetchPurchases();
  }, [opened, update]);

  const fetchPurchases = async () => {
    try {
      const purchaseList = await getPurchases();
      setPurchases(purchaseList);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      notifications.show({
        title: "Success!",
        message: "The purchase has been deleted successfully",
        color: "green",
        withCloseButton: true,
        icon: <FaCheck />,
      });
      setUpdate(!update);
    } catch (error) {
      console.error("Error deleting purchase:", error);
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

  const renderPurchases = () => {
    return purchases.map((purchase) => (
      <tr key={purchase.id}>
        <td>
          <Text size="sm" color="gray">
            {purchase.id}
          </Text>
        </td>
        <td>
          <Text size="sm" weight={500} color="gray">
            {purchase.total_price}
          </Text>
        </td>
        <td>
          <Text size="sm" color="gray">
            ${purchase.price}
          </Text>
        </td>
        <td>
          <Text size="sm" color="gray">
            {purchase.quantity}
          </Text>
        </td>
        <td>
          <Text size="xs" color="gray">
            {purchase.description}
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
                setEditPurchase(purchase);
                open();
              }}
            >
              View
            </Button>
            {/* <Button
              onClick={() => {
                setViewMode(false);
                setEditItem(purchase);
                open();
              }}
              size="xs"
              variant="outline"
              color="green"
            >
              Edit
            </Button> */}
            <Button
              size="xs"
              variant="outline"
              color="red"
              onClick={() => openConfirmModal(purchase)}
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
            <tbody>{renderPurchases()}</tbody>
          </Table>
        </Container>
      </div>
    </>
  );
};

export default ProductList;
