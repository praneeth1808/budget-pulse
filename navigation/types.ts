// navigation/types.ts

export type RootStackParamList = {
  home: undefined; // No parameters for "home"
  "budget/index": undefined; // No parameters for the budget route
  // Add other routes here if needed
};
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
