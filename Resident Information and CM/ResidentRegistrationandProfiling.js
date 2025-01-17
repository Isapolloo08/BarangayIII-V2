import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

const ResidentRegistrationandProfiling = () => {
  const navigation = useNavigation();
  const [residentsData, setResidentsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterBySex, setFilterBySex] = useState(null);

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
    setSearchQuery(text.toLowerCase()); // Store search query in lowercase for case-insensitive search
  };

  const addNewCensusData = (newCensusData) => {
    setResidentsData([...residentsData, newCensusData]);
  };


  const navigateToDetails = (resident) => {
    navigation.navigate('ResidentDetails', { resident });
  };

  const navigateToResidentHistory = (residentId) => {
    // Assuming you will have a history page and will pass the resident ID to fetch history data
    navigation.navigate('ResidentHistory', { residentId });
  };

  const applyFilters = (resident) => {
    const name = `${resident.firstName} ${resident.middleName} ${resident.lastName} ${resident.suffix}`.replace(/\s+/g, ' ').trim();
    const address = `${resident.purok}, ${resident.barangay}`;
  
    // Search filter
    if (searchQuery && !name.toLowerCase().includes(searchQuery)) {
      return false;
    }
  
    // Sex filter (case-insensitive check, adjusted for the correct key 'Sex')
    if (filterBySex && resident.Sex && resident.Sex.toLowerCase() !== filterBySex.toLowerCase()) {
      return false;
    }
  
    return true;
  };
  
  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const setSexFilter = (sex) => {
    console.log('Selected Sex:', sex); // Log the selected sex
    setFilterBySex(sex);
    toggleFilterModal(); // Close modal after setting the filter
  };
  

  const clearFilters = () => {
    setFilterBySex(null); // Reset the sex filter
    setSearchQuery(''); // Clear the search query
    toggleFilterModal(); // Close the modal
  };

  // Use filtered residents based on the search query and sex filter
  const filteredResidents = useMemo(() => 
    residentsData.filter(applyFilters), [residentsData, searchQuery, filterBySex]);

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      {headers.map((header, index) => (
        <Text key={index} style={styles.headerCell}>{header}</Text>
      ))}
    </View>
  );

 const renderItem = ({ item }) => (
     <TouchableOpacity
       style={styles.residentRow}
       onPress={() => {
         navigation.navigate('CensusDetailss', { residentNum: item.residentNum });
       }}
     >
      <Text style={styles.cell}>{item.Name}</Text>
      <Text style={styles.cell}>{item.Age}</Text>
      <Text style={styles.cell}>{item.Address}</Text>
      <Text style={styles.cell}>{item.Sex}</Text>
    </TouchableOpacity>
  );

  const keyExtractor = (item) => item.residentNum ? item.residentNum.toString() : Math.random().toString();

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search residents..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Filter Button */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter By:</Text>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
          <Text style={styles.filterButtonText}>{filterBySex || 'All'}</Text>
        </TouchableOpacity>
      </View>

      {/* Display "No Data" if no residents are found */}
      {residentsData.length === 0 ? (
        <Text style={styles.noDataText}>No residents found</Text>
      ) : (
        <FlatList
          data={filteredResidents} // Use filtered residents data
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]} // Make the header sticky
          style={styles.box}
        />
      )}

      <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Add New Census Data', { addNewCensusData })}
            >
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>

      {/* Filter Modal */}
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
  filterButton: {
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
  filterButtonText: {
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

export default ResidentRegistrationandProfiling;
