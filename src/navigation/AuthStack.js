import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

import SignIn from "../screens/signin";
import SignUp from "../screens/signup";

const Stack = createStackNavigator();

export default AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="signin" component={SignIn} />
      <Stack.Screen name="signup" component={SignUp} />
    </Stack.Navigator>
  );
};
