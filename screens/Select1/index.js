import React, {useState, useEffect, Component} from 'react';
import { View, Image, Text, Button, StyleSheet, Alert, TouchableOpacity, TouchableHighlight, Dimensions, Modal, TextInput } from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import { FlatList } from 'react-native-gesture-handler';
import { List, ListItem, SearchBar } from "react-native-elements";
import parseYouTubeUrl from '../../parseYouTubeUrl';
import MMKV from 'react-native-mmkv-storage';

// get page dimensions
var { height, width } = Dimensions.get('window');
var box_count = 2;
var y2height= 80;
var compare_height = 150;
var box_height = (height-y2height-compare_height )/ box_count;
var ytID = "F0PW2sVi2EQ";

const MMKVStorage = new MMKV.Loader().withEncryption().initialize();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  btnRow: {
    backgroundColor: '#006AEA',
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 50
  },
    btnRowM: {
      backgroundColor: 'white',
      height: '20'
    },
  whiteText: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    fontSize: 20
  },
  blackText: {
      color: 'black',
      textAlign: 'center',
      padding: 10,
      fontSize: 20
    },
    whiteText2: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20,
      padding: 10
    },
  icon: {
    resizeMode: 'contain',
    height: 100,
    width:200
  },
  plusIcon: {
    resizeMode: 'contain',
    height:30,
    width:30,
  },
  listIcon: {
    resizeMode: 'center',
    height:8,
    width:8,
    paddingTop:24
  },
  y2logo: {
    height: 30,
    width:200,
    resizeMode: 'contain',
  },
  y2Text:{
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  listText:{
    fontSize: 18,
    paddingLeft:8
  },
  y2View: {
    padding: 20,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006AEA',
    height: y2height
  },
  box: {
    height: box_height
  },
  box1: {
    backgroundColor: '#0018C6',
    height: 100

  },
  tOpac: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 15
  },
  mBtn: {
    color: "#32BAFA"
  },
  box2: {
    height: box_height,
    backgroundColor: '#32BAFA'
  },
  box3: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  listView: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      padding: 10
  },
  button1:{
    color: '#03fcc6'
  },
  selected:{
    backgroundColor: "#DDDDDD",
  },
  modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      }},
  m1: {
    backgroundColor: '#DDDDDD',
    resizeMode: 'contain',
    padding: 10,
    width: width-40
  },
  tInput: { height: 40, margin: 10, width: width-80, padding: 10, borderColor: 'gray', borderWidth: 1 }
});

class Select1Comp extends Component {

  constructor(props){
      super(props);
  }

  state = {
    data: this.props.listData,
    selected: '1',
    selectedVideo: 'F0PW2sVi2EQ',
    modalVis: false,
    nickname: 'Title',
    vidInput: 'URL',
    nextKey: this.props.listData.length+1
  }
    //
    componentDidMount() {
        console.log('mounted');
        //savedData = testMMKV();
        //this.setState({data: savedData});
        //console.log(savedData);
    }

