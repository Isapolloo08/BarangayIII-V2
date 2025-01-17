import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

const CensusData = () => {
  const navigation = useNavigation();
  const [residentsData, setResidentsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterByCategory, setFilterByCategory] = useState(null);

  // Determine if a resident is pregnant
  const isPregnant = (lmp) => {
    if (!lmp) return false;
    const lmpDate = new Date(lmp);
    const currentDate = new Date();
    const diffInMonths = (currentDate.getFullYear() - lmpDate.getFullYear()) * 12 + currentDate.getMonth() - lmpDate.getMonth();
    return diffInMonths <= 9; // Check if pregnant within 9 months
  };

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchResidentsData = async () => {
      try {
        const response = await axios.get('http://brgyapp.lesterintheclouds.com/fetch_residents_data.php');
        console.log(response.data); // Log fetched data
        setResidentsData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching residents data:', error);
        setResidentsData([]);
      }
    };

    fetchResidentsData();
  }, []);

  const headers = ['Name', 'Age', 'Address', 'Sex'];

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text.toLowerCase()); // Store the search query in lower case for case-insensitive search
  };

  const addNewCensusData = (newCensusData) => {
    setResidentsData([...residentsData, newCensusData]);
  };

  // Filter residents based on search query and category filter
  const filteredResidents = useMemo(() => 
    residentsData.filter((resident) => {
      // Name search filter
      const nameMatch = (resident.Name || '').toLowerCase().includes(searchQuery);

      // Category filter logic
      const age = parseInt(resident.Age, 10);
      const isPregnantStatus = resident.Sex === 'Female' && isPregnant(resident.LMP); // Assuming LMP exists in the data
      let categoryMatch = true;

      if (filterByCategory === 'Infant' && !(age >= 0 && age <= 2)) categoryMatch = false;
      if (filterByCategory === 'Adult' && !(age >= 18 && age <= 59)) categoryMatch = false;
      if (filterByCategory === 'Senior Citizens' && !(age >= 60)) categoryMatch = false;
      if (filterByCategory === 'Pregnant Women' && !isPregnantStatus) categoryMatch = false;

      return nameMatch && categoryMatch;
    }), [residentsData, searchQuery, filterByCategory]);

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      {headers.map((header, index) => (
        <Text key={index} style={styles.headerCell}>{header}</Text>
      ))}
    </View>
  );

  const navigateToRegister = () => {
    navigation.navigate('AddCensusData');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.residentRow}
      onPress={() => {
        navigation.navigate('CensusDetails', { residentNum: item.residentNum });
      }}
    >
      <Text style={styles.cell}>{item.Name}</Text>
      <Text style={styles.cell}>{item.Age}</Text>
      <Text style={styles.cell}>{item.Address}</Text>
      <Text style={styles.cell}>{item.Sex}</Text>
    </TouchableOpacity>
  );

  // Toggle filter modal visibility
  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  // Set filter category
  const setCategoryFilter = (category) => {
    setFilterByCategory(category);
    toggleFilterModal(); // Close the modal after setting the filter
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search residents by name..."
          value={searchQuery}
          onChangeText={handleSearch} // Update search query on text change
        />
      </View>

      {/* Filter Button */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter By:</Text>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
          <Text style={styles.filterButtonText}>{filterByCategory || 'All'}</Text>
        </TouchableOpacity>
      </View>

      {/* Display "No Data" if no residents are found */}
      {residentsData.length === 0 ? (
        <Text style={styles.noDataText}>No residents found</Text>
      ) : (
        <FlatList
          data={filteredResidents} // Use filtered residents data here
          keyExtractor={(item) => item.residentNum.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]}  // Make the header sticky
          style={styles.box}
        />
      )}

<TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCensusData', { addNewCensusData })}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal animationType="slide" transparent={true} visible={filterModalVisible} onRequestClose={toggleFilterModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalItem} onPress={() => setCategoryFilter('Infant')}>
              <Text style={styles.modalText}>Infant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => setCategoryFilter('Adult')}>
              <Text style={styles.modalText}>Adult</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => setCategoryFilter('Senior Citizens')}>
              <Text style={styles.modalText}>Senior Citizens</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => setCategoryFilter('Pregnant Women')}>
              <Text style={styles.modalText}>Pregnant Women</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => setCategoryFilter(null)}>
              <Text style={styles.modalText}>Clear Filter</Text>
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
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
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
    backgroundColor: '#f4f4f4',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    padding: 5,
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
  addButton: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  addText: {
    fontSize: 24,
    color: 'white',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
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

export default CensusData;
