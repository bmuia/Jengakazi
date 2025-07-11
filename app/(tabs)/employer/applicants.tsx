import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Text, Avatar, Divider, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ApplicantsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobsWithApplicants();
  }, []);

  const fetchJobsWithApplicants = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        console.warn("No access token found.");
        return;
      }

      const { data } = await axios.get("http://10.0.87.42:8000/api/employer/jobs/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const jobList = Array.isArray(data.results) ? data.results : [];

      const jobsWithApplicants = await Promise.all(
        jobList.map(async (job) => {
          try {
            const res = await axios.get(
              `http://10.0.87.42:8000/api/jobs/${job.id}/applicants/`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...job, applicants: Array.isArray(res.data) ? res.data : [] };
          } catch {
            return { ...job, applicants: [] };
          }
        })
      );

      setJobs(jobsWithApplicants);
    } catch (err) {
      console.error("Failed to load jobs or applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {jobs.length === 0 ? (
        <Text style={styles.noJobs}>No jobs found for this employer yet.</Text>
      ) : (
        jobs.map((job) => (
          <Card style={styles.jobCard} key={job.id}>
            <Card.Title
              title={job.title}
              subtitle={`Wage: $${job.wage} | ${new Date(job.availability_start).toLocaleDateString()} → ${new Date(job.availability_end).toLocaleDateString()}`}
              titleStyle={styles.jobTitle}
            />
            <Card.Content>
              <Text style={styles.applicantsLabel}>Applicants:</Text>
              <Divider style={styles.divider} />
              {job.applicants.length === 0 ? (
                <Text style={styles.noApplicants}>No applications yet 🕊️</Text>
              ) : (
                job.applicants.map((app, index) => (
                  <View style={styles.applicantRow} key={index}>
                    <Avatar.Text
                      label={app.applicant?.username?.slice(0, 2).toUpperCase() || "U"}
                      size={36}
                      style={styles.avatar}
                    />
                    <View>
                      <Text>{app.applicant?.username || "Unknown"}</Text>
                      <Text style={styles.appliedAt}>
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  jobCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  jobTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  applicantsLabel: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 6,
  },
  applicantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  avatar: {
    marginRight: 12,
  },
  noApplicants: {
    fontStyle: "italic",
    color: "gray",
    textAlign: "center",
    marginVertical: 12,
  },
  noJobs: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
  appliedAt: {
    fontSize: 12,
    color: "gray",
  },
});
