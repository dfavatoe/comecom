import Person2Icon from "@mui/icons-material/Person2";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { Nav } from "react-bootstrap";

// Navigation link data
const links = [
  { name: "Profile", href: "/account", icon: Person2Icon },
  {
    name: "Products List",
    href: "/account/products-list",
    icon: ProductionQuantityLimitsIcon,
  },
  {
    name: "Create Ad",
    href: "/account/create-ad",
    icon: LightbulbIcon,
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
