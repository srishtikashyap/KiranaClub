import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';


const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};


 function SwipeableNewsCard({ data, onDelete, onPin, pinnedItem }) {
  const [openRowKey, setOpenRowKey] = React.useState(null);
  const swipeListViewRef = useRef(null);
  

  const onRowOpen = (rowKey) => {
    if (openRowKey && openRowKey !== rowKey) {
      swipeListViewRef.current?.safeCloseOpenRow();
    }
    setOpenRowKey(rowKey);
  };

  const handlePin = (item) => {
    onPin(item);
    swipeListViewRef.current?.safeCloseOpenRow(); // Close the row after pinning
  };

  const handleDelete = (item) => {
    onDelete(item);
    swipeListViewRef.current?.safeCloseOpenRow(); // Close the row after deleting
  };

  const formattedTime = formatTime('2024-08-31T08:00:34Z');

  const renderItem = (data) => (
    <TouchableOpacity onPress={() => swipeListViewRef.current?.safeCloseOpenRow()} activeOpacity={1} style={{ flex: 1 }}>
      <View style={[styles.rowFront, { flex: 1 }]}>
        {pinnedItem && pinnedItem.id === data.item.id && (
          <View style={styles.pinnedLabel}>
            <Text style={styles.pinnedLabelText}>Pinned on Top</Text>
          </View>
        )}
        <View style={[styles.cardContainer, pinnedItem && pinnedItem.id === data.item.id ? styles.pinnedCard : {}]}>
          <View style={styles.header}>
            <Text style={styles.sourceText}>{data.item.source.name}</Text>
            <Text style={styles.timeText}>{formatTime(data.item.publishedAt)}</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text numberOfLines={2} style={styles.title}>{data.item.title}</Text>
            <Image source={{ uri: data.item.urlToImage }} style={styles.thumbnail} />
          </View>
          <Text style={styles.authorText}>{data.item.author}</Text>
        </View>
      </View>
    </TouchableOpacity>

  );

  const renderHiddenItem = (data) => (
    <View style={[styles.rowBack]}>
      <View style={[styles.columnContainer]}>
      <TouchableOpacity
           style={[styles.backRightBtn, styles.backRightBtnTop]}
          onPress={() => handleDelete(data.item)}
          activeOpacity={0.8}
        >
          <Image
            source={require('../images/delete.png')}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
         
          style={[styles.backRightBtn, styles.backRightBtnBottom]}
          onPress={() => handlePin(data.item)}
          activeOpacity={0.8}
        >
          <Image
            source={require('../images/pin.png')}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.backTextWhite}>Pin</Text>
        </TouchableOpacity>
      
      </View>
    </View>
  );


  const sortedData = pinnedItem ? [pinnedItem, ...data.filter(item => item.id !== pinnedItem.id)] : data;

  return (
    <SwipeListView
      ref={swipeListViewRef}
      showsVerticalScrollIndicator={false}
      data={sortedData}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      leftOpenValue={90}
      rightOpenValue={-115}
      disableRightSwipe
      onRowOpen={(rowKey) => onRowOpen(rowKey)}
      closeOnRowBeginSwipe
      closeOnScroll
    />
  );
}

export default React.memo(SwipeableNewsCard)

const styles = StyleSheet.create({
  rowFront: { 
    backgroundColor: 'white',
    marginVertical: 5,
    padding: 15,
  },
  rowBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'column',
    // paddingRight: 10,
  },
  columnContainer: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    height: '100%',
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: '50%',
  },
  backRightBtnTop: {
    backgroundColor: '#4BBDFC',
    borderTopLeftRadius: 20,
  },
  backRightBtnBottom: {
    backgroundColor: '#4BBDFC',
    borderBottomLeftRadius: 20,
    marginBottom: 20
  },
  backTextWhite: {
    color: '#FFF',
    // marginTop: 5,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  pinnedCard: {
    borderColor: '#ffeb3b',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sourceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText:{
    fontSize: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorText: {
    fontSize: 16,
    color: 'gray',
  },
  thumbnail: {
    width: 77,
    height: 77,
    borderRadius: 8,
    marginLeft: 20
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginBottom: 2,
  },
  pinnedLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffeb3b',
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    zIndex: 1,
    elevation: 2,
  },
  pinnedLabelText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

