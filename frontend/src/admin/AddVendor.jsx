import React, { useState } from "react";
import { Page, Layout, Card, Form, FormLayout, TextField, Button, Toast } from "@shopify/polaris";
import axios from "axios";

function AddVendor() {
  const [fields, setFields] = useState({
    shop_domain: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    commission_rate: 0.15,
  });
  const [toast, setToast] = useState(false);

  const handleChange = (field) => (value) => setFields({ ...fields, [field]: value });

  const handleSubmit = async () => {
    try {
      await axios.post("/api/admin/vendors", fields);
      setToast(true);
      setTimeout(() => {
        setToast(false);
        // Ideally, refresh the vendor list instead of redirecting
        // For now, we'll just redirect
        window.location.href = "/admin"; 
      }, 1500);
    } catch (error) {
      console.error("Error creating vendor:", error);
      // Handle error, show error message to the user
      // For example:
      // setToast({ error: true, message: "Failed to create vendor. Please check your input and try again." });
    }
  };

  return (
    <Page title="Add Vendor">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField label="Shop Domain" value={fields.shop_domain} onChange={handleChange("shop_domain")} helpText="e.g., your-store.myshopify.com" />
                <TextField label="Name" value={fields.name} onChange={handleChange("name")} />
                <TextField label="Email" type="email" value={fields.email} onChange={handleChange("email")} />
                <TextField label="Phone" value={fields.phone} onChange={handleChange("phone")} />
                <TextField label="Password" type="password" value={fields.password} onChange={handleChange("password")} />
                <TextField label="Commission Rate (%)" type="number" value={fields.commission_rate} onChange={handleChange("commission_rate")} />
                <Button primary submit>Add Vendor</Button>
              </FormLayout>
            </Form>
            {toast && <Toast content="Vendor added successfully!" onDismiss={() => setToast(false)} />}
            {/* {toast.error && <Toast error content={toast.message} onDismiss={() => setToast(false)} />} */}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default AddVendor;