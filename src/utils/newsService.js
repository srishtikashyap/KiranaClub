import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '6d18ba5a45664082a979c9a681fe151f';
const API_URL = `https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&apiKey=${API_KEY}`;

export const fetchHeadlines = async (page) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&apiKey=${API_KEY}&page=${page}`);
    const headlines = response.data.articles;
    await AsyncStorage.setItem('headlines', JSON.stringify(headlines));
    return headlines;
  } catch (error) {
    console.log(error.response.data);
    return [];
  }
};

export const getStoredHeadlines = async () => {
  try {
    const headlines = await AsyncStorage.getItem('headlines');
    return headlines ? JSON.parse(headlines) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const resetHeadlines = async () => {
  await AsyncStorage.removeItem('headlines');
  return fetchHeadlines();
};
