import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { printAsync, printToFileAsync } from 'expo-print';

const { width } = Dimensions.get('window');

export default function AuditReports({ navigation }) {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(''); 
  const [availableFeatures, setAvailableFeatures] = useState([]);

  // Fetch audit data
  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://brgyapp.lesterintheclouds.com/api/fetch_audit.php', {
        username: 'IT112-24-M',
        password: 'W2Bq@EV[SFEV',
      });

      const data = response.data;
      if (data.success === false) {
        setAuditData([]);
        return;
      }

      if (Array.isArray(data)) {
        setAuditData(data);
        const features = [...new Set(data.map(item => item.feature))];
        setAvailableFeatures(features);
      }
    } catch (error) {
      console.error('Error fetching audit data:', error);
      setAuditData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, [selectedFeature]);


  // Prepare filtered data based on selected feature
  const filteredData = auditData.filter(item =>
    selectedFeature ? item.feature === selectedFeature : true
  );

  // Printing preview
  const PrintAudit = async () => {
    if (filteredData.length === 0) {
      alert('No data available to print.');
      return;
    }

    const htmlTable = `
    <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 15px;
            text-align: left;
          }
          th {
            background-color: #710808;
            color: white;
          }
          h2 {
          text-align: center;
          padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <h2>Audit Report</h2>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Details</th>
              <th>Feature</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData
              .map(item => `
                <tr>
                  <td>${item.timestamp || 'N/A'}</td>
                  <td>${item.details || 'N/A'}</td>
                  <td>${item.feature || 'N/A'}</td>
                </tr>
              `)
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  try {
    const file = await printToFileAsync({
      html: htmlTable,
      base64: false,
    });

    console.log('File created at:', file.uri);
    await printAsync({ uri: file.uri });
  } catch (error) {
    console.error('Error printing audit:', error);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.featurePickerContainer}>
        <Text style={styles.featurePickerLabel}>Select Feature:</Text>
        <RNPickerSelect
          items={availableFeatures.map(feature => ({ label: feature, value: feature }))}
          onValueChange={setSelectedFeature}
          value={selectedFeature}
          style={pickerSelectStyles}
        />
      </View>

      <ScrollView horizontal contentContainerStyle={styles.tableContainer}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Timestamp</Text>
            {/* <Text style={styles.headerCell}>Processed By</Text> */}
            <Text style={styles.headerCell}>Details</Text>
            <Text style={styles.headerCell}>Feature</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#710808" />
          ) : (
            <FlatList
              data={auditData.filter(item =>
                selectedFeature ? item.feature === selectedFeature : true
              )}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.cell}>{item.timestamp || 'N/A'}</Text>
                  {/* <Text style={styles.cell}>{item.proccesedBy || 'N/A'}</Text> */}
                  <Text style={styles.cell}>{item.details || 'N/A'}</Text>
                  <Text style={styles.cell}>{item.feature || 'N/A'}</Text>
                </View>
              )}
              keyExtractor={item => item.auditID.toString()}
            />
          )}
        </View>
      </ScrollView>

 <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation?.navigate('Audit Add')}>
          <Text style={styles.addButtonText}>Add Audit</Text>
        </TouchableOpacity>
      </View>

      {/* Print */}            
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.printButton} onPress={PrintAudit}>
          <Icon name="print" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Print</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  featurePickerContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 20, 
    alignItems: 'center', 
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#710808', 
    width: '100%', 
    height: 60, 
  },
  featurePickerLabel: {
    fontSize: 16, 
    color: '#710808', 
    fontWeight: 'bold', 
    flex: 1,
  },
  tableContainer: {
    width: '100%',
    flex: 1,
    marginTop: 10,
  },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#710808',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  headerCell: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  cell: {
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#710808',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%', // Adjust width for alignment
    alignItems: 'center',
  },
  printButton: {
    backgroundColor: '#710808',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%', // Adjust width for alignment
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    backgroundColor: 'transparent',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
  inputIOS: {
    backgroundColor: 'transparent',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
});
