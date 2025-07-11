import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper'; // Keeping react-native-paper Card for consistency
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Assuming you have expo-vector-icons installed
import { useRouter } from 'expo-router';

export default function JobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://10.0.87.42:8000/api/jobs/");
      // Ensure we always work with an array, even if 'results' is missing or not an array
      const results = Array.isArray(res.data.results) ? res.data.results : [];
      setJobs(results);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Alert.alert("Error", "Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

const handleApply = async (jobId) => {
  try {
    const token = await AsyncStorage.getItem('accessToken'); 
    if (!token) {
      Alert.alert("Authentication Error", "Please log in to apply for a job.");
      return;
    }

    const res = await axios.post(
      `http://10.0.87.42:8000/api/jobs/${jobId}/apply/`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Alert.alert("Success", "Your application has been submitted!");
  } catch (error) {
    if (error.response?.status === 400) {
      Alert.alert("Already Applied", "You have already applied to this job.");
    } else if (error.response?.status === 404) {
      Alert.alert("Job Not Found", "This job may no longer be available.");
    } else {
      console.error("Application error:", error);
      Alert.alert("Error", "Something went wrong while applying. Please try again later.");
    }
  }
};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading available jobs...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        <MaterialCommunityIcons name="briefcase-search" size={28} color="#334155" /> Find Your Next Opportunity
      </Text>

      {jobs.length === 0 ? (
        <View style={styles.noJobsContainer}>
          <MaterialCommunityIcons name="cloud-off-outline" size={60} color="#9CA3AF" />
          <Text style={styles.noJobsText}>No jobs available at the moment. Check back later!</Text>
        </View>
      ) : (
        jobs.map((job) => (
          <Card key={job.id} style={styles.jobCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
                <Text style={styles.jobDetailText}>{job.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="currency-usd" size={16} color="#6B7280" />
                <Text style={styles.jobDetailText}>Wage: ${parseFloat(job.wage).toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar-range" size={16} color="#6B7280" />
                <Text style={styles.jobDetailText}>
                  {new Date(job.availability_start).toLocaleDateString()} - {new Date(job.availability_end).toLocaleDateString()}
                </Text>
              </View>

              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.jobDescription}>{job.description}</Text>

              <Button
                mode="contained"
                onPress={() => handleApply(job.id)}
                style={styles.applyButton}
                labelStyle={styles.applyButtonText}
                icon={() => <MaterialCommunityIcons name="send" size={18} color="white" />}
              >
                Apply Now
              </Button>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#F7F9FC', 
    flexGrow: 1, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334155', // Darker text for heading
    marginBottom: 25,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noJobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noJobsText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
    color: '#9CA3AF', // Lighter grey for no jobs message
  },
  jobCard: {
    marginBottom: 20,
    borderRadius: 12, // More rounded corners
    elevation: 4, // Increased shadow for a floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: '#FFFFFF', // White card background
    borderLeftWidth: 5, // Subtle accent border
    borderLeftColor: '#4285F4', // Google Blue-like color
  },
  cardContent: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700', // Bolder title
    color: '#1F2937', // Dark text
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobDetailText: {
    fontSize: 15,
    color: '#4B5563', // Slightly lighter grey for details
    marginLeft: 8,
  },
  descriptionLabel: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
    color: '#374151',
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280', // Medium grey for description
    lineHeight: 22, // Better readability
    marginBottom: 20,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: '#4285F4', 
    borderRadius: 8,
    paddingVertical: 8, 
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});