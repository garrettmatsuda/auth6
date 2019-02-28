/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button} from 'react-native';
import NfcManager, {Ndef} from 'react-native-nfc-manager';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      method: 'nfc-sticker',
      email: 'Enter Northwestern email here!' };
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    // let data = this.getSchedulerData();
    // console.log('searchable here:', data);

    if (this.state.method == 'nfc-sticker'){
      return (
      <View style={styles.container}>
        <TextInput
            style={styles.emailInput}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
        />
        <Button 
          onPress={this.onPressDoStuff}
          title="Authenticate with sticker"
        />
      </View>
      );
    } else if (this.state.method == 'nfc-card') {
      return (
      <View style={styles.container}>
        <Button 
          onPress={this.onPressDoStuff}
          title="Authenticate with card"
        />
      </View>
      );
    } else if (this.state.method == 'text-code') {
      return (
      <View style={styles.container}>
        <Button 
          onPress={this.onPressDoStuff}
          title="should be a text-box"
        />
      </View>
      );
    } else {
      return (
      <View style={styles.container}>
        <Button 
          onPress={this.onPressDoStuff}
          title="Just Press this"
        />
      </View>
      );
    }
  }

  async getSchedulerData(){
    try {
      const data = fetch('http://18.212.193.41:8081/scheduler/hank@u.northwestern.edu', { method: 'GET' })
          .then((response) => response.json())
          .then((responseJson) => {return responseJson.name;})
          .catch((error) => {console.error(error);});
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  onPressDoStuff() {
    NfcManager.registerTagEvent(tag => { 

        let parsed = null;
      
        const ndefRecords = tag.ndefMessage;

        function decodeNdefRecord(record) {
            if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
              return ['text', Ndef.text.decodePayload(record.payload)];
            } else if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
              return ['uri', Ndef.uri.decodePayload(record.payload)];
            }
              return ['unknown', '---'];
        }

        parsed = ndefRecords.map(decodeNdefRecord);

        console.log(parsed);
        let type = parsed[0][0];

        // this.setState({ nfcFeedback: type});
        console.log(type);
        var post_url = 'http://18.212.193.41:8080/log/me';
        if (type == "text"){
          fetch(post_url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'sticker'
          })
          });
        } else {
          fetch(post_url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'card'
          })
          });
        }
        },
        'Hold your device over the tag', true);
    // this.setState({method: 'text-code'});
    NfcManager.unregisterTagEvent();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  emailInput: {
    height: 40,
    width: 300,

  }
});
