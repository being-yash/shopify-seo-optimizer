import React, { useState } from "react";
import {
  Card,
  TextField,
  Button,
  Text,
  Spinner,
  Layout,
} from "@shopify/polaris";
import axios from "axios";

export default function ProductEditor({ product, goBack }) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.body_html || "");
  const [loading, setLoading] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const generateSEO = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/generate-seo`, {
        title,
        description,
      });

      setSeoTitle(res.data.title);
      setSeoDescription(res.data.description);
      console.log("✅ SEO Generated:frnt", { seoTitle, seoDescription });
    } catch (err) {
      console.error("❌ SEO Generation Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/update-product`, {
        id: product.id,
        title: seoTitle,
        description: seoDescription,
      }, { withCredentials: true });

      alert("✅ Product updated!");
    } catch (err) {
      console.error("❌ Product update failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Edit Product">
      <Layout>
        <Layout.Section>
          <TextField label="Title" value={title} onChange={setTitle} />
          <TextField
            label="Description"
            value={description}
            onChange={setDescription}
            multiline={6}
          />
          <Button onClick={generateSEO} disabled={loading}>
            Generate SEO
          </Button>
        </Layout.Section>

        {loading && (
          <Layout.Section>
            <Spinner size="large" />
          </Layout.Section>
        )}

        {(seoTitle || seoDescription) && (
          <Layout.Section>
            <Text variant="headingMd">Preview</Text>
            <Text>📝 <strong>Title:</strong> {seoTitle}</Text>
            <Text>📄 <strong>Description:</strong> {seoDescription}</Text>

            <Button onClick={updateProduct} primary>
              Save to Shopify
            </Button>
          </Layout.Section>
        )}

        <Layout.Section>
          <Button onClick={goBack} tone="critical">← Back</Button>
        </Layout.Section>
      </Layout>
    </Card>
  );
}
