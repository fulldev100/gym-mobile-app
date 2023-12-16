import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import LoginPage from "./Page/Auth/LoginPage";
import RegistrationPage from "./Page/Auth/RegistrationPage";
// import Workouts from "./Page/App/StaffMember/staffmemberlist.js";
import Dashboard from "./Page/App/Dashboard";

import staffDashboard from "./Page/App/Staff/staffDashboard";
// import staffDrawer from "./Page/App/Staff/StaffdrawerStack";
import DropdownAlert from "react-native-dropdownalert";
import NetInfo from "@react-native-community/netinfo";
// import { createDrawerNavigator } from "react-navigation-drawer";
import ViewProducts from "./Page/App/Products/myProducts";
import ProductsList from "./Page/App/Products/productList";
import History from "./Page/App/History/history";
import PersonalEntry from "./Page/App/Entry/myEntry";

// Simplify APP
import myHome from "./Page/App/Home/myHome";
import location from "./Page/App/Location/location";

// For Admin
import myAdminDashboard from "./Page/App/Admin/Home/myAdminDashboard";
import myEntry from "./Page/App/Admin/Entry/myEntry";
import mySale from "./Page/App/Admin/Sale/mySale";
import failEntry from "./Page/App/Admin/Fail/failEntry";

class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this.state = {
      Role_name: "",
      connection_status: true,
      connection_type: null,
      connection_net_reachable: false,
      connection_wifi_enabled: false,
      connection_details: null,
    };
    this._bootstrapAsync();
  }

  async componentDidMount() {
    // internet not connected alert code
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this._handleConnectivityChange
    );

    if (!this.state.connection_status) {
      this.dropdown.alertWithType(
        "error",
        "OH!!",
        "Sorry you're not connected to the Internet"
      );
    }
    this._bootstrapAsync();
  }

  _handleConnectivityChange = async (state) => {
    this.setState({
      connection_status: state.isConnected,
      connection_type: state.type,
      connection_net_reachable: state.isInternetReachable,
      connection_wifi_enabled: state.isWifiEnabled,
      connection_details: state.details,
    });
    if (this.state.connection_status) {
      const userToken = await SecureStore.getItemAsync("access_token");
    }
  };

  _bootstrapAsync = async () => {
    const userToken = await SecureStore.getItemAsync("access_token");
    const role_name = await SecureStore.getItemAsync("role_name");
    if (this.state.connection_status) {
      if (userToken) {
        if (role_name == "member") {
          this.props.navigation.navigate("myHome");
        } else if (role_name == "staff_member") {
          this.props.navigation.navigate("Staff");
        } else if (role_name == "administrator") {
          this.props.navigation.navigate("myAdminDashboard");
        } else {
          this.props.navigation.navigate("Auth");
        }
      } else {
        this.props.navigation.navigate("Auth");
      }
    }
  };

  render() {
    const { loader, mobile, connection_status } = this.state;
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" color="#0f4471" />
        {connection_status == false ? (
          <DropdownAlert ref={(ref) => (this.dropdown = ref)} />
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}

const DrawerNavigator = createStackNavigator(
  {
    // For normal user
    products: ViewProducts,
    ProductsList: ProductsList,
    personalEntry: PersonalEntry,
    history: History,
    myHome: myHome,
    location: location,

    // Administrator
    myAdminDashboard: myAdminDashboard,
    myEntry: myEntry,
    failEntry: failEntry,
    mySale: mySale
  },
  {
    headerMode: "none",
    // initialRouteName: "myHome",
    // contentComponent: CustomSideBar,

  }
);

const StaffStack = createStackNavigator(
  {
     staffDashboard: staffDashboard,
  },
  {
    headerMode: "none",
    initialRouteName: "staffDashboard",
    contentComponent: myAdminDashboard,
  }
);

const AuthStack = createStackNavigator({
  LoginPage: LoginPage,
  RegistrationPage: RegistrationPage,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: DrawerNavigator,
      Staff: StaffStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: "AuthLoading",
    }
  )
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
