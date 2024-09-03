import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Text,ActivityIndicator } from 'react-native';
import { fetchHeadlines, getStoredHeadlines } from '../utils/newsService';
import SwipeableNewsCard from '../components/SwipableNewsCard';

const NewsList = () => {
  const [headlines, setHeadlines] = useState([]);
  const [batchSize, setBatchSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [pinnedItem, setPinnedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Keep track of the current index

  useEffect(() => {
    const loadHeadlines = async () => {
      try {
        const storedHeadlines = await getStoredHeadlines();
        if (storedHeadlines?.length > 0) {
          setHeadlines(storedHeadlines.slice(0, batchSize));
        } else {
          const fetchedHeadlines = await fetchHeadlines();
          setHeadlines(fetchedHeadlines.slice(0, batchSize));
        }
      } catch (error) {
        console.error('Error loading headlines:', error);
      }
    };
    loadHeadlines();
  }, [batchSize]);

  const loadMoreHeadlines = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const storedHeadlines = await getStoredHeadlines();
        const newBatchSize = batchSize + 10;
        setBatchSize(newBatchSize);
        setHeadlines(storedHeadlines.slice(0, newBatchSize));
      } catch (error) {
        console.error('Error loading more headlines:', error);
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

  const handleRefresh = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const storedHeadlines = await getStoredHeadlines();
        const newIndex = currentIndex + 100; // Update index to fetch the next 100 headlines
        setCurrentIndex(newIndex);
        const fetchedHeadlines = storedHeadlines.slice(newIndex, newIndex + 100);
        if (fetchedHeadlines.length > 0) {
          setHeadlines(fetchedHeadlines);
          setBatchSize(newIndex + 100); // Update batch size to reflect new data
        } else {
          console.log('No more headlines to fetch.');
        }
      } catch (error) {
        console.error('Error refreshing headlines:', error);
      } finally {
        setLoading(false);
      }
    }
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
          <Text style={styles.emptyText}>No headlines available</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={headlines}
          keyExtractor={(item, index) => index.toString()}
          windowSize={15}
          renderItem={({ item }) => (
            <SwipeableNewsCard
              data={[item]}
              onDelete={handleDelete}
              onPin={handlePin}
            />
          )}
          onEndReached={loadMoreHeadlines}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={ItemSeparatorComponent}
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
