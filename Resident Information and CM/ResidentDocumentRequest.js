import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const ResidentDocumentRequest = () => {
  const navigation = useNavigation();

  const [residentsDocumentRequest, setResidentsDocumentRequest] = useState([]); // Initial empty state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterByStatus, setFilterByStatus] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newORNumber, setNewORNumber] = useState('');

  const headers = ['OR No.', 'Name', 'Address', 'Document Type', 'Purpose', 'Date', 'Time', 'Status', 'Action'];

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get('http://brgyapp.lesterintheclouds.com/FetchForNewDocuments.php');
        console.log('Fetched Data:', response.data); // Log the fetched data
        setResidentsDocumentRequest(response.data); // Populate the table
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after the fetch operation
      }
    };

    fetchData(); // Call the fetch function when the component mounts
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text.toLowerCase());
  };

  const applyFilters = (document) => {
    const name = `${document.name}`.replace(/\s+/g, ' ').trim();
    if (searchQuery && !name.toLowerCase().includes(searchQuery) && !document.documentType.toLowerCase().includes(searchQuery)) {
      return false;
    }
    if (filterByStatus && document.status !== filterByStatus) {
      return false;
    }
    return true;
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const setStatusFilter = (status) => {
    setFilterByStatus(status);
    toggleFilterModal();
  };

  const clearFilters = () => {
    setFilterByStatus(null);
    setSearchQuery('');
    toggleFilterModal();
  };

  const filteredDocuments = residentsDocumentRequest.filter(applyFilters);

  const handleView = (document) => {
    setSelectedDocument(document);
    navigation.navigate('ViewDocumentRequestDetails', { document });
  };

  const handleUpdateStatus = (document) => {
    setSelectedDocument(document);
    setNewORNumber(document.ORNo || ''); // Update OR number
    setModalVisible(true);
  };

  const handleAccept = async () => {
    if (selectedDocument) {
      try {
        const response = await axios.post('http://brgyapp.lesterintheclouds.com/UpdateDocumentStatus.php', {
          id: selectedDocument.id,
          status: 'accepted', // Update status to accepted
          orNumber: newORNumber
        });

        if (response.data.success) {
          // Update the state with new status
          const updatedDocuments = residentsDocumentRequest.map((doc) =>
            doc.id === selectedDocument.id
              ? { ...doc, status: 'accepted', ORNo: newORNumber }
              : doc
          );
          setResidentsDocumentRequest(updatedDocuments);
          setModalVisible(false);
          Alert.alert('Success', 'Document accepted successfully.');
        } else {
          Alert.alert('Error', 'Failed to accept the document.');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  };

  const handleDecline = async () => {
    if (selectedDocument) {
      try {
        const response = await axios.post('http://brgyapp.lesterintheclouds.com/UpdateDocumentStatus.php', {
          id: selectedDocument.id,
          status: 'declined', // Update status to declined
          orNumber: '' // No OR number for declined requests
        });

        if (response.data.success) {
          // Update the state with new status
          const updatedDocuments = residentsDocumentRequest.map((doc) =>
            doc.id === selectedDocument.id
              ? { ...doc, status: 'declined' }
              : doc
          );
          setResidentsDocumentRequest(updatedDocuments);
          setModalVisible(false);
          Alert.alert('Success', 'Document declined successfully.');
        } else {
          Alert.alert('Error', 'Failed to decline the document.');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search residents or document type..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter By:</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleFilterModal}>
          <Text style={styles.dropdownButtonText}>{filterByStatus || 'All'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.scrollContainer}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            {headers.map((header, index) => (
              <View key={index} style={[styles.headerCell, { width: columnWidths[index] }]}>
                <Text>{header}</Text>
              </View>
            ))}
          </View>
          <ScrollView vertical style={styles.tableBody}>
            {filteredDocuments.map((item, index) => {
              return (
                <View key={index} style={styles.row}>
                  <View style={[styles.cell, { width: columnWidths[0] }]}>
                    <Text>{item.ORNo || 'N/A'}</Text>
                  </View>
                  <View style={[styles.cell, { width: columnWidths[1] }]}>
                    <Text>{item.name}</Text>
                  </View>
                  <View style={[styles.cell, { width: columnWidths[2] }]}>
                    <Text>{item.address}</Text>
                  </View>
                  <View style={[styles.cell, { width: columnWidths[3] }]}>
                    <Text>{item.documentType}</Text>
                  </View>
                  <View style={[styles.cell, { width: columnWidths[4] }]}>
                    <Text>{item.purpose}</Text>
                  </View>
                  <View style={[styles.cell, { width: columnWidths[5] }]}>
                    <Text>{item.dateOfClaim}</Text>
                  </View>
                  <View style={[styles.cell, { width: columnWidths[6] }]}>
                    <Text>{item.timeOfClaim}</Text>
                  </View>
                  <View style={[styles.cell, { width: columnWidths[7] }]}>
                    <Text>{item.status}</Text>
                  </View>
                  <View style={[styles.cell, { width: columnWidths[8], flexDirection: 'row', justifyContent: 'center' }]}>
                    <TouchableOpacity onPress={() => handleView(item)}>
                      <Icon name="eye" size={20} color="blue" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter OR Number:</Text>
            <TextInput
              style={styles.input}
              value={newORNumber}
              onChangeText={setNewORNumber}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleAccept}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleDecline}>
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};



const columnWidths = [100, 200, 200, 200, 200, 150, 150, 150, 150];

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
    width: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
    marginLeft: '54%',
  },
  filterLabel: {
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 15,
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
  scrollContainer: {
    marginTop: 20,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerCell: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableBody: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellPaid: {
    backgroundColor: 'green', // Light green background
  },
  cellUnpaid: {
    backgroundColor: 'red', // Light red background
  },
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  printButton: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalItem: {
    marginVertical: 10,
  },
  modalText: {
    fontSize: 18,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ResidentDocumentRequest;