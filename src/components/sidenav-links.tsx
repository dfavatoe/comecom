import Person2Icon from "@mui/icons-material/Person2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Nav } from "react-bootstrap";

// Navigation link data
const links = [
  { name: "Profile", href: "/account", icon: Person2Icon },
  {
    name: "Products List",
    href: "/account/products-list",
    icon: AddShoppingCartIcon,
  },
  {
    name: "Generate Image",
    href: "/account/generate-image",
    icon: LightbulbIcon,
  },
  {
    name: "Chats",
    href: "/account/dashboard/chats",
    icon: ChatBubbleIcon,
  },
  {
    name: "Price Analysis",
    href: "/account/price-analysis",
    icon: PriceChangeIcon,
  },
  {
    name: "Shopping Analysis",
    href: "/account/price-shopping",
    icon: ShowChartIcon,
  },
];

export default function NavLinks() {
  return (
    <Nav className="flex-column w-100">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 bg-light rounded p-3 text-sm fw-medium text-dark hover-bg-sky-100 hover-text-warning"
            style={{ height: "48px" }}
          >
            <LinkIcon className="w-6" />
            <span className="d-none d-md-block">{link.name}</span>
          </a>
        );
      })}
    </Nav>
  );
}
