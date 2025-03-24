import { getAuth, FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { LoginManager, AccessToken, Settings } from "react-native-fbsdk-next";
import Toast from "react-native-toast-message";

export async function onFacebookButtonPress(navigation) {
  try {
    // Ensure Facebook SDK is initialized
    Settings.initializeSDK();

    // Request permissions
    const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);

    if (result.isCancelled) {
      console.log("User cancelled the login process");
      return;
    }

    // Get access token
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      console.log("Something went wrong obtaining access token");
      return;
    }

    // Authenticate with Firebase
    const auth = getAuth();
    const credential = FacebookAuthProvider.credential(data.accessToken);
    const userCredential = await signInWithCredential(auth, credential);

    if (userCredential.user) {
      Toast.show({
        type: "success",
        text1: "🎉 Facebook Login Successful!",
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "DrawerNavigator" }],
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "❌ Facebook Login Failed!",
      text2: error.message || "Something went wrong.",
    });
    console.error("Facebook login error:", error);
  }
}
