//components/Budget/BudgetComponent.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import icons for edit/delete
import { ProgressBar } from "react-native-paper"; // ProgressBar component
import { Dimensions } from "react-native";

interface BudgetComponentProps {
  title: string;
  allocatedAmount: number;
  targetAmount: number;
  targetDate: string;
  type: "Goal" | "Want" | "EmergencyFund";
  onAddAmount: () => void;
  onReduceAmount: () => void;
  onDeleteComponent: () => void;
  onEditComponent: () => void; // New edit function
}

export default function BudgetComponent({
  title,
  allocatedAmount,
  targetAmount,
  targetDate,
  type,
  onAddAmount,
  onReduceAmount,
  onDeleteComponent,
  onEditComponent, // Add edit function
}: BudgetComponentProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Determine color based on component type
  const getColor = (): string => {
    switch (type) {
      case "Goal":
        return "#00a000"; // Green for Goals
      case "Want":
        return "#ff0000"; // Red for Wants
      case "EmergencyFund":
        return "#808080"; // Gray for Emergency Funds
      default:
        return "#000";
    }
  };

  // Calculate progress for the progress bar
  const progress: number = allocatedAmount / targetAmount;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEditComponent}>
            <Icon name="create-outline" size={22} color={getColor()} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeleteComponent}>
            <Icon name="trash-outline" size={22} color={getColor()} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.amountText}>
        Allocated: ${allocatedAmount} / Target: ${targetAmount}
      </Text>
      <Text style={styles.dateText}>Target Date: {targetDate}</Text>

      <ProgressBar
        progress={progress}
        color={getColor()}
        style={styles.progressBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#ffffffa8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    gap: 15,
  },
  amountText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  dateText: {
    marginTop: 5,
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginTop: 10,
  },
});
