/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, AsyncStorage} from 'react-native';
import NfcManager, {Ndef} from 'react-native-nfc-manager';
import { Icon, ThemeProvider, Button } from 'react-native-elements';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const theme = {
  Button: {
    titleStyle: {
      color: 'white',
      fontWeight: 'bold',
    },
  },
};

var constEmail = 'none';

function TitleAndEmail() {

}

function ValidIcon(response) {

  if (response.validEmail == true){
    return(<Icon 
            style={styles.inputIcon}
            name='check-circle'
            color='green'/>);
  } else {
    return(<Icon 
            style={styles.inputIcon}
            name='cancel'
            color='red'/>);
  }
  
}

const storeEmail = async (email) => {
    try {
      console.log('getting ready to store email', email);
      await AsyncStorage.setItem('saved_email', email);
      console.log('just stored email: ', email);
    } catch (error) {
      // console.log('here',this.state.email);
      console.log(error);
      console.warn('error saving email');
    }
};

const getEmail = async () => {
    try {
      return AsyncStorage.getItem('saved_email').then((response) => {
        console.log('got in async func:',response);
        return response;
      });
    } catch (error) {
      console.log('get email failed');
      return 'default@u.northwestern.edu';
    }
};



type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
        method: 'sticker',
        email: 'default@u.northwestern.edu',
        emailConfirmed: false,
        textCode: 'Text message code here',

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
  }

  componentDidMount() {
    console.log('componentDidMount has been called');
    getEmail().then((response) => {
      console.log('function completed and response:', response);
      if(response){ 
        saved_email = response;
        this.setState({email: saved_email});
        constEmail = this.state.email;
        return(saved_email);
      } else {
        return('no email');
      }
    }).then((promise) => {
      console.log('FUCK');
      console.log('about to check email, ', promise);
      this.checkEmail(promise);
      return(promise);
    }).then((promise) => {
      this.loadSchedulerData(promise);
    });

    // check email doesn't finish before loadSchedulerData gets called
    
  }

  onChange(state) {
    this.setState(state);
  }

  loadSchedulerData(email){
    console.log('response_will_mount');
    let responseJson = null;
    this.getSchedulerData(this.state.email).then((response) => {
      console.log('response_did_mount', response);
      responseJson = response;
  
      let day1date = parseInt(responseJson.day1.split('/')[1]);
      let day1month = parseInt(responseJson.day1.split('/')[0]);
      this.setState({day1date: day1date});
      this.setState({day1month: day1month});
      this.setState({day1method: responseJson.day1method});

      let day2date = parseInt(responseJson.day2.split('/')[1]);
      let day2month = parseInt(responseJson.day2.split('/')[0]);
      this.setState({day2date: day2date});
      this.setState({day2month: day2month});
      this.setState({day2method: responseJson.day2method});

      let day3date = parseInt(responseJson.day3.split('/')[1]);
      let day3month = parseInt(responseJson.day3.split('/')[0]);
      this.setState({day3date: day3date});
      this.setState({day3month: day3month});
      this.setState({day3method: responseJson.day3method});

      let day4date = parseInt(responseJson.day4.split('/')[1]);
      let day4month = parseInt(responseJson.day4.split('/')[0]);
      this.setState({day4date: day4date});
      this.setState({day4month: day4month});
      this.setState({day4method: responseJson.day4method});

      let day = new Date().getDate();
      let month = new Date().getMonth() + 1;

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

      // if(this.state.day1date != null) {
      //   console.log('gonna doit here');
      //   this.setState({emailConfirmed: true});
      // }

      return responseJson;
    }).catch((error) => {
      console.log("server is down", error);
      console.warn("server is down");
    });
  }

  checkEmail(email){
    console.log('checking email, ', email);
    this.getSchedulerData(email).then((response) => {
      if(response != 'scheduler not found') {
        this.setState({emailConfirmed: true});
      } else {
        this.setState({emailConfirmed: false});
      }});
    
    console.log('stuff working hopefully! ', this.state.emailConfirmed);
    this.render();
  }

  render() {
    console.log('rendering');

    if (this.state.method == 'sticker'){
      return (
      <View style={styles.container}>
        <Text style={styles.title}>Garrett's Authenticator</Text>
        <View style={styles.email}>
          <Text style={styles.emailTitle}>Your Northwestern Email</Text>
          <View style={styles.inputRow}>
          <TextInput
              style={styles.emailInput}
              onChangeText={(email) => {
                this.setState({email});
                constEmail = email;
              }}
              onSubmitEditing={(event) => {
                storeEmail(event.nativeEvent.text);
                this.checkEmail(event.nativeEvent.text);
                this.loadSchedulerData(event.nativeEvent.text);
            }}
              value={this.state.email}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <ThemeProvider theme={theme}>
          <Button 
            onPress={this.onPressDoStuff}
            style={styles.button}
            title="Authenticate with sticker"
            type='outline'
          />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}> Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.day1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.day2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.day3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.day4method}</Text> 
        </View>
      </View>
      );
    } else if (this.state.method == 'card') {
      return (
      <View style={styles.container}>
        <Text style={styles.title}>Garrett's Authenticator</Text>
        <View style={styles.email}>
          <Text style={styles.emailTitle}>Your Northwestern Email</Text>
          <View style={styles.inputRow}>
          <TextInput
              style={styles.emailInput}
              onChangeText={(email) => {
                this.setState({email});
                constEmail = email;
              }}
              onSubmitEditing={(event) => {
                storeEmail(event.nativeEvent.text);
                this.checkEmail(event.nativeEvent.text);
                this.loadSchedulerData(event.nativeEvent.text);
            }}
              value={this.state.email}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <ThemeProvider theme={theme}>
          <Button 
            onPress={this.onPressDoStuff}
            title="Authenticate with card"
            style={styles.button}
            type='outline'
          />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}> Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.day1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.day2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.day3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.day4method}</Text> 
        </View>
      </View>
      );
    } else if (this.state.method == 'text-code') {
      return (
      <View style={styles.container}>
        <Text style={styles.title}>Garrett's Authenticator</Text>
        <View style={styles.email}>
          <Text style={styles.emailTitle}>Your Northwestern Email</Text>
          <View style={styles.inputRow}>
          <TextInput
              style={styles.emailInput}
              onChangeText={(email) => {
                this.setState({email});
                constEmail = email;
              }}
              onSubmitEditing={(event) => {
                storeEmail(event.nativeEvent.text);
                this.checkEmail(event.nativeEvent.text);
                this.loadSchedulerData(event.nativeEvent.text);
            }}
              value={this.state.email}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <ThemeProvider theme={theme}>
        <TextInput
              style={styles.textCodeInput}
              onChangeText={(textCode) => {
                this.setState({textCode});
              }}
              value={this.state.textCode}
          />
        <Button 
          onPress={this.onPressDoStuff}
          title="Authenticate Your Code"
          style={styles.button}
          type='outline'
        />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}> Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.day1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.day2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.day3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.day4method}</Text> 
        </View>
      </View>
      );
    } else {
      return (
      <View style={styles.container}>
        <Text style={styles.title}>Garrett's Authenticator</Text>
        <View style={styles.email}>
          <Text style={styles.emailTitle}>Your Northwestern Email</Text>
          <View style={styles.inputRow}>
          <TextInput
              style={styles.emailInput}
              onChangeText={(email) => {
                this.setState({email});
                constEmail = email;
              }}
              onSubmitEditing={(event) => {
                storeEmail(event.nativeEvent.text);
                this.checkEmail(event.nativeEvent.text);
                this.loadSchedulerData(event.nativeEvent.text);
            }}
              value={this.state.email}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <ThemeProvider theme={theme}>
        <Button 
          onPress={this.onPressDoStuff}
          title="Authenticate - No Device Needed"
          style={styles.button}
          type='outline'
        />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}> Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.day1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.day2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.day3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.day4method}</Text> 
        </View>
      </View>
      );
    }
  }

  async getSchedulerData(email) {
    try {
      let uri = 'http://18.212.193.41:8080/scheduler/' + email;
      let response = await fetch(uri, {method: 'GET'});
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  

  onPressDoStuff() {
    // console.log('textbox:',this.state.email)
    storeEmail(constEmail);
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
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191970',
    color: 'white',
    padding: 40
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
    width: 210,
    color: 'white',
    fontSize: 14,
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textCodeInput: {
    height: 40,
    width: 210,
    color: 'white',
    fontSize: 14,
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
  },
  emailTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    marginTop: 20,
    marginBottom: 40
  },
  title: {
    marginBottom: 40,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputIcon: {
    opacity: 0
  },
  scheduleTitleStyle: {
    marginTop: 40,
    textDecorationLine: 'underline',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  scheduleStyle: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
});
