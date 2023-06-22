import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Group,
  Button,
  Title,
  Textarea,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { ChangeEvent, useEffect, useState } from "react";
import { createProduct, deleteProduct, updateProduct } from "@/api";
import { Notifications, notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";

// add missing props for this component
interface CreateProductModalProps {
  opened: boolean;
  theme: any;
  close: () => void;
  editItem: Product;
  viewMode: boolean;
  setViewMode: (viewMode: boolean) => void;
}

const CreateProductModal = ({
  opened,
  theme,
  close,
  editItem,
  viewMode,
  setViewMode,
}: CreateProductModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [updatedProduct, setUpdatedProduct] = useState(editItem);

  useEffect(() => {
    console.log("here", editItem);
    if (editItem) {
      setName(editItem.name);
      setPrice(editItem.price);
      setDescription(editItem.description);
    }
  }, [opened]);

  const handleEdit = async (product: Product) => {
    const newProduct = {
      id: editItem.id,
      name: name,
      price: price,
      quantity: quantity,
      description: description,
    };
    try {
      // Make changes to the product object if needed
      console.log(product);
      const updatedProduct = await updateProduct(newProduct);
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

  const handleCreateProduct = async () => {
    const newProduct = {
      name,
      price,
      quantity,
      description,
    };

    if (newProduct.name === "" || newProduct.price === null) {
      throw notifications.show({
        title: "Error!",
        message: "Please fill in all the required fields",
        withCloseButton: true,
        color: "red",
      });
    }

    try {
      // Call the createProduct API function
      await createProduct(newProduct);

      console.log("Product created");
      notifications.show({
        title: "Success!",
        message: "The product has been created successfully",
        withCloseButton: true,
        color: "green",
        icon: <FaCheck />,
      });
      // Reset the form fields
      setName("");
      setPrice(0);
      setDescription("");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleCloseAndViewMode = () => {
    close();
    setTimeout(() => {
      setViewMode(false);
    }, 500);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          handleCloseAndViewMode();
        }}
        closeOnEscape
        title={
          <Title order={2}>
            {viewMode === true && editItem
              ? `View product: ${editItem.name}`
              : editItem
              ? `Edit product: ${editItem.name}`
              : "Create product"}
          </Title>
        }
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        centered
      >
        {/* Create text fields */}
        <TextInput
          placeholder="Name"
          label="Name"
          required
          defaultValue={editItem ? editItem.name : ""}
          onChange={(e) => {
            setName(e.target.value);
          }}
          disabled={viewMode}
        />
        <NumberInput
          label="Price"
          defaultValue={editItem ? editItem.price : 0}
          required
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "$ "
          }
          onChange={(e) => {
            setPrice(Number(e));
          }}
          disabled={viewMode}
        />
        <NumberInput
          label="Quantity"
          defaultValue={editItem ? editItem.quantity : 0}
          required
          onChange={(e) => {
            setQuantity(Number(e));
          }}
          disabled={viewMode}
        />
        <Textarea
          placeholder="Description"
          label="Description"
          defaultValue={editItem ? editItem.description : ""}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          disabled={viewMode}
        />
        {/* Modal content */}
        <Group position="apart" style={{ marginTop: 15 }}>
          <Button
            color="gray"
            onClick={() => {
              handleCloseAndViewMode();
            }}
          >
            {viewMode ? "Close" : "Cancel"}
          </Button>
          {viewMode ? null : (
            <Button
              color="pink"
              onClick={() => {
                if (editItem) {
                  console.log(updatedProduct);
                  handleEdit(updatedProduct);
                } else {
                  handleCreateProduct();
                }
                close();
              }}
              variant="filled"
            >
              {editItem ? "Save changes" : viewMode ? "Close" : "Create"}
            </Button>
          )}
        </Group>
      </Modal>
    </>
  );
};

export default CreateProductModal;
