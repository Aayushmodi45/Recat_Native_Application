import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Cards from './Cards';
import CollapsibleCards from './CollapsibleCards';
import BarcodeGenerator from './BarcodeGenerator';
import LocationPage from './LocationPage';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const CustomTabLabel = ({ title, focused }) => (
  <Text style={[styles.tabLabel, focused && styles.activeLabel]}>{title}</Text>
);

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Cards') iconName = 'view-module';
          else if (route.name === 'CollapsibleCards') iconName = 'expand-more';
          else if (route.name === 'BarcodeGenerator') iconName = 'qr-code-scanner';
          else if (route.name === 'LocationPage') iconName = 'place'; 

          return (
            <View style={focused ? styles.activeTab : null}>
              <Icon name={iconName} size={size + 5} color={color} />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => <CustomTabLabel title={route.name} focused={focused} />,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Cards" component={Cards} />
      <Tab.Screen name="CollapsibleCards" component={CollapsibleCards} />
      <Tab.Screen name="BarcodeGenerator" component={BarcodeGenerator} />
      <Tab.Screen name="LocationPage" component={LocationPage} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: 65,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginTop: 2,
  },
  activeLabel: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default TabNavigation;
