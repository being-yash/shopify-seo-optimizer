import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductEditor from "./components/ProductEditor";
import AdminDashboard from "./admin/AdminDashboard";
import AddVendor from "./admin/AddVendor";
import CreateVendor from "./admin/CreateVendor";
import VendorLogin from "./vendor/VendorLogin";
import VendorDashboard from "./vendor/VendorDashboard";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";

import Cookies from "js-cookie";

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
      <Router>
        <Header />
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
                )}
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vendors/add" element={<AddVendor />} />
          <Route path="/admin/vendors/create" element={<CreateVendor />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        </Routes>
        <Footer />
      </Router>
    </AppProvider>
  );
}

export default App;
