import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { fetchHeadlines, getStoredHeadlines } from '../utils/newsService';
import SwipeableNewsCard from '../components/SwipableNewsCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewsList = () => {
  const [headlines, setHeadlines] = useState([]);
  const [batchSize, setBatchSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [pinnedItem, setPinnedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page,setPage] = useState(1)

  useEffect(() => {
    const loadHeadlines = async () => {
      try {
        const storedHeadlines = await getStoredHeadlines();
        if (storedHeadlines?.length > 0) {
          setHeadlines(storedHeadlines.slice(0, batchSize));
        } else {
          const fetchedHeadlines = await fetchHeadlines();
          setPage(prev => prev+1)
          setHeadlines(fetchedHeadlines.slice(0, batchSize));
        }
      } catch (error) {
        console.error('Error loading headlines:', error);
      }
    };
    loadHeadlines();
  }, [batchSize]);

  const loadMoreHeadlines = useCallback(async () => {
    if (!loading && hasMore) {
      setLoading(true);
      try {
        const storedHeadlines = await getStoredHeadlines();
        const newBatchSize = batchSize + 10; 
        setBatchSize(newBatchSize);
        const newHeadlines = storedHeadlines.slice(0, newBatchSize);
  
        if (newHeadlines.length > headlines.length) {
          setHeadlines(newHeadlines);
          setCurrentIndex(newBatchSize);
        } else {
          setHasMore(false);
          const fetchedHeadlines = await fetchHeadlines(page)
          let combinedHeadlines = [...storedHeadlines, ...fetchedHeadlines];
          await AsyncStorage.setItem('headlines', JSON.stringify(combinedHeadlines));
          setPage(prev => prev + 1)
        }
      } catch (error) {
        console.error('Error loading more headlines:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [batchSize, headlines.length, loading, hasMore]);


  const handleRefresh = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const storedHeadlines = await getStoredHeadlines();
        const fetchedHeadlines = await fetchHeadlines(page);
        setPage(prev => prev + 1)
        const newIndex = currentIndex + 100;
        let combinedHeadlines = [...storedHeadlines, ...fetchedHeadlines];
        if (pinnedItem) {
          combinedHeadlines = combinedHeadlines.filter((headline) => headline.title !== pinnedItem.title);
          combinedHeadlines.unshift(pinnedItem);
        }
  
        setHeadlines(combinedHeadlines.slice(0, batchSize)); 
  
        await AsyncStorage.setItem('headlines', JSON.stringify(combinedHeadlines));
        setCurrentIndex(newIndex);
        setHasMore(fetchedHeadlines.length > 0);
      } catch (error) {
        console.error('Error refreshing headlines:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  

  const handleDelete = (item) => {
    setHeadlines(headlines.filter((headline) => headline.title !== item.title));
  };

  const handlePin = (item) => {
    setPinnedItem(item);
    setHeadlines([item, ...headlines.filter((headline) => headline.title !== item.title)]);
  };

  const ItemSeparatorComponent = () => (
    <View style={styles.separator} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={{ width: 111, height: 31 }} source={require('../images/heading.png')} resizeMode="contain" />
        <TouchableOpacity onPress={handleRefresh}>
          <Image style={{ width: 28, height: 28 }} source={require('../images/refresh.png')} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      {headlines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={headlines}
          keyExtractor={(item, index) => index.toString()}
          // windowSize={15}
          renderItem={({ item }) => (
            <SwipeableNewsCard
              data={[item]}
              onDelete={handleDelete}
              onPin={handlePin}
            />
          )}
          onEndReached={loadMoreHeadlines}
          onEndReachedThreshold={0.8}
          ItemSeparatorComponent={ItemSeparatorComponent}
          // ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingBottom: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  separator: {
    height: 0.8,
    backgroundColor: '#ccc',
  },
});

export default NewsList;

