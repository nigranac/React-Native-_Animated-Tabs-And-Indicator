import React, {useRef} from 'react';
import {
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  FlatList,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
const {width, height} = Dimensions.get('screen');

const images = {
  man:
    'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  women:
    'https://images.pexels.com/photos/3746210/pexels-photo-3746210.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  kids:
    'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  parents:
    'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  help:
    'https://images.pexels.com/photos/4557403/pexels-photo-4557403.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
};
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef(),
}));

const Tab = React.forwardRef(({item, onItemPress}, ref) => {
  // console.log(item)
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Text
          style={{
            color: 'white',
            fontSize:84 / data.length,
            fontWeight: '800',
            textTransform: 'uppercase',
          }}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const Indicator = ({measures, scrollX}) => {
  const inputRange = data.map((_, i) => i * width);
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measures) => measures.width),
  });
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measures) => measures.x),
  });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: 4,
        backgroundColor: 'white',
        bottom: -10,
        left: 0,
        width: indicatorWidth,
        transform: [
          {
            translateX,
          },
        ],
      }}
    />
  );
};

const Tabs = ({data, scrollX, onItemPress}) => {
  const [measures, setMeasures] = React.useState([]);
  const containerRef = React.useRef();
  React.useEffect(() => {
    const m = [];
    data.forEach((item) => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({
            x,
            y,
            width,
            height,
          });

          if (m.length === data.length) {
            setMeasures(m);
          }
        },
      );
    });
  }, []);

  return (
    <View style={{position: 'absolute', top: 100, width}}>
      <View
        ref={containerRef}
        style={{justifyContent: 'space-evenly', flex: 1, flexDirection: 'row'}}>
        {data.map((item, index) => {
          return (
            <Tab
              key={item.key}
              item={item}
              ref={item.ref}
              onItemPress={() => {
                onItemPress(index);
              }}
            />
          );
        })}
      </View>
      {measures.length > 0 && (
        <Indicator measures={measures} scrollX={scrollX} />
      )}
    </View>
  );
};

const App = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const ref = React.useRef();
  const onItemPress = React.useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width,
    });
  });
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => item.key}
        pagingEnabled
        horizontal
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <View style={{width, height}}>
              <Image
                source={{uri: item.image}}
                style={{flex: 1, resizeMode: 'cover'}}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {backgroundColor: 'rgba(0,0,0,0.3)'},
                ]}
              />
            </View>
          );
        }}
      />

      <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
