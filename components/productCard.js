import {
  React,
  globalStyle,
  useState,
  useDispatch,
  addProduct,
} from "../utils/allImports";
import { View, Text, Image, Animated } from "react-native";
export default function ProductCard({
  name,
  image,
  price,
  id,
  discount,
  buying_price_after_discount,
}) {
  const dispatch = useDispatch();
  const value = useState(new Animated.Value(1))[0];
  const pushIn = () => {
    return Animated.timing(value, {
      toValue: 0.6,
      duration: 100,
      useNativeDriver: true,
    });
  };
  const triggerAnimation = () => {
    Animated.sequence([pushIn(), pushOut()]).start();
  };
  const pushOut = () => {
    return Animated.timing(value, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    });
  };
  const animationStyle = () => {
    return {
      // opacity: value,
      transform: [
        {
          scale: value.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          }),
        },
      ],
    };
  };
  const styles = globalStyle();
  return (
    <Animated.View
      style={[styles.productCardStyle, animationStyle()]}
      onTouchStart={() => {
        triggerAnimation();
        dispatch(
          addProduct({
            id,
            name,
            price: price * 1,
            discount,
            buying_price_after_discount,
          })
        );
      }}
    >
      <View style={styles.productCardImageStyle}>
        <Image
          source={{ uri: image ? image : "" }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <Text style={styles.productCardTitleStyle}>{name}</Text>
      <Text style={styles.productCardPriceStyle}>
        {price ? (price * 1).toFixed(3) : ""}{" "}
        <Text style={[styles.tableTitleTextStyle, { fontSize: 9 }]}>SAR</Text>
      </Text>
    </Animated.View>
  );
}
