import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getAuthData } from "../SecureStoreage/secureStoreHelpers";

function CaseListScreen(props) {

  const [blotterDatas, setBlotterDatas] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const keys = 'UserID';
      try {
        const userData = await getAuthData(keys);
        if (userData) {
          fetchBloterData(userData);
        }
      } catch (error) {
        console.error('Error retrieving authentication data:', error);
      }
    }

    const fetchBloterData = async (userID) => {
      try {
        const response = await axios.post("http://brgyapp.lesterintheclouds.com/getCaseReported.php", {userID}); // Update with your actual domain
        if (response.data.status === "success") {
          setBlotterDatas(response.data.data);
        } else {
          console.log('No data found for this user.');
        }
      } catch (error) {
        console.error('Error response:', error.response);
      } finally{
        setFetchingData(false);
      }
    }

    getUserData();
  }, []);
    
  const renderCaseItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.caseDetails}>
        <Text style={styles.caseText}>
          <Text style={styles.label}>Incident ID: </Text> {item.caseID}
        </Text>
        <Text style={styles.caseText}>
          <Text style={styles.label}>Case Type: </Text> {item.incidentNames}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{item.status}</Text>
        <Text style={styles.dateLabel}>{item.dateOccured}</Text>
      </View>
    </View>
  );

  if(fetchingData){
    return(
      <View style={styles.containers}>
          <Text style={styles.noFound}>Loading data, please wait...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filter by:</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Latest</Text>
          <Ionicons name="chevron-down" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {blotterDatas.length === 0 ? (
        <View style={styles.containers}>
            <Text style={styles.noFound}>No results found.</Text>
        </View>
      ) : (
        <FlatList
          data={blotterDatas}
          renderItem={renderCaseItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#750000",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  filterText: {
    fontSize: 14,
    marginRight: 10,
    color: "#555",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#750000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "white",
    marginRight: 5,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 0,
    marginLeft: 8,
    marginRight: 8,
    padding: 15,
    borderRadius: 10,
  },
  caseDetails: {
    flex: 3,
  },
  caseText: {
    fontSize: 14,
    marginVertical: 3,
    color: "#333",
  },
  label: {
    color: "#c22533",
    fontWeight: "bold",
  },
  statusContainer: {
    alignItems: "flex-end",
    flex: 1,
  },
  status: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  dateLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
  },
  containers: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFound: {
        fontSize: 18,
        color: '#333',
    },
});

export default CaseListScreen;