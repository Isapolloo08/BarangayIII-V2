import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Import Picker

export default function FinancialAdd({ navigation }) {
  const [reportType, setReportType] = useState('');
  const [content, setContent] = useState('');
  const [generatedBy, setGeneratedBy] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!reportType || !content || !generatedBy || !date) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }
  
    const financialdata = {
      reportType,
      content,
      generatedBy,
      date: date.toISOString().split('T')[0],
    };
  
    console.log("Payload being sent:", financialdata);
    try {
      const response = await axios.post(
        'http://brgyapp.lesterintheclouds.com/api/insert_financial.php',
        financialdata
      );
  
      // Assuming the response data has a 'status' field for success/error
      if (response.data.status === 'success') {
        Alert.alert('Success', 'Payroll added successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to add payroll.');
      }
    } catch (error) {
      console.error('Error adding payroll:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  
  const handleCancel = () => {
    navigation.goBack(); // Navigate back to the previous page
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Financial Report</Text>

      {/* Report Type Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Report Type:</Text>
        <Picker
          selectedValue={reportType}
          onValueChange={(itemValue) => setReportType(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Income Statement" value="Income Statement" />
          <Picker.Item label="Balance Sheet" value="Balance Sheet" />
          <Picker.Item label="Expense Report" value="Expense Report" />
        </Picker>
      </View>

      {/* Content Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Content:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Enter content"
          multiline
        />
      </View>

      {/* Generated By Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Generated By:</Text>
        <TextInput
          style={styles.input}
          value={generatedBy}
          onChangeText={setGeneratedBy}
          placeholder="Enter your name"
        />
      </View>

      {/* Date Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {date.toISOString().split('T')[0]} {/* Display current date in YYYY-MM-DD format */}
          </Text>
          <Icon name="calendar" size={20} color="#710808" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Buttons for Cancel and Submit */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#710808',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#710808',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#bdc3c7',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#710808',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
