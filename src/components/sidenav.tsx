import Link from "next/link";
import NavLinks from "@/components/sidenav-links";
import { Col, Row } from "react-bootstrap";
import "@/app/globals.css";

export default function SideNav() {
  return (
    <div className="d-flex flex-column h-100 px-3 py-4 px-md-2">
      <div
        className="mb-2 flex h-20 items-center justify-center rounded-md p-4 md:h-40"
        style={{ backgroundColor: "var(--secondary)" }}
      >
        <div className="text-black" style={{ width: "2rem" }}>
          <Row className="d-inline text-center">
            <h1 style={{ color: "var(--primary)" }}>Account</h1>
          </Row>
        </div>
      </div>

      <div className="d-flex flex-grow-1 flex-row justify-content-between gap-2 flex-md-column">
        <NavLinks />

        <div className="d-none d-md-block flex-grow-1 w-100 rounded bg-light" />
      </div>
    </div>
  );
}
