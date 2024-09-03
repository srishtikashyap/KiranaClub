import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '4988b3c80f27417aa99fab14a28184dc';
const API_URL = `https://newsapi.org/v2/everything?q=tesla&from=2024-08-01&sortBy=publishedAt&apiKey=${API_KEY}`;

export const fetchHeadlines = async () => {
  try {
    const response = await axios.get(API_URL);
    const headlines = response.data.articles.slice(0, 100);
    await AsyncStorage.setItem('headlines', JSON.stringify(headlines));
    return headlines;
  } catch (error) {
    console.error(error);
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
