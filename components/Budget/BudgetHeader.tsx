// /components/Budget/BudgetHeader.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Using MaterialCommunityIcons for edit icon
import { LineChart } from "react-native-chart-kit"; // Assuming you're using 'react-native-chart-kit' for graphs
import { Dimensions } from "react-native";
import { Modal, TextInput } from "react-native"; // For edit modal

const screenWidth = Dimensions.get("window").width; // Get screen width for responsive design
const screenHeight = Dimensions.get("window").height; // Get screen height for relative scaling

export default function BudgetHeader({
  isExpanded,
  toggleExpanded,
  totalAmount,
  remainingAmount,
  onEditAmount,
}: {
  isExpanded: boolean;
  toggleExpanded: () => void;
  totalAmount: number;
  remainingAmount: number;
  onEditAmount: (newTotalAmount: number) => void; // Updated to accept a number
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newAmount, setNewAmount] = useState<string>(totalAmount.toString()); // Hold the new amount as a string for input

  // Handle saving the edited total amount
  const handleSaveEdit = () => {
    const numericAmount = parseFloat(newAmount); // Convert the string to a number
    if (!isNaN(numericAmount)) {
      onEditAmount(numericAmount); // Pass the new total amount back to the parent component
    }
    setIsEditing(false); // Close the modal
  };

  // Sample data for the graph (used when expanded)
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [
          500, 600, 700, 1000, 950, 1100, 900, 1200, 1300, 1250, 1400, 1500,
        ],
        color: () => `rgba(0, 160, 0, 0.4)`, // Lighter green tone for the graph line
        strokeWidth: 1, // Decrease line width for lighter appearance
      },
    ],
  };

  return (
    <TouchableOpacity
      onPress={toggleExpanded}
      activeOpacity={1}
      style={[
        styles.headerContainer,
        { height: isExpanded ? screenHeight * 0.35 : screenHeight * 0.15 }, // Adjust height dynamically
      ]}
    >
      <View style={styles.topRow}>
        {/* Total Saved with Remaining Amount */}
        <Text style={styles.totalSavedText}>
          Total Saved: <Text style={styles.totalAmount}>${totalAmount}</Text> (
          <Text style={styles.remainingAmount}>${remainingAmount}</Text>)
        </Text>

        {/* Edit Button */}
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <MaterialCommunityIcons
            name="briefcase-edit-outline"
            size={screenWidth * 0.06}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {/* Conditionally render the graph based on the expanded state */}
      {isExpanded && (
        <View style={styles.graphContainer}>
          <LineChart
            data={data}
            width={screenWidth * 0.85} // Width now relative to the screen width
            height={screenHeight * 0.2} // Reduced height to make the graph smaller
            chartConfig={{
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#f5f5f5",
              color: () => `rgba(0, 160, 0, 0.4)`, // Lighter green tone for the graph
              labelColor: () => `#333`, // Ensure label color is visible
              decimalPlaces: 0,
              strokeWidth: 1, // Decrease the line width for a lighter appearance
              propsForDots: {
                r: "2", // Decrease dot size
                strokeWidth: "0", // Remove the dot border
                stroke: "none", // Remove the stroke for lighter dots
              },
              // Y-axis and X-axis label font size adjustment
              propsForVerticalLabels: {
                fontSize: 8, // Very small font for Y-axis labels
              },
              propsForHorizontalLabels: {
                fontSize: 8, // Very small font for X-axis labels
              },
            }}
            bezier // Smoothens the graph lines
            withVerticalLines={false} // Remove vertical grid lines
            withHorizontalLines={false} // Remove horizontal grid lines
            withHorizontalLabels={true} // Ensure X-axis labels are visible
            style={styles.graphStyle}
          />
        </View>
      )}

      {/* Expand/Collapse Indicator */}
      <Icon
        name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
        size={screenWidth * 0.04} // Smaller arrow icon size
        color="#333"
        style={styles.expandCollapseIcon}
      />

      {/* Modal for editing the total amount */}
      {isEditing && (
        <Modal transparent={true} visible={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Total Amount</Text>
              <TextInput
                style={styles.input}
                value={newAmount}
                onChangeText={setNewAmount}
                keyboardType="numeric"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: screenHeight * 0.005, // Reduced padding to utilize space
    paddingHorizontal: screenWidth * 0.03, // Reduced padding for better space utilization
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: screenHeight * 0.005, // Reduced margin for less empty space
  },
  totalSavedText: {
    fontSize: screenWidth * 0.045, // Font size relative to screen width
    fontWeight: "bold",
    color: "#333", // Black for "Total Saved:"
  },
  totalAmount: {
    color: "#00a000", // Green for the total amount
    fontWeight: "bold",
  },
  remainingAmount: {
    color: "#ff0000", // Red for the remaining amount
    fontWeight: "bold",
  },
  graphStyle: {
    paddingBottom: 12, // Extra padding for X-axis labels
    borderRadius: 10,
  },
  graphContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  expandCollapseIcon: {
    alignSelf: "center", // Center the expand/collapse icon
    marginTop: screenHeight * 0.005, // Reduced margin to minimize space
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#00a000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
