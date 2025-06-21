import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  IndexTable,
  useIndexResourceState,
  Text,
  Spinner,
  EmptySearchResult,
} from "@shopify/polaris";
//blank line

export default function ProductList({ onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products", { withCredentials: true });
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const resourceState = useIndexResourceState(products);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Spinner accessibilityLabel="Loading Products" size="large" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptySearchResult
        title="No products found"
        description="There are no products in this store."
        withIllustration
      />
    );
  }

  return (
    <Card title="Products">
      <IndexTable
        resourceName={{ singular: "product", plural: "products" }}
        itemCount={products.length}
        selectedItemsCount={resourceState.selectedResources.length}
        onSelectionChange={resourceState.handleSelectionChange}
        headings={[
          { title: "Title" },
          { title: "Status" },
          { title: "Action" },
        ]}
      >
        {products.map((product, index) => (
          <IndexTable.Row
            id={product.id.toString()}
            key={product.id}
            selected={resourceState.selectedResources.includes(product.id.toString())}
            position={index}
          >
            <IndexTable.Cell>
              <Text variant="bodyMd" fontWeight="bold">
                {product.title}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{product.status || "active"}</IndexTable.Cell>
            <IndexTable.Cell>
              <button
                onClick={() => onSelectProduct(product)}
                style={{
                  background: "#5c6ac4",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Edit SEO
              </button>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </Card>
  );
}
