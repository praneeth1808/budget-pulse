// components/Budget/BudgetHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { LineChart } from "react-native-chart-kit"; // Assuming you're using 'react-native-chart-kit' for graphs
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width; // Get screen width for responsive design
const screenHeight = Dimensions.get("window").height; // Get screen height for relative scaling

export default function BudgetHeader({
  isExpanded,
  toggleExpanded,
}: {
  isExpanded: boolean;
  toggleExpanded: () => void;
}) {
  const [totalAmount, setTotalAmount] = React.useState(1000); // Example initial total
  const [remainingAmount, setRemainingAmount] = React.useState(500); // Example remaining amount

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

  const handleAdd = () => {
    setTotalAmount(totalAmount + 100); // Add example value
    setRemainingAmount(remainingAmount + 100); // Add the same value to remaining
  };

  const handleRemove = () => {
    setTotalAmount(totalAmount - 100); // Remove example value
    setRemainingAmount(remainingAmount - 100); // Remove the same value from remaining
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
  buttonContainer: {
    flexDirection: "row",
  },
  addButton: {
    marginRight: screenWidth * 0.015, // Reduced button margin
  },
  removeButton: {
    marginLeft: screenWidth * 0.015, // Reduced button margin
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
});
