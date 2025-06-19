"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Table,
} from "react-bootstrap";

/**
 * Type representing a single seller result returned by the API.
 */
interface SellerResult {
  title: string;
  store: string;
  price: string;
  url: string;
}

/**
 * `PriceAnalysis` – Page component that lets a seller enter a product name
 * and retrieve a price‑comparison list via the `/api/price-comparison` route.
 *
 * Requirements:
 * – Next.js App Router client component (hence the "use client" pragma).
 * – React‑Bootstrap UI elements for consistent styling.
 * – Typescript for type safety.
 */
export default function ShoppingAnalysis() {
  const [query, setQuery] = useState<string>("");
  const [country, setCountry] = useState<string>("Germany");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SellerResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit handler – calls the backend API and updates component state.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a product name.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/price-shopping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, country }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = (await res.json()) as { result?: SellerResult[] };
      setResults(data.result ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch price analysis. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      {/* Page title */}
      <Row className="mb-3">
        <Col>
          <h2>Shopping Analysis</h2>
        </Col>
      </Row>

      {/* Query form */}
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-end g-2">
          <Col sm={9}>
            <Form.Group controlId="productQuery">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. iPhone 13 Pro 256GB"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            </Form.Group>
          </Col>

          <Col sm={3}>
            <Form.Group controlId="countrySelect">
              <Form.Label>Country</Form.Label>
              <Form.Select
                value={country}
                onChange={(e) => setCountry(e.currentTarget.value)}
              >
                <option value="Germany">Germany</option>
                <option value="UnitedStates">United States</option>
                <option value="Brazil">Brazil</option>
                <option value="UnitedKingdom">United Kingdom</option>
                <option value="France">France</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col sm={3}>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Loading…
                </>
              ) : (
                "Compare Prices"
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Error alert */}
      {error && (
        <Row className="mt-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Results table */}
      {results.length > 0 && (
        <Row className="mt-4">
          <Col>
            <h4>Results</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Store</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.title}</td>
                    <td>{r.price}</td>
                    <td>{r.store}</td>
                    <td>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
}