    // this gets called after add item and selected
     componentDidUpdate(){
       console.log('Updated');
       console.log(this.state.selected);
       //console.log(this.state.vidInput);
       ytID = this.state.selectedVideo;
     }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#6435DE",
                }}
            />
        );
    };
    //handling onPress action
    getListViewItem = (item) => {
        this.setState({ selected: item.key, selectedVideo: item.vidTag });
    }

    //show modal
    showModal = () => {
        this.setState({ modalVis: !this.state.modalVis});
    }

    //addItem adds a new element to flatlist
    // will eventually be called after modal based input
    addItem = () => {
        console.log('addItem');
        //var LL = this.state.data.length + 1;
        //var lS = LL.toString();
        var lS = this.state.nextKey.toString();
        const result = parseYouTubeUrl(this.state.vidInput);
        console.log(result);
        sampleData = [...this.state.data , {key : lS, vidTag: result.videoId, name: this.state.nickname}];
        this.setState({
            data: sampleData,
            nextKey: this.state.nextKey+1
        });
        MMKVStorage.setArrayAsync('listData', sampleData);
    }

    removeItem = () => {
        console.log('removeItem');
        // iterate through data
        var LL = this.state.data.length+1;
        //var LL = this.state.nextKey;
        var newData = [];
        for (var i=1; i<LL; i++){
            console.log(this.state.data[i-1].key);
            //if (i.toString()!=this.state.selected){
            if (this.state.data[i-1].key!=this.state.selected){
                //console.log(i.toString());
                newData.push(this.state.data[i-1]);
            } else {
                console.log('removed');
                console.log(this.state.data[i-1].key);
            }
        }
        this.setState({
            data: newData
        });
        MMKVStorage.setArrayAsync('listData', newData);
    }


  render() {
  const {data} = this.state
  return (
        <>
        <View style={{height: box_height-60}}>
        <FlatList style={{overflow: 'hidden'}}
            data={data}
            renderItem={({item}) =>
            <TouchableOpacity
                onPress={this.getListViewItem.bind(this, item)}
                style={item.key === this.state.selected ? styles.selected : null}
                >
                <View style={styles.listView}>
                    <Image
                        style={styles.listIcon}
                        source={require('./dot.png')}
                    />
                    <Text style={styles.listText}>{item.name}</Text>
                </View>
            </TouchableOpacity>}
            ItemSeparatorComponent={this.renderSeparator}
      /></View>
            <View style={styles.btnRow}>
                <TouchableOpacity
                  style={{paddingTop:15}}
                  onPress={this.showModal}
                >
                  <Image
                      style={styles.plusIcon}
                      source={require('./plus2.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.removeItem}
                  style={{paddingTop:15, paddingLeft:15, paddingRight:10}}
                  >
                  <Image
                      style={styles.plusIcon}
                      source={require('./trash.png')}
                  />
                </TouchableOpacity>
              </View>
        <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVis}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
            <View style={styles.modalView}>
              <View style={styles.m1}><Text style={styles.listText}>Add New Comparison Video</Text></View>
                  <TextInput
                    style={styles.tInput}
                    onChangeText={text => this.setState({nickname: text})}
                    value={this.state.nickname}
                  />
                <TextInput
                  style={styles.tInput}
                  onChangeText={text => this.setState({vidInput: text})}
                  value={this.state.vidInput}
                />
            <View style={{flex: 0, flexDirection:'row'}}>
              <TouchableOpacity style={{backgroundColor: '#006AEA', padding:6,width:'40%'}}
                onPress={() => {
                  this.setState({modalVis: false});
                  this.addItem();
                }}
              ><Text style={styles.y2Text}>Save</Text>
              </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 5,backgroundColor: '#ff3526', padding:6, width:'40%'}}
                  onPress={() => {
                    this.setState({modalVis: false});
                  }}
                ><Text style={styles.y2Text}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>
      </>
  );
  }
}

const Select1 = ({ navigation, route }) => {

    const [sour, setSour] = useState({uri: 'https://vjs.zencdn.net/v/oceans.mp4'});

    function selectImage() {
    let options = {
      title: 'Choose one image',
       mediaType: 'video',
      storageOptions: {
        skipBackup: true
      }
    };
    launchImageLibrary(options, response => {
          console.log({ response });
            if (response.didCancel) {
              console.log('User cancelled photo picker');
              Alert.alert('You did not select any image');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
              setSour(response.uri);
              Alert.alert('Video selection loaded');
            }
          });
    }

    return(
        <View style={styles.container}>
            <View style={[styles.box, styles.box3]}>
                <TouchableOpacity
                    title="Select local video"
                    onPress={selectImage}

                >
                    <Text style={styles.blackText}>Select your video here</Text>
                    <Image
                        style={styles.icon}
                        source={require('./cameraicon.png')}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.y2View}>
                <Text style={styles.y2Text}>
                    List of comparison video links:
                </Text>
            </View>
            <View style={[styles.box, styles.box2]}>
                <Select1Comp listData={route.params.listData}/>
            </View>
            <View style={styles.box1}>
                <TouchableOpacity
                    style={styles.tOpac}
                    onPress={() => navigation.navigate('YoutubeCompare', {vidlink: sour, ytID: ytID})}
                >
                <Text style={styles.whiteText2}>Compare Videos</Text>
                 <Image
                        style={styles.plusIcon}
                        source={require('./next2.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

}

export default Select1;