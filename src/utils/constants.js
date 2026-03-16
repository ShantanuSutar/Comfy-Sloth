import React from "react";
import { GiCompass, GiDiamondHard, GiStabbedNote } from "react-icons/gi";
export const links = [
  {
    id: 1,
    text: "home",
    url: "/",
  },
  {
    id: 2,
    text: "about",
    url: "/about",
  },
  {
    id: 3,
    text: "products",
    url: "/products",
  },
];

export const services = [
  {
    id: 1,
    icon: <GiCompass />,
    title: "mission",
    text: "To provide exceptional, handcrafted furniture that combines comfort, quality, and timeless design for every home.",
  },
  {
    id: 2,
    icon: <GiDiamondHard />,
    title: "vision",
    text: "To become the most trusted name in premium home furniture, known for outstanding craftsmanship and customer satisfaction.",
  },
  {
    id: 3,
    icon: <GiStabbedNote />,
    title: "history",
    text: "Founded in 2024, Comfy-Sloth began with a simple belief: everyone deserves a comfortable, beautiful space to call home.",
  },
];

export const products_url = "https://www.course-api.com/react-store-products";

export const single_product_url = `https://www.course-api.com/react-store-single-product?id=`;
