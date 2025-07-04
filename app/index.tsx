import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function TBSHome() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://10.0.87.42:8000/api/')

      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error('Axios error:', error.message);
        setMessage('Error connecting to backend');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>{message}</Text>
    </View>
  );
}
