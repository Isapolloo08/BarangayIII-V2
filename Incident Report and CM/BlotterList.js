import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { printToFileAsync, printAsync } from 'expo-print';

const BlotterList = ({ navigation }) => {
  const [blotterData, setBlotterData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://brgyapp.lesterintheclouds.com/fetch_blotter_list.php");
        setBlotterData(response.data);
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
          setError("Network Error: No response received.");
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVisibilityClick = (caseID) => {
    navigation.navigate('CaseReport', { caseID });
  };

  const printBlotter = async () => {
    if (blotterData.length === 0) {
      Alert.alert('No data available to print.');
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
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #800000;
              color: white;
            }
            h2 {
              text-align: center;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <h2>Blotter Data</h2>
          <table>
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Date Occurred</th>
                <th>Status</th>
                <th>Process</th>
              </tr>
            </thead>
            <tbody>
              ${blotterData
                .map(item => `
                  <tr>
                    <td>${item.caseID}</td>
                    <td>${item.dateOccured}</td>
                    <td>${item.status}</td>
                    <td>${item.proccess}</td>
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

      await printAsync({ uri: file.uri });
    } catch (error) {
      console.error('Error printing blotter:', error);
    }
  };

  const renderBlotterItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.caseID}</Text>
      <Text style={styles.cell}>{item.dateOccured}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{item.proccess}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity onPress={() => handleVisibilityClick(item.caseID)}>
          <Icon name="visibility" size={20} color="#000" />
        </TouchableOpacity>
       
      </View>
    </View>
  );

  const filteredData = blotterData.filter((item) =>
    item.proccess?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>All</Text>
          <Icon name="arrow-drop-down" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        {["Incident ID", "Date", "Status", "Process", "Action"].map((header) => (
          <Text key={header} style={styles.headerCell}>{header}</Text>
        ))}
      </View>

      {filteredData.length === 0 ? (
        <Text>No results found.</Text>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderBlotterItem}
          keyExtractor={(item) => String(item.caseID)}
          style={styles.tableBody}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={printBlotter}>
        <Icon name="print" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownText: {
    marginRight: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#800000",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCell: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  tableBody: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  actionCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#800000",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BlotterList;
