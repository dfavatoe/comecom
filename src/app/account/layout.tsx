import { Container, Row, Col } from "react-bootstrap";
import SideNav from "@/components/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column flex-md-row overflow-hidden"
    >
      <Col xs={12} md={3} className="flex-shrink-0">
        <SideNav />
      </Col>
      <Col className="flex-grow-1 p-3 p-md-4 overflow-auto">{children}</Col>
    </Container>
  );
}
