//components/Budget/BudgetEditModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import icons for actions

interface BudgetEditModalProps {
  componentData: {
    title: string;
    allocatedAmount: number;
    targetAmount: number;
    targetDate: string;
    type: "Goal" | "Want" | "EmergencyFund";
  };
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function BudgetEditModal({
  componentData,
  onSave,
  onClose,
}: BudgetEditModalProps): JSX.Element {
  const [title, setTitle] = useState<string>(componentData.title);
  const [allocatedAmount, setAllocatedAmount] = useState<number>(
    componentData.allocatedAmount
  );
  const [targetAmount, setTargetAmount] = useState<number>(
    componentData.targetAmount
  );
  const [targetDate, setTargetDate] = useState<string>(
    componentData.targetDate
  );
  const [type, setType] = useState<"Goal" | "Want" | "EmergencyFund">(
    componentData.type
  );

  const handleSave = (): void => {
    onSave({ title, allocatedAmount, targetAmount, targetDate, type });
  };

  return (
    <Modal transparent={true} visible={true} animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {componentData.title ? `Edit ${title}` : "Add New Goal"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter Title"
            />
          </View>

          {/* Allocated Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Allocated Amount</Text>
            <TextInput
              style={styles.input}
              value={allocatedAmount.toString()}
              keyboardType="numeric"
              onChangeText={(value) => setAllocatedAmount(Number(value))}
            />
          </View>

          {/* Target Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Amount</Text>
            <TextInput
              style={styles.input}
              value={targetAmount.toString()}
              keyboardType="numeric"
              onChangeText={(value) => setTargetAmount(Number(value))}
            />
          </View>

          {/* Target Date Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Date</Text>
            <TextInput
              style={styles.input}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="Dec 2025"
            />
          </View>

          {/* Type Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeOptions}>
              <TouchableOpacity
                onPress={() => setType("Goal")}
                style={[
                  styles.typeButton,
                  type === "Goal" && styles.typeButtonSelected,
                ]}
              >
                <Text style={styles.typeButtonText}>Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType("Want")}
                style={[
                  styles.typeButton,
                  type === "Want" && styles.typeButtonSelected,
                ]}
              >
                <Text style={styles.typeButtonText}>Want</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType("EmergencyFund")}
                style={[
                  styles.typeButton,
                  type === "EmergencyFund" && styles.typeButtonSelected,
                ]}
              >
                <Text style={styles.typeButtonText}>Emergency Fund</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  typeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  typeButtonSelected: {
    backgroundColor: "#00a000", // Selected button color
  },
  typeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#00a000",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
