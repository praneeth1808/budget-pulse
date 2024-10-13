// app/index.tsx
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText"; // Themed text component
import { ThemedView } from "@/components/ThemedView"; // Themed view component for dark/light mode
import { HelloWave } from "@/components/HelloWave"; // Waving animation/icon for friendly greeting
import { useNavigation } from "@react-navigation/native"; // Navigation hook

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    // Navigate to the Budget section of the app
    navigation.navigate("budget/index");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo Section */}
        <Image
          source={require("@/assets/images/budget-pulse.png")} // Adjust with your app's logo
          style={styles.logo}
        />
        <View style={styles.introContainer}>
          <ThemedText type="title" style={styles.titleText}>
            Welcome to BudgetPulse! <HelloWave />
          </ThemedText>
        </View>

        {/* Budget Overview */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Take Control of Your Finances
          </ThemedText>
          <ThemedText type="default" style={styles.bodyText}>
            Our Budget app is a powerful tool designed to help you manage your
            finances. Create and manage **Goals**, allocate funds for **Wants**,
            and ensure you're always prepared with **Emergency Funds**. Whether
            you're saving for big purchases or planning for unexpected expenses,
            the budgeting tool makes it easy to track, allocate, and adjust your
            funds over time.
          </ThemedText>
        </View>

        {/* Key Features (Numbered List) */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Key Features
          </ThemedText>

          {/* Numbered List */}
          <View style={styles.listItem}>
            <ThemedText style={styles.bullet}>1.</ThemedText>
            <ThemedText type="default" style={styles.itemText}>
              Manage and categorize your expenses efficiently.
            </ThemedText>
          </View>
          <View style={styles.listItem}>
            <ThemedText style={styles.bullet}>2.</ThemedText>
            <ThemedText type="default" style={styles.itemText}>
              Set financial goals and track your progress.
            </ThemedText>
          </View>
          <View style={styles.listItem}>
            <ThemedText style={styles.bullet}>3.</ThemedText>
            <ThemedText type="default" style={styles.itemText}>
              Allocate funds for emergency situations.
            </ThemedText>
          </View>
          <View style={styles.listItem}>
            <ThemedText style={styles.bullet}>4.</ThemedText>
            <ThemedText type="default" style={styles.itemText}>
              Visualize your budget with charts and analytics.
            </ThemedText>
          </View>
        </View>

        {/* Why Budget with Us Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Why Budget with Us?
          </ThemedText>
          <ThemedText type="default" style={styles.bodyText}>
            Our mission is to provide a simple and intuitive budgeting solution
            that empowers you to take control of your finances. Whether you're
            just starting out or optimizing your spending, this app adapts to
            your needs and helps you stay financially fit.
          </ThemedText>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Get Started
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
    resizeMode: "contain",
  },
  introContainer: {
    flexDirection: "column",
    alignItems: "flex-start", // Align intro text to the left
    marginBottom: 20,
    width: "100%",
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left", // Left align title text
  },
  section: {
    marginBottom: 30,
    width: "100%",
    alignItems: "flex-start", // Align section content to the left
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left", // Left align section titles
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    textAlign: "left", // Ensure body text is left aligned
    paddingHorizontal: 15,
  },

  // List styles
  listItem: {
    flexDirection: "row",
    marginBottom: 10, // Adds space between list items
    alignItems: "center",
  },
  bullet: {
    fontSize: 15, // Font size for the bullet (number)
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 24,
  },

  getStartedButton: {
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#00a000",
    borderRadius: 25,
    alignSelf: "center", // Center align the button
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
