/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, AsyncStorage, Alert} from 'react-native';
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
      color: '#191970',
      fontWeight: 'bold',
    },
    buttonStyle: {
      backgroundColor: '#bdbdbd',
    },
    raised: true
  },
};

var constEmail = 'none';
var constTextCode = '-1';

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
      constEmail = email;
    } catch (error) {
      console.log(error);
      console.warn('error saving email');
    }
};

const getEmail = async () => {
    try {
      return AsyncStorage.getItem('saved_email').then((response) => {
        console.log('got in async func:',response);
        constEmail = response;
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
        method: 'not-ready',
        email: 'default@u.northwestern.edu',
        emailConfirmed: false,
        textCode: '',

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

        displayday1method: null,
        displayday2method: null,
        displayday3method: null,
        displayday4method: null,
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
      this.checkEmail(promise);
      return(promise);
    }).then((promise) => {
      this.loadSchedulerData(promise);
    });
  }

  // onChange(state) {
  //   this.setState(state);
  // }

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

      } else if (this.state.day2date == day && this.state.day2month == month) {

        this.setState({method: this.state.day2method});
      } else if (this.state.day3date == day && this.state.day3month == month) {

        this.setState({method: this.state.day3method});
      } else if (this.state.day4date == day && this.state.day4month == month) {

        this.setState({method: this.state.day4method});
      }

      if(this.state.day1method == 'text-code'){ this.setState({displayday1method: 'SMS Code'});}
      else if(this.state.day1method == 'sticker'){ this.setState({displayday1method: 'Sticker'}); }
      else if(this.state.day1method == 'card'){ this.setState({displayday1method: 'Card'}); }
      else if(this.state.day1method == 'none'){ this.setState({displayday1method: 'No Device'}); }

      if(this.state.day2method == 'text-code'){ this.setState({displayday2method: 'SMS Code'}); }
      else if(this.state.day2method == 'sticker'){ this.setState({displayday2method: 'Sticker'}); }
      else if(this.state.day2method == 'card'){ this.setState({displayday2method: 'Card'}); }
      else if(this.state.day2method == 'none'){ this.setState({displayday2method: 'No Device'}); }

      if(this.state.day3method == 'text-code'){ this.setState({displayday3method: 'SMS Code'}); }
      else if(this.state.day3method == 'sticker'){ this.setState({displayday3method: 'Sticker'}); }
      else if(this.state.day3method == 'card'){ this.setState({displayday3method: 'Card'}); }
      else if(this.state.day3method == 'none'){ this.setState({displayday3method: 'No Device'}); }

      if(this.state.day4method == 'text-code'){ this.setState({displayday4method: 'SMS Code'}); }
      else if(this.state.day4method == 'sticker'){ this.setState({displayday4method: 'Sticker'}); }
      else if(this.state.day4method == 'card'){ this.setState({displayday4method: 'Card'}); }
      else if(this.state.day4method == 'none'){ this.setState({displayday4method: 'No Device'}); }

      return responseJson;
    }).catch((error) => {
      console.log("server is down", error);
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
    
    this.render();
  }

  render() {
    console.log('rendering');

    if (this.state.method == 'sticker'){
      return (
      <View style={styles.container}>
        <Button
          style={styles.helpStyle}
          icon={
            <Icon
              name="help"
              size={15}
              color="white"
            />
          }
          type="clear"
        />
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
              returnKeyType='done'
              textContentType='emailAddress'
              keyboardType='email-address'
              clearButtonMode='while-editing'
              onEndEditing={(event) => {
                storeEmail(this.state.email);
                this.checkEmail(this.state.email);
                this.loadSchedulerData(this.state.email);
              }}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <ThemeProvider theme={theme}>
          <Button 
            onPress={this.onPressDoStuff}
            style={styles.button}
            title="Authenticate with sticker"
          />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}> Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.displayday1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.displayday2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.displayday3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.displayday4method}</Text> 
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
              returnKeyType='done'
              textContentType='emailAddress'
              keyboardType='email-address'
              clearButtonMode='while-editing'
              onEndEditing={(event) => {
                storeEmail(this.state.email);
                this.checkEmail(this.state.email);
                this.loadSchedulerData(this.state.email);
              }}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <ThemeProvider theme={theme}>
          <Button 
            onPress={this.onPressDoStuff}
            title="Authenticate with card"
            style={styles.button}
          />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}> Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.displayday1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.displayday2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.displayday3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.displayday4method}</Text> 
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
              returnKeyType='done'
              textContentType='emailAddress'
              keyboardType='email-address'
              clearButtonMode='while-editing'
              onEndEditing={(event) => {
                storeEmail(this.state.email);
                this.checkEmail(this.state.email);
                this.loadSchedulerData(this.state.email);
              }}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <ThemeProvider theme={theme}>
        <TextInput
              style={styles.textCodeInput}
              onChangeText={(textCode) => {
                this.setState({textCode});
                constTextCode = textCode;
              }}
              value={this.state.textCode}
              clearTextOnFocus={true}
              returnKeyType='done'
              placeholder='Text message code here'
              placeholderTextColor='#bdbdbd'
              keyboardType='numeric'
          />
        <Button 
          onPress={this.onPressSubmitCode}
          title="Authenticate your code"
          style={styles.button}
        />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}> Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.displayday1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.displayday2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.displayday3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.displayday4method}</Text> 
        </View>
      </View>
      );
    } else if (this.state.method == 'none') {
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
              returnKeyType='done'
              textContentType='emailAddress'
              keyboardType='email-address'
              clearButtonMode='while-editing'
              onEndEditing={(event) => {
                storeEmail(this.state.email);
                this.checkEmail(this.state.email);
                this.loadSchedulerData(this.state.email);
              }}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <ThemeProvider theme={theme}>
        <Button 
          onPress={this.onPressSubmit}
          title="Authenticate - no device deeded"
          style={styles.button}
        />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}> Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.displayday1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.displayday2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.displayday3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.displayday4method}</Text>  
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
              returnKeyType='done'
              textContentType='emailAddress'
              keyboardType='email-address'
              clearButtonMode='while-editing'
              onEndEditing={(event) => {
                storeEmail(this.state.email);
                this.checkEmail(this.state.email);
                this.loadSchedulerData(this.state.email);
              }}
          />
          <ValidIcon validEmail={this.state.emailConfirmed} />
          </View>
        </View>
        <Text style={styles.messageStyle}>Study is not yet underway. Check your schedule for the start date. Feel free to practice authenticating with the Card or Sticker</Text>
        <ThemeProvider theme={theme}>
        <Button 
          onPress={this.onPressDoStuff}
          title="Authenticate a Device"
          style={styles.button}
        />
        </ThemeProvider>
        <Text style={styles.scheduleTitleStyle}>Your Schedule</Text>
        <View>
          <Text style={styles.scheduleStyle}>{this.state.day1month}/{this.state.day1date} - {this.state.displayday1method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day2month}/{this.state.day2date} - {this.state.displayday2method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day3month}/{this.state.day3date} - {this.state.displayday3method}</Text> 
          <Text style={styles.scheduleStyle}>{this.state.day4month}/{this.state.day4date} - {this.state.displayday4method}</Text> 
        </View>
      </View>
      );
    }
  }

  getSchedulerData(email) {
    try {
      var uri = 'http://18.212.193.41:8080/scheduler/' + email;
      return fetch(uri, {method: 'GET'})
        .then((response) => { return response.json(); })
        .catch((error) => { Alert.alert('Server is down, try again in 2 minutes');});
    } catch (error) {
      console.error(error);
    }
  }

  onPressSubmit() {
    var post_url = 'http://18.212.193.41:8080/log/' + constEmail;
    fetch(post_url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'none'
      })
    }).then((response) => {
      success = true;
      console.log(response);
      return response.json();
    }).then((response) => {
      if(response.valid){
        Alert.alert('Response received - 25 cents!');
      } else {
        Alert.alert('Response not in time or wrong method');
      }
    }).catch((error)=>{
      Alert.alert('Server is down, try again in 2 minutes');
    });

  }

  onPressSubmitCode() {
    var post_url = 'http://18.212.193.41:8080/textCode/' + constEmail;
    fetch(post_url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: constTextCode
      })
    }).then((response) => {
      console.log(response);
      return response.json();
    }).then((response) => {
      if(response.valid){
        Alert.alert('Response received - 25 cents!');
      } else {
        Alert.alert('Response not in time, wrong code or wrong method');
      }
    }).catch((error)=>{
      Alert.alert('Server is down, try again in 2 minutes');
    });
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

        console.log(type);
        var post_url = 'http://18.212.193.41:8080/log/' + constEmail;
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
          }).then((response) => {
            console.log(response);
            return response.json();
          }).then((response) => {
            if(response.valid){
              Alert.alert('Response received - 25 cents!');
            } else {
              Alert.alert('Response not in time or wrong method');
            }
          }).catch((error)=>{
            Alert.alert('Server is down, try again in 2 minutes');
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
          }).then((response) => {
            console.log(response);
            return response.json();
          }).then((response) => {
            if(response.valid){
              Alert.alert('Response received - 25 cents!');
            } else {
              Alert.alert('Response not in time or wrong method');
            }
          }).catch((error)=>{
            Alert.alert('Server is down, try again in 2 minutes');
          });
        }
        NfcManager.unregisterTagEvent();
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
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
  messageStyle: {
    marginBottom: 20,
    color: 'white',
    fontSize: 16,
  },
  helpStyle: {
    position: 'absolute',
    left: 150
  },
});
