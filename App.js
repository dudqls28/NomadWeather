import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Dimensions,ScrollView, View, ActivityIndicator} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
const { width: SCREEN_WIDTH }= Dimensions.get("window");
const API_KEY = "0763f6105b97334b1b8aef8cc2eefd8e";

const icons = {
  "Clouds" : "cloudy",
  "Clear" : "day-sunny",
  "Snow" : "snow",
  "Rain" : "rains",
  "Drizzle": "rain",
  "Thunderstorm": "lightning",
  "Atmosphere": "cloudy-gusts"
}
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days,setDays] = useState([]);
  const [ok,setOk] = useState(true);
  const getWeather = async() => {
    const { granted } =  await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude},{useGoogleMaps:false});
    console.log(location);
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    console.log(json);
    setDays(json.daily);
  };
  
  useEffect(() => {
    getWeather();
  },[]);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? 
          <View style={{...styles.day, alignItems:"center"}}>
            <ActivityIndicator
              color="white"
              style={{marginTop:10}}
              size="large">

            </ActivityIndicator>
          </View> 
          : 
            days.map((day,index) => (
              <View key={index} style={styles.day}>
                <View style={{flexDirection : "row" , 
                alignItems : "center" ,
                width:"100%",
                justifyContent : "space-between",
                
                 }}>
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
                </View>
                <Text style={styles.descrip}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            ))
          }
      </ScrollView>
      <StatusBar style="inverted" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  city:{
    flex: 1,
    justifyContent:"center",
    alignItems:"center"
  },
  cityName:{
    fontSize:50,
    fontWeight:"700",
    color:"white"
  },
  weather:{
  },
  day:{
    width:SCREEN_WIDTH,
    alignItems:"flex-start",
    paddingHorizontal : 20,
    color:"white"
  },
  temp:{
    marginTop:50,
    fontSize:100,
    color:"white"
  },
  descrip:{
    marginTop:-10,
    fontSize:30,
    color:"white",
    fontWeight:"500"
  },
  tinyText:{
    fontSize:20,
    marginTop: -5,
    fontSize: 25,
    color:"white"
  }
});
