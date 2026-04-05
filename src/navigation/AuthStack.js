import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

import SignIn from "../screens/signin";
import SignUp from "../screens/signup";
import LegalDocumentScreen from "../screens/LegalDocumentScreen";
import Onboarding from "../screens/Onboarding";

const Stack = createStackNavigator();

export default AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="onboarding"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="onboarding" component={Onboarding} />
      <Stack.Screen name="signin" component={SignIn} />
      <Stack.Screen name="signup" component={SignUp} />
      <Stack.Screen name="legalDocument" component={LegalDocumentScreen} />
    </Stack.Navigator>
  );
};
