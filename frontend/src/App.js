import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductEditor from "./components/ProductEditor";

import Cookies from "js-cookie";
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
  useEffect(() => {
    const url = new URL(window.location.href);
    const shopParam = url.searchParams.get("shop");
    const token = url.searchParams.get("token");

    console.log("🔍 URL Params:", { shopParam, token });

    if (shopParam && token) {
      localStorage.setItem("shop", shopParam);
      localStorage.setItem("token", token);

      Cookies.set("shop", shopParam, { secure: true, sameSite: "None" });
      Cookies.set("token", token, { secure: true, sameSite: "None" });
    }
  }, []);
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
                <ProductEditor product={selectedProduct} goBack={() => setSelectedProduct(null)} />
                //<ProductEditor product={selectedProduct} goBack={() => setSelectedProduct(null)} />
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}

export default App;
