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

    // this.onChange = this.onChange.bind(this);

    this.state = {
      method: 'sticker',
      email: 'default@u.northwestern.edu',
      day1date: null,
      day2date: null,
      day3date: null,
      day4date: null,

      day1month: null,
      day2month: null,
      day3month: null,
      day4month: null,

      day1method: null,
      day2method: null,
      day3method: null,
      day4method: null,

    };

    let responseJson = null;
    this.getSchedulerData().then((response) => {
      responseJson = JSON.parse(response);
      let day1date = parseInt(responseJson.day1.split('/')[1]);
      let day1month = parseInt(responseJson.day1.split('/')[0]);
      this.setState({day1date: day1date});
      this.setState({day1month: day1month});
      this.setState({day1method: responseJson.day1method});

      console.log('received_day', this.state.day1date);
      console.log('received_month', this.state.day1month);

      let day2date = parseInt(responseJson.day1.split('/')[1]);
      let day2month = parseInt(responseJson.day1.split('/')[0]);
      this.setState({day2date: day2date});
      this.setState({day2month: day2month});
      this.setState({day2method: responseJson.day2method});

      let day3date = parseInt(responseJson.day1.split('/')[1]);
      let day3month = parseInt(responseJson.day1.split('/')[0]);
      this.setState({day3date: day3date});
      this.setState({day3month: day3month});
      this.setState({day3method: responseJson.day3method});

      let day4date = parseInt(responseJson.day1.split('/')[1]);
      let day4month = parseInt(responseJson.day1.split('/')[0]);
      this.setState({day4date: day4date});
      this.setState({day4month: day4month});
      this.setState({day4method: responseJson.day4method});

      let day = new Date().getDate();
      let month = new Date().getMonth() + 1;

      console.log('received_day_new', this.state.day1date, day);
      console.log('received_month_new', this.state.day1month, month);

      if (this.state.day1date == day && this.state.day1month == month) {
        this.setState({method: this.state.day1method});
        console.log('we made it', responseJson.day1method);

      } else if (this.state.day2date == day && this.state.day2month == month) {

        this.setState({method: this.state.day2method});
      } else if (this.state.day3date == day && this.state.day3month == month) {

        this.setState({method: this.state.day3method});
      } else if (this.state.day4date == day && this.state.day4month == month) {

        this.setState({method: this.state.day4method});
      }

      console.log('received_method', this.state.method);
      return responseJson;
    }).catch((error) => {
      console.log(error);
      console.warn("server is down");
    });

  }

  onChange(state) {
    this.setState(state);
  }

  render() {

    console.log('received_method_update', this.state.method);

    if (this.state.method == 'sticker'){
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
    } else if (this.state.method == 'card') {
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

  async getSchedulerData() {
    try {
      let response = await fetch('http://18.212.193.41:8081/scheduler/hank@u.northwestern.edu', {method: 'GET'});
      let responseJson = await response.json();
      return responseJson;
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
        try {
          var post_url = 'http://18.212.193.41:8080/log/me';
          if (type == "text") {
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
        } catch(error) {
          console.log('error');
          console.warn('server is down');
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
