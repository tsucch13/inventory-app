import React, { useState } from "react";
import { FiMenu, FiHome, FiShoppingBag, FiInfo, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  createStyles,
  Navbar,
  Group,
  Code,
  getStylesRef,
  rem,
} from "@mantine/core";
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconListDetails,
  IconList,
} from "@tabler/icons-react";
import { MantineLogo } from "@mantine/ds";
import Link from "next/link";
import {
  IconReceipt,
  IconCurrencyDollar,
  IconCreditCard,
} from "@tabler/icons-react";

import MdStorefront from "react-icons/md";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors.pink[3],
  },

  version: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background!,
      0.1
    ),
    color: theme.white,
    fontWeight: 700,
  },

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.colors.pink[4]}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.colors.pink[4] })
        .background!,
      0.1
    )}`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.pink[4],
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.black,
    opacity: 0.75,
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.colors.orange[2],
      [`& .${getStylesRef("icon")}`]: {
        opacity: 0.9,
      },
    },
  },
}));

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { classes, cx } = useStyles();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Navbar height={1080} width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.header}>
        <Link href="/products" className={classes.link}>
          <IconListDetails className={classes.linkIcon} stroke={1.5} />
          <span>Products</span>
        </Link>
        <Link href="/invoices" className={classes.link}>
          <IconReceipt className={classes.linkIcon} stroke={1.5} />
          <span>Invoices</span>
        </Link>
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
