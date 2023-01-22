import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CallLogs from '../screens/CallLogs';
import LogDetails from '../screens/LogDetails';
import {RootStackParams} from './types/types';

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default AppNavigation;

const {Screen, Navigator} = createNativeStackNavigator<RootStackParams>();

const RootStack = () => {
  return (
    <Navigator>
      <Screen name="CallLogs" component={CallLogs} />
      <Screen name="LogDetails" component={LogDetails} />
    </Navigator>
  );
};
