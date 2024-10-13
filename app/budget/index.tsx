// /app/budget/index.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import BudgetHeader from "@/components/Budget/BudgetHeader"; // Import BudgetHeader component
import BudgetComponents from "@/components/Budget/BudgetComponents"; // Updated path for BudgetComponents container
import BudgetEditModal from "@/components/Budget/BudgetEditModal"; // Updated path for BudgetEditModal component
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons for add button
import budgetData from "@/assets/data/budgetData.json"; // Import the JSON file
import { writeBudgetData } from "@/utils/budgetData"; // Function to update the JSON

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// Define a type for modalData
interface ModalData {
  title: string;
  allocatedAmount: number;
  targetAmount: number;
  targetDate: string;
  type: "Goal" | "Want" | "EmergencyFund";
  index?: number; // Optional index
}

export default function BudgetPage(): JSX.Element {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState<boolean>(false); // State to manage the header's expand/collapse
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State for modal visibility
  const [modalData, setModalData] = useState<ModalData | null>(null); // Data for the currently editing component
  const [isNewGoal, setIsNewGoal] = useState<boolean>(false); // State for adding a new goal

  const [components, setComponents] = useState(budgetData.goals); // Set the initial components from the JSON data
  const [totalAmount, setTotalAmount] = useState<number>(
    budgetData.totalAmount
  );
  const [remainingAmount, setRemainingAmount] = useState<number>(
    budgetData.remainingAmount
  );

  // Function to update the JSON file whenever the total or remaining amounts change
  const updateBudgetData = () => {
    const updatedData = {
      totalAmount,
      remainingAmount,
      goals: components,
    };
    writeBudgetData(updatedData); // Update the JSON file
  };

  useEffect(() => {
    updateBudgetData(); // Call this function whenever there is an update
  }, [totalAmount, remainingAmount, components]);

  // Function to handle editing the total amount
  const handleEditAmount = (newTotalAmount: number): void => {
    const difference = newTotalAmount - totalAmount;
    setTotalAmount(newTotalAmount);
    setRemainingAmount(remainingAmount + difference);
  };

  // Function to handle adding an amount
  const handleAddAmount = (index: number): void => {
    const updatedComponents = [...components];
    updatedComponents[index].allocatedAmount += 100; // Add 100 for example
    setComponents(updatedComponents);

    // Update remaining amount
    setRemainingAmount(remainingAmount - 100);
  };

  // Function to handle reducing an amount
  const handleReduceAmount = (index: number): void => {
    const updatedComponents = [...components];
    if (updatedComponents[index].allocatedAmount > 0) {
      updatedComponents[index].allocatedAmount -= 100; // Reduce 100 for example
      setComponents(updatedComponents);

      // Update remaining amount
      setRemainingAmount(remainingAmount + 100);
    }
  };

  // Function to handle deleting a component
  const handleDeleteComponent = (index: number): void => {
    const updatedComponents = components.filter((_, i) => i !== index);
    setComponents(updatedComponents);
  };

  // Function to open the modal for editing
  const handleEditComponent = (index: number): void => {
    setIsNewGoal(false);
    setModalData({ ...components[index], index } as ModalData); // Add type assertion
    setIsModalVisible(true);
  };

  // Function to save the updated component
  const handleSaveComponent = (updatedComponent: ModalData): void => {
    if (isNewGoal) {
      setComponents([...components, updatedComponent]); // Add a new goal
    } else if (updatedComponent.index !== undefined) {
      const updatedComponents = [...components];
      updatedComponents[updatedComponent.index] = updatedComponent;
      setComponents(updatedComponents); // Save edited component
    }
    setIsModalVisible(false);
    setIsNewGoal(false);
  };

  // Function to handle adding a new goal
  const handleAddNewGoal = (): void => {
    setModalData({
      title: "New Goal",
      allocatedAmount: 0,
      targetAmount: 1000,
      targetDate: "Dec 2025",
      type: "Goal",
    });
    setIsNewGoal(true);
    setIsModalVisible(true);
  };

  // Toggle the expand/collapse state for the header
  const toggleHeader = (): void => {
    setIsHeaderExpanded(!isHeaderExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Use BudgetHeader component and pass the expanded state */}
      <View
        style={{
          height: isHeaderExpanded ? screenHeight * 0.29 : screenHeight * 0.07, // Adjust height dynamically
        }}
      >
        <BudgetHeader
          isExpanded={isHeaderExpanded}
          toggleExpanded={toggleHeader}
          totalAmount={totalAmount}
          remainingAmount={remainingAmount}
          onEditAmount={handleEditAmount} // Pass the editing function
        />
      </View>

      {/* Add new goal button */}
      <View style={styles.addGoalContainer}>
        <TouchableOpacity
          onPress={handleAddNewGoal}
          style={styles.addGoalButton}
        >
          <Icon name="add-circle-outline" size={20} color="#00a000" />
          <Text style={styles.addGoalText}>Add New Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom section adjusts dynamically based on header height */}
      <View
        style={[
          styles.budgetContent,
          {
            height: isHeaderExpanded ? screenHeight * 0.6 : screenHeight * 0.8,
            width: screenWidth,
          },
        ]}
      >
        {/* Display budget components */}
        <BudgetComponents
          components={components.map((component, index) => ({
            title: component.title,
            allocatedAmount: component.allocatedAmount,
            targetAmount: component.targetAmount,
            targetDate: component.targetDate,
            type: component.type as "Goal" | "Want" | "EmergencyFund",
            onAddAmount: () => handleAddAmount(index),
            onReduceAmount: () => handleReduceAmount(index),
            onDeleteComponent: () => handleDeleteComponent(index),
            onEditComponent: () => handleEditComponent(index), // Edit component
          }))}
        />
      </View>

      {/* Modal for editing or adding components */}
      {isModalVisible && modalData && (
        <BudgetEditModal
          componentData={modalData}
          onSave={handleSaveComponent}
          onClose={() => setIsModalVisible(false)} // Close modal when clicking outside or on X
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e4e4e4", // Set background to a light gray tone
    paddingTop: 70, // Padding to prevent overlap with the top status bar
  },
  budgetContent: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    elevation: 5, // Shadow for Android
  },
  addGoalContainer: {
    flexDirection: "row", // Aligns icon and text in the same line
    justifyContent: "flex-end", // Aligns the content to the right
    alignItems: "center", // Centers the items vertically
    marginTop: 15, // Adjust as needed for spacing
    paddingRight: 20, // Adds padding on the right for alignment
  },
  addGoalButton: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Vertically center the text with the icon
  },
  addGoalText: {
    fontSize: 11, // Reduced font size for the text
    color: "#00a000",
    marginLeft: 5, // Space between the icon and text
    fontWeight: "bold",
  },
});
