/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import CameraRoll from "@react-native-community/cameraroll";
import React, { Component } from 'react';
import { Button, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { EAzureBlobStorageImage } from 'rn-azure-blob-storage';

export default class App extends Component {
  state = {
    photos: []
  }
  async componentDidMount() {
    EAzureBlobStorageImage.configure(
      "ACCOUNT_NAME",
      "SERVER_KEY",
      "imagesV278"
    );
  }
  _handleButtonPress = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        this.setState({ photos: r.edges });
      })
      .catch((err) => {
        console.log("Errror", err)
      });
  };
  render() {
    return (
      <View>
        <Button title="Load Images" onPress={this._handleButtonPress} />
        <ScrollView>
          {this.state.photos.map((p, i) => {
            console.log(p.node)
            return (
              <TouchableOpacity
                onPress={async () => {
                  try{
                    if(Platform.OS.toLowerCase() == "ios"){
                      CameraRoll.getSelectedPhoto(p.node.image.uri)
                      .then(r => {
                        console.log("Testing ",r.node);
                        ///absolute filepath needed for ios
                        var name = await EAzureBlobStorageImage.uploadFile(r.node.image.filepath)
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    
                    }else{
                      var name = await EAzureBlobStorageImage.uploadFile(p.node.image.uri)
                    }
                    
                    console.log("Container File Name", name)
                  }catch(err){
                    console.log("Container File Name Error", err)
                  }
          
                }}
              >
                <Image
                  key={i}
                  style={{
                    width: 300,
                    height: 100,
                  }}
                  source={{ uri: p.node.image.uri }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
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
});
