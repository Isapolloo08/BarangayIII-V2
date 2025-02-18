import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

const KagawadRegistrationProfiling = () => {
  const navigation = useNavigation();

  // State for storing residents data
  const [residentsData, setResidentsData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to track any errors

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterBySex, setFilterBySex] = useState(null);

  const headers = ['Name', 'Age', 'Address', 'Sex'];

  // Fetch resident data from database
  useEffect(() => {
    axios
      .get('http://brgyapp.lesterintheclouds.com/k_residents.php') // Update with your correct endpoint
      .then((response) => {
        setResidentsData(response.data); // Assuming the response is in the format [{}, {}, ...]
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  const navigateToDetails = (resident) => {
    navigation.navigate('KagawadResidentDetails', { resident });
  };

  const handleSearch = (text) => {
    setSearchQuery(text.toLowerCase());
  };

  const applyFilters = (resident) => {
    const name = `${resident.firstName} ${resident.middleName} ${resident.lastName} ${resident.suffix}`.replace(/\s+/g, ' ').trim();
    const address = `${resident.purok}, ${resident.barangay}`;
    if (searchQuery && !name.toLowerCase().includes(searchQuery)) {
      return false;
    }
    if (filterBySex && resident.sex !== filterBySex) {
      return false;
    }
    return true;
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const setSexFilter = (sex) => {
    setFilterBySex(sex);
    toggleFilterModal();
  };

  const clearFilters = () => {
    setFilterBySex(null);
    setSearchQuery('');
    toggleFilterModal();
  };

  const filteredResidents = residentsData.filter(applyFilters);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search residents..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter By:</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleFilterModal}>
          <Text style={styles.dropdownButtonText}>{filterBySex || 'All'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.box}>
        <View style={styles.tableHeader}>
          {headers.map((header, index) => (
            <Text key={index} style={[styles.headerCell, index === headers.length - 1 && { flex: 1 }]}>
              {header}
            </Text>
          ))}
        </View>
        {filteredResidents.map((item, index) => {
          const name = `${item.firstName} ${item.middleName} ${item.lastName} ${item.suffix}`.replace(/\s+/g, ' ').trim();
          const address = `${item.purok}, ${item.barangay}`;
          return (
            <TouchableOpacity key={index} style={styles.residentRow} onPress={() => navigateToDetails(item)}>
              <Text style={[styles.cell, { borderRightWidth: 1, borderRightColor: '#ccc' }]}>{name}</Text>
              <Text style={[styles.cell, { borderRightWidth: 1, borderRightColor: '#ccc' }]}>{item.age}</Text>
              <Text style={[styles.cell, { borderRightWidth: 1, borderRightColor: '#ccc' }]}>{address}</Text>
              <Text style={styles.cell}>{item.sex}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={filterModalVisible} onRequestClose={toggleFilterModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalItem} onPress={() => setSexFilter('Male')}>
              <Text style={styles.modalText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => setSexFilter('Female')}>
              <Text style={styles.modalText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={clearFilters}>
              <Text style={styles.modalText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={toggleFilterModal}>
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  searchInput: {
    height: 50,
    paddingHorizontal: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 5,
  },
  filterLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  dropdownButton: {
    height: 30,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  box: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  residentRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default KagawadRegistrationProfiling;
