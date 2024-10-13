//components/Budget/BudgetComponents.tsx
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import BudgetComponent from "@/components/Budget/BudgetComponent"; // Import the individual budget component

// Define the props for each budget component data
interface BudgetComponentData {
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

// Define the props for the BudgetComponents container
interface BudgetComponentsProps {
  components: BudgetComponentData[];
}

export default function BudgetComponents({
  components,
}: BudgetComponentsProps): JSX.Element {
  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {components
        .sort((a, b) => {
          // Sorting logic to ensure goals come first, followed by wants, then emergency funds
          const order = { Goal: 1, Want: 2, EmergencyFund: 3 };
          return order[a.type] - order[b.type];
        })
        .map((component, index) => (
          <View key={index} style={styles.componentContainer}>
            <BudgetComponent
              key={index}
              title={component.title}
              allocatedAmount={component.allocatedAmount}
              targetAmount={component.targetAmount}
              targetDate={component.targetDate}
              type={component.type}
              onAddAmount={component.onAddAmount}
              onReduceAmount={component.onReduceAmount}
              onDeleteComponent={component.onDeleteComponent}
              onEditComponent={component.onEditComponent} // Pass edit function
            />
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: "100%",
    marginBottom: 70,
  },
  componentContainer: {
    width: "100%",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    elevation: 3,
  },
});
