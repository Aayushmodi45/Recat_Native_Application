import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { LinearGradient } from "expo-linear-gradient";
import Cards from "./Cards";
import CollapsibleCards from "./CollapsibleCards";
import BarcodeGenerator from "./BarcodeGenerator";
import LocationPage from "./LocationPage";

const renderScene = SceneMap({
  cards: Cards,
  collapsible: CollapsibleCards,
  barcode: BarcodeGenerator,
  location: LocationPage,
});

const SwipeableTabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "cards", title: "Cards" },
    { key: "collapsible", title: "Collapsible" },
    { key: "barcode", title: "Barcode" },
    { key: "location", title: "Location" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <LinearGradient colors={["#4facfe", "#00f2fe"]} style={{ paddingBottom: 5 }}>
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: "#fff",
              height: 4,
              borderRadius: 2,
            }}
            style={{
              backgroundColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,
            }}
            labelStyle={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "none",
            }}
            tabStyle={{ paddingVertical: 10 }}
          />
        </LinearGradient>
      )}
    />
  );
};

export default SwipeableTabs;
