// /app/budget/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import BudgetHeader from "@/components/Budget/BudgetHeader"; // Import BudgetHeader component
import BudgetComponents from "@/components/Budget/BudgetComponents"; // Updated path for BudgetComponents container
import BudgetEditModal from "@/components/Budget/BudgetEditModal"; // Updated path for BudgetEditModal component
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons for add button
import * as FileSystem from "expo-file-system"; // For reading the JSON file (only for mobile)
import { writeBudgetData } from "@/utils/budgetData"; // Function to update the JSON file
import AsyncStorage from "@react-native-async-storage/async-storage"; // For web storage

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const BUDGET_FILE_PATH = `${FileSystem.documentDirectory}budgetData.json`; // Path to the budgetData JSON file (for mobile)

// Define a type for modalData
interface ModalData {
  title: string;
  allocatedAmount: number;
  targetAmount: number;
  targetDate: string;
  type: "Goal" | "Want" | "EmergencyFund"; // Correct type here
  index?: number; // Optional index
}

interface BudgetComponentData {
  title: string;
  allocatedAmount: number;
  targetAmount: number;
  targetDate: string;
  type: "Goal" | "Want" | "EmergencyFund"; // Correct type here
}

export default function BudgetPage(): JSX.Element {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState<boolean>(false); // State to manage the header's expand/collapse
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State for modal visibility
  const [modalData, setModalData] = useState<ModalData | null>(null); // Data for the currently editing component
  const [isNewGoal, setIsNewGoal] = useState<boolean>(false); // State for adding a new goal
  const [totalAmount, setTotalAmount] = useState<number>(0); // Dynamically get totalAmount from JSON
  const [remainingAmount, setRemainingAmount] = useState<number>(0); // Initial value for remainingAmount
  const [components, setComponents] = useState<BudgetComponentData[]>([]); // Initialize components state

  // Function to load data from the JSON file for mobile
  const loadBudgetDataMobile = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(BUDGET_FILE_PATH);
      if (fileExists.exists) {
        const data = await FileSystem.readAsStringAsync(BUDGET_FILE_PATH);
        const parsedData = JSON.parse(data);
        setTotalAmount(parsedData.totalAmount || 0);
        parsedData.goals = parsedData.goals || [];
        setComponents(
          parsedData.goals.map((goal: any) => ({
            ...goal,
            type: goal.type as "Goal" | "Want" | "EmergencyFund", // Ensure type matches
          }))
        );
      } else {
        console.log("Budget data file not found");
      }
    } catch (error) {
      console.error("Error reading budget data:", error);
    }
  };

  // Function to load data from AsyncStorage for web
  const loadBudgetDataWeb = async () => {
    try {
      const data = await AsyncStorage.getItem("budgetData");
      if (data) {
        const parsedData = JSON.parse(data);
        setTotalAmount(parsedData.totalAmount);
        setComponents(
          parsedData.goals.map((goal: any) => ({
            ...goal,
            type: goal.type as "Goal" | "Want" | "EmergencyFund", // Ensure type matches
          }))
        );
      }
    } catch (error) {
      console.error("Error reading budget data from AsyncStorage:", error);
    }
  };

  // Call the load function when the component mounts based on the platform
  useEffect(() => {
    if (Platform.OS === "web") {
      loadBudgetDataWeb();
    } else {
      loadBudgetDataMobile();
    }
  }, []);

  // Calculate the remainingAmount dynamically
  useEffect(() => {
    const remaining =
      totalAmount -
      components.reduce(
        (allocatedSum, component) => allocatedSum + component.allocatedAmount,
        0
      );
    setRemainingAmount(remaining);
  }, [totalAmount, components]);

  // Function to write updated components to the JSON file for mobile
  const updateJsonFileMobile = async () => {
    const updatedData = {
      totalAmount, // Save the updated total amount
      goals: components,
    };
    try {
      await writeBudgetData(updatedData); // Write the data for mobile
    } catch (error) {
      console.error("Error updating budget data on mobile:", error);
    }
  };

  // Function to write updated components to AsyncStorage for web
  const updateJsonFileWeb = async () => {
    const updatedData = {
      totalAmount, // Save the updated total amount
      goals: components,
    };
    try {
      await AsyncStorage.setItem("budgetData", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error updating budget data in AsyncStorage:", error);
    }
  };

  // Function to update the JSON file based on the platform
  const updateJsonFile = () => {
    if (Platform.OS === "web") {
      updateJsonFileWeb();
    } else {
      updateJsonFileMobile();
    }
  };

  // Function to handle adding an amount
  const handleAddAmount = (index: number): void => {
    const updatedComponents = [...components];
    updatedComponents[index].allocatedAmount += 100; // Add 100 for example
    setComponents(updatedComponents);

    // Update the JSON file
    updateJsonFile();
  };

  // Function to handle reducing an amount
  const handleReduceAmount = (index: number): void => {
    const updatedComponents = [...components];
    if (updatedComponents[index].allocatedAmount > 0) {
      updatedComponents[index].allocatedAmount -= 100; // Reduce 100 for example
      setComponents(updatedComponents);

      // Update the JSON file
      updateJsonFile();
    }
  };

  // Function to handle deleting a component
  const handleDeleteComponent = (index: number): void => {
    const updatedComponents = components.filter((_, i) => i !== index);
    setComponents(updatedComponents);

    // Update the JSON file
    updateJsonFile();
  };

  // Function to open the modal for editing
  const handleEditComponent = (index: number): void => {
    setIsNewGoal(false);
    setModalData({ ...components[index], index } as ModalData); // Pass index to modal
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

    // Update the JSON file
    updateJsonFile();

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
      type: "Goal", // Default to "Goal" for new entries
    });
    setIsNewGoal(true);
    setIsModalVisible(true);
  };

  // Function to handle editing the total amount
  const handleEditTotalAmount = (newTotalAmount: number): void => {
    setTotalAmount(newTotalAmount); // Update totalAmount state

    // Update the JSON file
    updateJsonFile();
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
          totalAmount={totalAmount} // Get totalAmount from JSON
          remainingAmount={remainingAmount} // Dynamically calculated remainingAmount
          onEditAmount={handleEditTotalAmount} // Handle edit for totalAmount
          budgetData={{ totalAmount, goals: components }}
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
            type: component.type as "Goal" | "Want" | "EmergencyFund", // Ensure the correct type is passed
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
