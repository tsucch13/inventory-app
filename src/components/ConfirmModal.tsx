import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

interface ConfirmModalProps {
  text: string;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({
  text,
  title,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  modals.openConfirmModal({
    title: title,
    children: <Text size="sm">{text}</Text>,
    labels: { confirm: "Confirm", cancel: "Cancel" },
    onCancel: onCancel,
    onConfirm: onConfirm,
  });
};

export default ConfirmModal;
