import React, {useState, useEffect, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/axios';
import {event} from '../utils/eventEmitter';

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [state, setState] = useState({
    user: null,
    token: '',
    reportPost: [],
    safeAndUnsafePostTrigger: false,
    filteredCategories: [],
    locationFilter: 'all',
    postView: 'list',
  });

  useEffect(() => {
    event.addListener('logout', () => {
      setState({
        ...state,
        token: '',
        user: null,
        reportPost: [],
        filteredCategories: [],
        locationFilter: null,
        postView: 'feed',
      });
      AsyncStorage.removeItem('auth-rn');
      AsyncStorage.removeItem('reportPost');
      AsyncStorage.removeItem('filteredCategories');
      AsyncStorage.removeItem('locationFilter');
      AsyncStorage.removeItem('postView');
    });
    const loadFromAsyncStorage = async () => {
      let data = await AsyncStorage.getItem('auth-rn');
      let reportPost = await AsyncStorage.getItem('reportPost');
      let filteredCategories = await AsyncStorage.getItem('filteredCategories');
      let locationFilter = await AsyncStorage.getItem('locationFilter');
      let postView = await AsyncStorage.getItem('postView');
      filteredCategories = filteredCategories
        ? JSON.parse(filteredCategories)
        : [
            'Accessories',
            'Clothes',
            'Caffeine',
            'Food',
            'Snacks',
            'Water Bottles',
            'Swag Bag',
            'Phone Wallets',
            'Tickets',
            'Caffeine',
          ];

      locationFilter = locationFilter == null ? 'all' : locationFilter;
      const parsed = JSON.parse(data);
      if (parsed && parsed.user && parsed.token) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${parsed.token}`;
        setState({
          ...state,
          user: parsed.user,
          token: parsed.token,
          reportPost: JSON.parse(reportPost) || [],
          filteredCategories: filteredCategories || [],
          locationFilter: locationFilter,
          postView: postView || 'feed',
        });
      }
    };
    loadFromAsyncStorage();
  }, []);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
