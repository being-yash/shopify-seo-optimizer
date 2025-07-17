import React, { useState } from "react";
import { Page, Layout, Card, Form, FormLayout, TextField, Button, Toast } from "@shopify/polaris";
import axios from "axios";

function CreateVendor() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    commission_rate: 0.15,
  });
  const [toast, setToast] = useState(false);

  const handleChange = (field) => (value) => setFields({ ...fields, [field]: value });

  const handleSubmit = async () => {
    await axios.post("/api/admin/vendors", fields);
    setToast(true);
    setTimeout(() => window.location.href = "/admin", 1500);
  };

  return (
    <Page title="Create Vendor">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField label="Name" value={fields.name} onChange={handleChange("name")} />
                <TextField label="Email" type="email" value={fields.email} onChange={handleChange("email")} />
                <TextField label="Phone" value={fields.phone} onChange={handleChange("phone")} />
                <TextField label="Password" type="password" value={fields.password} onChange={handleChange("password")} />
                <TextField label="Commission Rate (%)" type="number" value={fields.commission_rate} onChange={handleChange("commission_rate")} />
                <Button primary submit>Create Vendor</Button>
              </FormLayout>
            </Form>
            {toast && <Toast content="Vendor created!" onDismiss={() => setToast(false)} />}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default CreateVendor;