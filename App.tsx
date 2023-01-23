import React, {useEffect, useRef, useMemo, useState} from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import CallLog, {CallLogDetails} from './src/CallLog';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const App = () => {
  const [callLogs, setCallLogs] = useState<CallLogDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const ref = useRef<FlashList<CallLogDetails>>(null);

  const data = useMemo(() => {
    return callLogs.filter(
      item =>
        item.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [callLogs, searchQuery]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Logs Permission',
          message:
            'Super Calls App needs access to your call logs to view them elegantly. Please allow.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const res = await CallLog.fetchCallLogs();
        setCallLogs(res);
      }
    } catch (error) {
      console.log({error});
    }
  };

  const clearSearchBar = () => {
    setSearchQuery('');
    ref.current?.scrollToIndex({index: 0, animated: true});
  };

  const renderCallLogs: ListRenderItem<CallLogDetails> = ({item}) => {
    const icon =
      item.callDirection === 'INCOMING'
        ? 'phone-incoming'
        : item.callDirection === 'OUTGOING'
        ? 'phone-outgoing'
        : item.callDirection === 'MISSED'
        ? 'phone-missed'
        : 'phone-settings';

    const iconColor =
      item.callDirection === 'INCOMING'
        ? 'green'
        : item.callDirection === 'OUTGOING'
        ? 'blue'
        : item.callDirection === 'MISSED'
        ? 'red'
        : undefined;

    return (
      <View style={styles.logItemContainer}>
        <Text>{item.callerName}</Text>
        <Text style={styles.phoneNumberText}>{item.phoneNumber}</Text>
        <Text>{item.callDate}</Text>
        <Text>
          {item.callDuration.hr}h {item.callDuration.min}m{' '}
          {item.callDuration.sec}s
        </Text>
        <Text>
          <Icon name={icon} color={iconColor} size={16} /> {item.callDirection}
        </Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.searchBoxContainer}>
        <Icon name="account-search-outline" size={22} />
        <TextInput
          placeholder="Search by phone number or name"
          value={searchQuery}
          style={styles.textInput}
          onChangeText={setSearchQuery}
        />
        {!!searchQuery && (
          <TouchableOpacity activeOpacity={0.8} onPress={clearSearchBar}>
            <Icon name="close" size={22} />
          </TouchableOpacity>
        )}
      </View>
      <FlashList
        ref={ref}
        data={data}
        estimatedItemSize={116}
        renderItem={renderCallLogs}
        keyboardDismissMode="on-drag"
        keyExtractor={(_, index) => index.toString()}
      />
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  searchBoxContainer: {
    marginTop: 12,
    marginBottom: 5,
    marginHorizontal: 12,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },

  logItemContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  phoneNumberText: {
    fontWeight: '600',
  },
});
