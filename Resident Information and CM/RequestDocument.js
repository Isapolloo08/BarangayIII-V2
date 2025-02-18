import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios'; // Import axios for making HTTP requests

const RequestDocument = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [docType, setDocType] = useState('');
    const [isDocTypeDropdownOpen, setIsDocTypeDropdownOpen] = useState(false);
    const [purpose, setPurpose] = useState('');
    const [dateOfClaim, setDateOfClaim] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeClaim, setTimeClaim] = useState('');
    const [isTimeClaimDropdownOpen, setIsTimeClaimDropdownOpen] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [requestDocsData, setRequestDocsData] = useState([]);

    const navigation = useNavigation();

    const handleDocTypeSelection = (item) => {
        setDocType(item);
        setIsDocTypeDropdownOpen(false);
    };

    const handleTimeClaimSelection = (item) => {
        setTimeClaim(item);
        setIsTimeClaimDropdownOpen(false);
    };

    const handleCancel = () => {
        setIsCancelModalVisible(true);
    };

    const handleCancelConfirmation = (confirm) => {
        setIsCancelModalVisible(false);
        if (confirm) {
            resetForm();
        }
    };

    const resetForm = () => {
        setName('');
        setAddress('');
        setDocType('');
        setPurpose('');
        setDateOfClaim(new Date());
        setTimeClaim('');
        setError('');
    };

    const handleSubmit = () => {
        if (!name || !address || !docType || !purpose || !timeClaim) {
            setError('All fields are required.');
            return;
        }
    
        const requestData = {
            name,
            address,
            docType,
            purpose,
            dateOfClaim: dateOfClaim.toISOString().split('T')[0], // Format as YYYY-MM-DD
            timeClaim,
        };
    
        axios.post("http://brgyapp.lesterintheclouds.com/RequestsForNewDocuments.php", requestData)
            .then(response => {
                if (response.data.success) {
                    alert('Document request submitted successfully!');
                    resetForm();
                } else if (response.data.message === 'Duplicate entry found.') {
                    alert('This document request already exists.');
                } else {
                    alert('Failed to submit the document request. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error submitting document request:', error);
                alert('An error occurred while submitting the request. Please check your connection and try again.');
            });
    };
    
    const handleSubmitConfirmation = async (confirm) => {
        setIsSubmitModalVisible(false);
        if (confirm) {
            try {
                const apiUrl = 'http://brgyapp.lesterintheclouds.com/RequestsForNewDocuments.php';

                const requestData = {
                    name,
                    address,
                    docType,
                    purpose,
                    dateOfClaim: dateOfClaim.toISOString().split('T')[0], // Format as YYYY-MM-DD
                    timeClaim,
                };

                const response = await axios.post(apiUrl, requestData);

                if (response.data.success) {
                    alert('Document request submitted successfully!');
                    resetForm();
                } else {
                    alert('Failed to submit the document request. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting document request:', error);
                alert('An error occurred while submitting the request. Please check your connection and try again.');
            }
        }
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            if (selectedDate >= today) {
                setDateOfClaim(selectedDate);
            } else {
                alert('Please select a date today or in the future.');
            }
        }
    };

    const fetchRequestDocuments = async () => {
        try {
            const response = await axios.get('http://brgyapp.lesterintheclouds.com/fetchRequestsForNewDocuments.php');
            setRequestDocsData(response.data);
        } catch (error) {
            console.error('Error fetching request documents', error);
            alert('Failed to load request documents.');
        }
    };

    const navigateToListOfRequestDocx = async () => {
        await fetchRequestDocuments();
        navigation.navigate('ListOfRequestDocx', { requests: requestDocsData });
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.buttonListContainer}>
 <TouchableOpacity
                        style={styles.listButton}
                        onPress={navigateToListOfRequestDocx}>
                        <Text style={styles.listButtonText}>View List of Request Documents</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.background}>
                    <View style={styles.box}>
                        <View style={styles.inputContainer}>
                            <Text>Name:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Name"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text>Address:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Address"
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text>Document Type: <Text style={styles.required}>*</Text> </Text>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setIsDocTypeDropdownOpen(!isDocTypeDropdownOpen)}
                            >
                                <Text>{docType || 'Select Document Type'}</Text>
                            </TouchableOpacity>
                            <Modal
                                transparent={true}
                                visible={isDocTypeDropdownOpen}
                                onRequestClose={() => setIsDocTypeDropdownOpen(false)}
                            >
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <FlatList
                                            data={['Barangay ID', 'Certificate of Indigency', 'Barangay Certificate', 'Barangay Clearance', 'Business Permit']}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={styles.dropdownItem}
                                                    onPress={() => handleDocTypeSelection(item)}
                                                >
                                                    <Text>{item}</Text>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item) => item}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text>Purpose: <Text style={styles.required}>*</Text> </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Purpose"
                                value={purpose}
                                onChangeText={setPurpose}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text>Date of Claim: <Text style={styles.required}>*</Text> </Text>
                            <TouchableOpacity onPress={showDatePickerModal} style={styles.datePickerText}>
                                <Text>{dateOfClaim.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dateOfClaim}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                    minimumDate={today}
                                />
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text>Time Claim: <Text style={styles.required}>*</Text> </Text>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setIsTimeClaimDropdownOpen(!isTimeClaimDropdownOpen)}
                            >
                                <Text>{timeClaim || 'Select Time Claim'}</Text>
                            </TouchableOpacity>
                            <Modal
                                transparent={true}
                                visible={isTimeClaimDropdownOpen}
                                onRequestClose={() => setIsTimeClaimDropdownOpen(false)}
                            >
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <FlatList
                                            data={['8:00 am', '9:00 am', '10:00 am', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm']}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={styles.dropdownItem}
                                                    onPress={() => handleTimeClaimSelection(item)}
                                                >
                                                    <Text>{item}</Text>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item) => item}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F3F7', // Gray background color
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
    },
    box: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 20,
        padding: 15,
        width: '100%',
    },
    inputContainer: {
        marginBottom: 10,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
    datePickerText: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '48%',
    },
    cancelButton: {
        backgroundColor: '#FF0000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '48%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    listButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    },
    buttonListContainer: {
        marginBottom: 25,
    },
    listButtonText: {
    fontSize: 14,
    color: '#fff',
    },
    required: {
    color: 'red',
    fontSize: 16
    },
});

export default RequestDocument;