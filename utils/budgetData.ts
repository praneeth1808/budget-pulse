// /utils/budgetData.ts

import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

const BUDGET_DATA_PATH = `${FileSystem.documentDirectory}budgetData.json`;

// Function to write updated budget data to the JSON file or localStorage
export async function writeBudgetData(data: any): Promise<void> {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string

  try {
    if (Platform.OS === "web") {
      // Use localStorage for the web
      localStorage.setItem("budgetData", jsonData);
    } else {
      // Use file system for native platforms
      await FileSystem.writeAsStringAsync(BUDGET_DATA_PATH, jsonData);
    }
    console.log("Budget data updated successfully.");
  } catch (error) {
    console.error("Error updating budget data:", error);
  }
}

// Function to read budget data from the JSON file or localStorage
export async function readBudgetData(): Promise<any> {
  try {
    if (Platform.OS === "web") {
      // Read from localStorage for the web
      const jsonData = localStorage.getItem("budgetData");
      return jsonData ? JSON.parse(jsonData) : null;
    } else {
      // Read from file system for native platforms
      const jsonData = await FileSystem.readAsStringAsync(BUDGET_DATA_PATH);
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error("Error reading budget data:", error);
    return null;
  }
}
