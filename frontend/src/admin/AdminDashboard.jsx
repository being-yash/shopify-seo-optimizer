import React, { useEffect, useState } from "react";
import { Page, Layout, Card, Text, Badge, IndexTable, useIndexResourceState, Button } from "@shopify/polaris";
import axios from "axios";
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [data, setData] = useState(null);
  const shop = new URLSearchParams(window.location.search).get("shop");
  
  useEffect(() => {
    axios.get(`/api/admin/dashboard?shop=${shop}`).then((res) => setData(res.data));
  }, [shop]);

  if (!data) return <Page title="Admin Dashboard"><Text>Loading...</Text></Page>;

  const resourceName = { singular: "vendor", plural: "vendors" };
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(data.vendors);

  return (
    <Page title="Admin Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <Text variant="headingMd">Summary</Text>
            <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
              <Card sectioned><Text>Total Vendors: {data.total_vendors}</Text></Card>
              <Card sectioned><Text>Total Sales: ₹{data.total_sales}</Text></Card>
              <Card sectioned><Text>Unpaid Amount: ₹{data.total_unpaid_amount}</Text></Card>
            </div>
          </Card>
          <Link to="/admin/vendors/add">
            <Button primary>Add Vendor</Button>
          </Link>
        </Layout.Section>
        <Layout.Section>
          <Card title="Vendors">
            <IndexTable
              resourceName={resourceName}
              itemCount={data.vendors.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Name" },
                { title: "Total Orders" },
                { title: "Sales" },
                { title: "Unpaid" },
                { title: "Actions" },
              ]}
            >
              {data.vendors.map((vendor, index) => (
                <IndexTable.Row
                  id={vendor._id}
                  key={vendor._id}
                  selected={selectedResources.includes(vendor._id)}
                  position={index}
                >
                  <IndexTable.Cell>{vendor.name}</IndexTable.Cell>
                  <IndexTable.Cell>
                    <Badge status="info">{vendor.total_orders}</Badge>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Badge status="success">₹{vendor.total_sales}</Badge>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Badge status="attention">₹{vendor.unpaid_amount}</Badge>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <a href={`/admin/vendors/${vendor._id}`}>View</a>{" | "}
                    <a href={`/admin/vendors/edit/${vendor._id}`}>Edit</a>{" | "}
                    <button style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Disable</button>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default AdminDashboard;