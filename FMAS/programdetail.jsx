import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function ViewProgram({ route, navigation }) {
  const {
    programName,
    programType,
    location,
    proposedBy,
    committee,
    startDate,
    endDate,
    budget,
    note,
    beneficiaries,
    status,
  } = route.params; 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <TextInputLabel label="Program Name" value={programName} />
        <TextInputLabel label="Program Type" value={programType} />
        <TextInputLabel label="Location" value={location} />
        <TextInputLabel label="Proposed By" value={proposedBy || 'N/A'} />
        <TextInputLabel label="Committee" value={committee || 'N/A'} />
        <TextInputLabel label="Start Date" value={startDate} />
        <TextInputLabel label="End Date" value={endDate} />
        <TextInputLabel label="Budget" value={`₱${budget}`} />
        <TextInputLabel label="Note" value={note || 'N/A'} />
        <TextInputLabel label="Beneficiaries" value={beneficiaries || 'N/A'} />
        <TextInputLabel label="Status" value={status || 'N/A'} />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const TextInputLabel = ({ label, value }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}:</Text>
    <View style={styles.inputBox}>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#710808',
    marginBottom: 5,
  },
  inputBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#bdc3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
