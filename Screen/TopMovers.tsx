import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { CoinData } from '../types';

const TopMoversScreen: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        // Récupération des données pour Bitcoin, Ethereum, et le top mover
        const urls = [
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin',
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum',
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1',
        ];
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const [btcData, ethData, moversData] = await Promise.all(responses.map(res => res.json()));

        //filtre top mover
        const topMover = moversData.sort((a: CoinData, b: CoinData) =>
          b.price_change_percentage_24h - a.price_change_percentage_24h
        )[0];

        setCoins([btcData[0], ethData[0], topMover]);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false);
      }
    };

    fetchCoinsData();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={coins}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.coinContainer}>
          <Text style={styles.title}>
            {item.name} ({item.symbol.toUpperCase()})
          </Text>
          <Text>Current Price: ${item.current_price}</Text>
          <Text>24h Change: {item.price_change_percentage_24h.toFixed(2)}%</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  coinContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TopMoversScreen;
