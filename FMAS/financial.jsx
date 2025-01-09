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

export default function FinancialReports({ navigation }) {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedReportType, setSelectedReportType] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableReportTypes, setAvailableReportTypes] = useState([]);

  // Fetch financial data
  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://brgyapp.lesterintheclouds.com/api/fetch_financial.php', {
        username: 'IT112-24-M',
        password: 'W2Bq@EV[SFEV',
      });

      const data = response.data;
      if (data.success === false) {
        setFinancialData([]);
        return;
      }

      if (Array.isArray(data)) {
        setFinancialData(data);
        const years = [...new Set(data.map(item => new Date(item.date).getFullYear()))];
        const reportTypes = [...new Set(data.map(item => item.reportType))];
        setAvailableYears(years);
        setAvailableReportTypes(reportTypes);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setFinancialData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [selectedYear, selectedReportType]);

  const PrintFinancialReport = async () => {
    const filteredData = financialData.filter(
      item =>
        new Date(item.date).getFullYear() === selectedYear &&
        (selectedReportType ? item.reportType === selectedReportType : true)
    );

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
        <h2>Financial Reports</h2>
        <table>
          <thead>
            <tr>
              <th>Report Type</th>
              <th>Content</th>
              <th>Generated By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData
              .map(item => `
                <tr>
                  <td>${item.reportType || 'N/A'}</td>
                  <td>${item.content || 'N/A'}</td>
                  <td>${item.generatedBy || 'N/A'}</td>
                  <td>${item.date || 'N/A'}</td>
                </tr>
              `)
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

    try {
      const file = await printToFileAsync({ html: htmlTable, base64: false });
      console.log('File created at:', file.uri);
      await printAsync({ uri: file.uri });
    } catch (error) {
      console.error('Error printing financial report:', error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.yearPickerContainer}>
        <Text style={styles.yearPickerLabel}>Select Year:</Text>
        <RNPickerSelect
          items={availableYears.map(year => ({ label: year.toString(), value: year }))}
          onValueChange={setSelectedYear}
          value={selectedYear}
          style={pickerSelectStyles}
        />
      </View>

      <View style={styles.reportTypePickerContainer}>
        <Text style={styles.reportTypePickerLabel}>Select Report Type:</Text>
        <RNPickerSelect
          items={availableReportTypes.map(type => ({ label: type, value: type }))}
          onValueChange={setSelectedReportType}
          value={selectedReportType}
          style={pickerSelectStyles}
        />
      </View>

      <ScrollView horizontal contentContainerStyle={styles.tableContainer}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Report Type</Text>
            <Text style={styles.headerCell}>Content</Text>
            <Text style={styles.headerCell}>Generated By</Text>
            <Text style={styles.headerCell}>Date</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#710808" />
          ) : (
            <FlatList
              data={financialData.filter(
                item =>
                  new Date(item.date).getFullYear() === selectedYear &&
                  (selectedReportType ? item.reportType === selectedReportType : true)
              )}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.cell}>{item.reportType || 'N/A'}</Text>
                  <Text style={styles.cell}>{item.content || 'N/A'}</Text>
                  <Text style={styles.cell}>{item.generatedBy || 'N/A'}</Text>
                  <Text style={styles.cell}>{item.date || 'N/A'}</Text>
                </View>
              )}
              keyExtractor={item => item.report_ID.toString()}
            />
          )}
        </View>
      </ScrollView>

      {/* Add Transaction */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation?.navigate('financialadd')}>
                <Text style={styles.addButtonText}>Add Financial Report</Text>
              </TouchableOpacity>
            </View>
      
            {/* Print */}            
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={PrintFinancialReport}>
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
  yearPickerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#710808',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearPickerLabel: {
    fontSize: 16,
    marginLeft: 50,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  reportTypePickerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#710808',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTypePickerLabel: {
    fontSize: 16,
    marginLeft: 50,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  tableContainer: {
    width: '100%',
    flex: 1,
    marginTop: 10,
    paddingBottom: 70,
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
