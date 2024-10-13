import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Using MaterialCommunityIcons for edit icon
import { LineChart } from "react-native-chart-kit"; // For graphs
import { Dimensions } from "react-native";
import * as FileSystem from "expo-file-system"; // For reading and saving files (mobile)
import * as DocumentPicker from "expo-document-picker"; // For mobile file upload
import * as Sharing from "expo-sharing";
import { DocumentPickerResult } from "expo-document-picker";

const isWeb = Platform.OS === "web";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function BudgetHeader({
  isExpanded,
  toggleExpanded,
  totalAmount,
  remainingAmount,
  onEditAmount,
  budgetData,
  onUpload, // Add the new prop to handle file uploads
}: {
  isExpanded: boolean;
  toggleExpanded: () => void;
  totalAmount: number;
  remainingAmount: number;
  onEditAmount: (newTotalAmount: number) => void;
  budgetData: any;
  onUpload: (newBudgetData: any) => void; // Handle the uploaded file
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newAmount, setNewAmount] = useState<string>(totalAmount.toString()); // Hold the new amount as a string for input
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State for upload/download modal

  // Effect to update newAmount whenever isEditing is triggered
  useEffect(() => {
    if (isEditing) {
      setNewAmount(totalAmount.toString());
    }
  }, [isEditing, totalAmount]);

  // Handle saving the edited total amount
  const handleSaveEdit = () => {
    const numericAmount = parseFloat(newAmount); // Convert the string to a number
    if (!isNaN(numericAmount)) {
      onEditAmount(numericAmount); // Pass the new total amount back to the parent component
    }
    setIsEditing(false);
  };

  // Function to download the budget data as a JSON file
  const handleDownload = async () => {
    const fileData = JSON.stringify(budgetData);

    if (isWeb) {
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "budgetData.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      try {
        const fileUri = FileSystem.documentDirectory + "budgetData.json";
        await FileSystem.writeAsStringAsync(fileUri, fileData, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/json",
            dialogTitle: "Download your budget data",
            UTI: "public.json",
          });
        }
      } catch (error) {
        console.error("Error saving the file:", error);
      }
    }
  };

  const handleUpload = async () => {
    if (isWeb) {
      // Handle file upload on web
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "application/json";
      fileInput.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const uploadedData = JSON.parse(e.target?.result as string);
              onUpload(uploadedData); // Pass the data to the parent component
            } catch (error) {
              console.error("Error parsing uploaded JSON:", error);
            }
          };
          reader.readAsText(file);
        }
      };
      fileInput.click();
    } else {
      // Handle file upload on mobile
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/json",
        });

        if (result && result.assets && result.assets.length > 0) {
          // Read the file content using the URI from the result
          const fileContent = await FileSystem.readAsStringAsync(
            result.assets[0].uri
          );
          try {
            const uploadedData = JSON.parse(fileContent);
            onUpload(uploadedData); // Pass the parsed JSON data to the parent component
          } catch (error) {
            console.error("Error parsing uploaded JSON:", error);
          }
        } else {
          console.log("DocumentPicker canceled or failed");
        }
      } catch (error) {
        console.error("Error picking document:", error);
      }
    }
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
        color: () => `rgba(0, 160, 0, 0.4)`,
        strokeWidth: 1,
      },
    ],
  };

  return (
    <TouchableOpacity
      onPress={toggleExpanded}
      activeOpacity={1}
      style={[
        styles.headerContainer,
        { height: isExpanded ? screenHeight * 0.35 : screenHeight * 0.15 },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.totalSavedText}>
          Total Saved: <Text style={styles.totalAmount}>${totalAmount}</Text> (
          <Text style={styles.remainingAmount}>${remainingAmount}</Text>)
        </Text>

        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialCommunityIcons
              name="briefcase-edit-outline"
              size={screenWidth * 0.06}
              color="#333"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <MaterialCommunityIcons
              name="file-upload-outline"
              size={screenWidth * 0.06}
              color="#333"
              style={styles.iconSpacing}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.graphContainer}>
          <LineChart
            data={data}
            width={screenWidth * 0.85}
            height={screenHeight * 0.2}
            chartConfig={{
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#f5f5f5",
              color: () => `rgba(0, 160, 0, 0.4)`,
              labelColor: () => `#333`,
              decimalPlaces: 0,
              strokeWidth: 1,
              propsForDots: { r: "2", strokeWidth: "0" },
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

      <Icon
        name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
        size={screenWidth * 0.04}
        color="#333"
        style={styles.expandCollapseIcon}
      />

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

      {isModalVisible && (
        <Modal transparent={true} visible={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Upload/Download Budget Data</Text>

              <View style={styles.uploadDownloadButtons}>
                <TouchableOpacity
                  style={[styles.uploadButton, styles.buttonSpacing]}
                  onPress={handleUpload} // Trigger the upload functionality
                >
                  <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={handleDownload}
                >
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.cancelButton, styles.centerCancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginLeft: screenWidth * 0.02,
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
  uploadDownloadButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#ffa500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  downloadButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centerCancelButton: {
    alignSelf: "center",
  },
  buttonSpacing: {
    marginRight: screenWidth * 0.02,
  },
});
