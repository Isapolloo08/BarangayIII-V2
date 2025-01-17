import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const CensusDetails = ({ route }) => {
  const { residentNum } = route.params;
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResidentDetails = async () => {
      try {
        const response = await axios.get(`http://brgyapp.lesterintheclouds.com/get_residents_details.php?residentID=${residentNum}`);
        
        if (response.data && response.data.resident) {
          setResident(response.data.resident);
        } else {
          setError('Resident not found');
        }
      } catch (error) {
        console.error('Error fetching resident details:', error.response || error.message);
        setError('Error fetching details');
      } finally {
        setLoading(false);
      }
    };

    if (residentNum) {
      fetchResidentDetails();
    }
  }, [residentNum]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.detailsContainer}>
          <Text style={styles.title}>Resident Details</Text>
          {/* Displaying all the resident's details */}
          <View style={styles.detailCard}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.detailText}>{resident.firstname} {resident.middlename} {resident.lastname} {resident.extensionName}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Sex</Text>
            <Text style={styles.detailText}>{resident.sex}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Birthdate</Text>
            <Text style={styles.detailText}>{resident.birthdate}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Birth Place</Text>
            <Text style={styles.detailText}>{resident.birthPlace}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Relationship</Text>
            <Text style={styles.detailText}>{resident.relationship}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.detailText}>{resident.householdID}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Civil Status</Text>
            <Text style={styles.detailText}>{resident.civilStatus}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Citizenship</Text>
            <Text style={styles.detailText}>{resident.citizenship}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Occupation</Text>
            <Text style={styles.detailText}>{resident.occupation}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Education Attainment</Text>
            <Text style={styles.detailText}>{resident.educationAttainment}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Religion</Text>
            <Text style={styles.detailText}>{resident.religion}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Ethnicity</Text>
            <Text style={styles.detailText}>{resident.ethnicity}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Health ID</Text>
            <Text style={styles.detailText}>{resident.healthID}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.detailText}>{resident.userID}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Date Created</Text>
            <Text style={styles.detailText}>{resident.dateCreated}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Date Updated</Text>
            <Text style={styles.detailText}>{resident.dateUpdate}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CensusDetails;
