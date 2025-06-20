import React, { useEffect, useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  Layout,
  Text,
  Spinner,
} from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import axios from "axios";

function App() {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const shopParam = url.searchParams.get("shop");
    if (!shopParam) return;

    setShop(shopParam);

    axios
      .get(`https://your-backend-url.onrender.com/api/products`, {
        withCredentials: true,
      })
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, []);

  return (
    <AppProvider>
      <Page title="Shopify SEO Optimizer">
        {loading ? (
          <Spinner />
        ) : (
          <Layout>
            <Layout.Section>
              <Card>
                <Text variant="headingMd">Fetched {products.length} products</Text>
                <ul>
                  {products.map((p) => (
                    <li key={p.id}>{p.title}</li>
                  ))}
                </ul>
              </Card>
            </Layout.Section>
          </Layout>
        )}
      </Page>
    </AppProvider>
  );
}

export default App;
