// /components/Budget/BudgetHeader.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { LineChart } from "react-native-chart-kit"; // Assuming you're using 'react-native-chart-kit' for graphs
import { Dimensions } from "react-native";
import budgetData from "@/assets/data/budgetData.json"; // Load the JSON file

const screenWidth = Dimensions.get("window").width; // Get screen width for responsive design
const screenHeight = Dimensions.get("window").height; // Get screen height for relative scaling

export default function BudgetHeader({
  isExpanded,
  toggleExpanded,
}: {
  isExpanded: boolean;
  toggleExpanded: () => void;
}) {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);

  useEffect(() => {
    // Load total and remaining amounts from JSON file
    setTotalAmount(budgetData.totalAmount);
    setRemainingAmount(budgetData.remainingAmount);
  }, []);

  const handleAdd = () => {
    const updatedTotal = totalAmount + 100;
    const updatedRemaining = remainingAmount + 100;
    setTotalAmount(updatedTotal); // Update the state
    setRemainingAmount(updatedRemaining);

    // Update the JSON file with new values (this is an example, you'd need to write the changes to the file)
    budgetData.totalAmount = updatedTotal;
    budgetData.remainingAmount = updatedRemaining;
  };

  const handleRemove = () => {
    const updatedTotal = totalAmount - 100;
    const updatedRemaining = remainingAmount - 100;
    setTotalAmount(updatedTotal); // Update the state
    setRemainingAmount(updatedRemaining);

    // Update the JSON file with new values (this is an example, you'd need to write the changes to the file)
    budgetData.totalAmount = updatedTotal;
    budgetData.remainingAmount = updatedRemaining;
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

        {/* Add/Delete Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
            <Icon
              name="add-circle-outline"
              size={screenWidth * 0.06} // Slightly smaller button size
              color="#00a000"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <Icon
              name="remove-circle-outline"
              size={screenWidth * 0.06} // Slightly smaller button size
              color="#ff0000"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditionally render the graph based on the expanded state */}
      {isExpanded && (
        <View style={styles.graphContainer}>
          <LineChart
            data={{
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
                    500, 600, 700, 1000, 950, 1100, 900, 1200, 1300, 1250, 1400,
                    1500,
                  ],
                  color: () => `rgba(0, 160, 0, 0.4)`,
                  strokeWidth: 1,
                },
              ],
            }}
            width={screenWidth * 0.85}
            height={screenHeight * 0.2}
            chartConfig={{
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#f5f5f5",
              color: () => `rgba(0, 160, 0, 0.4)`,
              labelColor: () => `#333`,
              decimalPlaces: 0,
              strokeWidth: 1,
              propsForDots: { r: "2", strokeWidth: "0", stroke: "none" },
              propsForVerticalLabels: { fontSize: 8 },
              propsForHorizontalLabels: { fontSize: 8 },
            }}
            bezier
            withVerticalLines={false}
            withHorizontalLines={false}
            withHorizontalLabels={true}
            style={styles.graphStyle}
          />
        </View>
      )}

      {/* Expand/Collapse Indicator */}
      <Icon
        name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
        size={screenWidth * 0.04}
        color="#333"
        style={styles.expandCollapseIcon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: screenHeight * 0.005,
    paddingHorizontal: screenWidth * 0.03,
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: screenHeight * 0.005,
  },
  totalSavedText: {
    fontSize: screenWidth * 0.045,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    color: "#00a000",
    fontWeight: "bold",
  },
  remainingAmount: {
    color: "#ff0000",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  addButton: {
    marginRight: screenWidth * 0.015,
  },
  removeButton: {
    marginLeft: screenWidth * 0.015,
  },
  graphStyle: {
    paddingBottom: 12,
    borderRadius: 10,
  },
  graphContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  expandCollapseIcon: {
    alignSelf: "center",
    marginTop: screenHeight * 0.005,
  },
});
