import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { Header } from '../src/components/Header';
import { LeftPanel } from '../src/components/LeftPanel';
import { RightPanel } from '../src/components/RightPanel';
import { COLORS } from '../src/utils/colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg.dark,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    flex: 1,
  },
  rightPanel: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.bg.panel,
  },
});

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <View style={styles.contentRow}>
          <View style={styles.panel}>
            <LeftPanel />
          </View>
          <View style={styles.rightPanel}>
            <RightPanel />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
