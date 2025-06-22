import React, { useState } from "react";
import ProductList from "./components/ProductList";
// import ProductEditor from "./components/ProductEditor"; // Uncomment when created

import {
  AppProvider,
  Page,
  Layout,
  Card,
  Text,
} from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <AppProvider>
      <Page title="Shopify SEO Optimizer">
        <Layout>
          <Layout.Section>
            <Card>
              <Text variant="headingMd">
                {selectedProduct ? "Edit Product SEO" : "Select a Product"}
              </Text>
            </Card>
            <Card>
              {!selectedProduct ? (
                <ProductList onSelectProduct={(p) => setSelectedProduct(p)} />
              ) : (
                <div style={{ padding: "1rem" }}>
                  <p>🛠 ProductEditor coming soon...</p>
                  <button
                    style={{
                      marginTop: "1rem",
                      background: "#5c6ac4",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedProduct(null)}
                  >
                    ← Back to Product List
                  </button>
                </div>
                // <ProductEditor product={selectedProduct} goBack={() => setSelectedProduct(null)} />
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}

export default App;
