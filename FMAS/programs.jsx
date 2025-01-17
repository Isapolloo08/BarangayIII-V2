import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function Programs({ navigation }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [programData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  const fetchProgramData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://brgyapp.lesterintheclouds.com/api/fetch_programs.php', {
        username: 'IT112-24-M',
        password: 'W2Bq@EV[SFEV',
      });

      console.log('API Response:', response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        const data = response.data.data;
        setProgramData(data);

        const years = [...new Set(data.map(program => new Date(program.startDate).getFullYear()))];
        setAvailableYears(years);

        if (!years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }

        setError(null);
      } else {
        setError('Unexpected response format or empty data');
        setProgramData([]);
      }
    } catch (error) {
      console.error('Error fetching program data:', error);
      setError('Error fetching data from server');
      setProgramData([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProgramData(); // Re-fetch data whenever the screen is focused
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.yearPickerContainer}>
        <Text style={styles.yearPickerLabel}>Select Year:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedYear(value)}
          items={availableYears.map(year => ({ label: year.toString(), value: year }))}
          value={selectedYear}
          style={pickerSelectStyles}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Programs List ({selectedYear})</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#710808" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View>
            {programData.length > 0 ? (
              programData
                .filter(program => new Date(program.startDate).getFullYear() === selectedYear)
                .map((program, index) => (
                  <View key={index} style={styles.programCard}>
                    <Text style={styles.programTitle}>{program.programName}</Text>
                    <Text style={styles.programDetails}>
                      Program: {program.programName} | Budget: ₱{program.budget}
                    </Text>

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => navigation.navigate('programdetail', { ...program })}
                      >
                        <Text style={styles.buttonText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
            ) : (
              <Text style={styles.cell}>No programs available for the selected year.</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#f0f0f0', padding: 20 },
yearPickerContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  marginHorizontal: 70,
  backgroundColor: '#fff',
  paddingHorizontal: 10,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#710808',
  width: '100%',
},
yearPickerLabel: {
  fontSize: 16,
  color: '#710808',
  fontWeight: 'bold',
  flex: 1,
},
yearPickerRightContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 2,
  justifyContent: 'flex-end',
},
selectedYearText: {
  fontSize: 16,
  color: '#710808',
  fontWeight: 'bold',
  marginRight: 10,
},
card: { 
  borderRadius: 10,
  marginBottom: 20, 
  marginHorizontal: 70,
  width: '100%',
},
title: { 
  fontSize:20, 
  fontWeight: 'bold', 
  color: '#710808', 
  marginBottom: 10 
  },
programCard: { 
  marginBottom: 10,
  padding: 15,
  backgroundColor: '#fff', 
  borderRadius: 8, 
  elevation: 2,
},
programTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#710808',
},
programDetails: {
  fontSize: 14,
  color: '#333',
  marginVertical: 5,
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: 10,
},
viewButton: {
  backgroundColor: '#710808',
  padding: 8,
  borderRadius: 5,
  minWidth: 80,
  marginHorizontal: 5,
},
buttonText: {
  color: '#fff',
  fontSize: 14,
  textAlign: 'center',
},
cell: {
  fontSize: 14,
  color: '#333',
},
errorText: {
  color: 'red',
  fontSize: 16,
  marginTop: 10,
},

});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#710808',
    borderRadius: 4,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#710808',
    borderRadius: 4,
    paddingRight: 30,
  },
});
