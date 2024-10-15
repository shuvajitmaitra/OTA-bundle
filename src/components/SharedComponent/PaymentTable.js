import React from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";

const data = [
  {
    amount: 100,
    method: "Credit Card",
    date: "20230501",
    status: "Completed",
    attachment:
      "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/chat/658ce2bf45ea7e0019776f2f/1715669719565-pay-attachment.png",
    note: "Payment received.",
  },
  {
    amount: 150,
    method: "Debit Card",
    date: "20230502",
    status: "Pending",
    attachment:
      "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/chat/658ce2bf45ea7e0019776f2f/1715669719565-pay-attachment.png",
    note: "Processing payment.",
  },
  {
    amount: 200,
    method: "PayPal",
    date: "20230503",
    status: "Failed",
    attachment:
      "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/chat/658ce2bf45ea7e0019776f2f/1715669719565-pay-attachment.png",
    note: "Payment failed.",
  },
  // Add more data as needed
];

const DataTable = () => {
  return (
    <ScrollView horizontal>
      <View>
        <ScrollView>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>Method</Text>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Status</Text>
            <Text style={styles.headerCell}>Attachment</Text>
            <Text style={styles.headerCell}>Note</Text>
          </View>
          {data.map((item, index) => (
            <View key={index} style={styles.dataRow}>
              <Text style={styles.dataCell}>{item.amount}</Text>
              <Text style={styles.dataCell}>{item.method}</Text>
              <Text style={styles.dataCell}>{item.date}</Text>
              <Text style={styles.dataCell}>{item.status}</Text>
              <Image style={styles.image} source={{ uri: item.attachment }} />
              <Text style={styles.dataCell}>{item.note}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  headerCell: {
    minWidth: 120,
    textAlign: "center",
    fontWeight: "bold",
  },
  dataRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dataCell: {
    minWidth: 120,
    textAlign: "center",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
});

export default DataTable;
