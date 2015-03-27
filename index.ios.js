'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  NavigatorIOS,
  ActivityIndicatorIOS,
  TouchableHighlight,
  WebView
} = React;

var RCTFav = React.createClass({
  render: function() {
    // FIXME: tintColor does not work
    return (
      <NavigatorIOS
         style={styles.navigator}
         initialRoute={{component: BookmarkListView, title: 'HBFav'}}
         tintColor="#4A90C7"
      />
    );
  }
});

var BookmarkListView = React.createClass({
  getInitialState: function() {
    return {
      bookmarks: null,
      loaded: false
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch('http://feed.hbfav.com/naoya')
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        bookmarks: responseData.bookmarks,
        loaded: true
      });
    })
    .done();
  },

  openBookmark: function(rowData) {
    this.props.navigator.push({
      title: rowData.title,
      component: WebView,
      passProps: {url: rowData.link}
    });
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS animating={true} size='small' />
      </View>
    );
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <BookmarkList
        bookmarks={this.state.bookmarks}
        onPressBookmark={this.openBookmark}
      />
    );
  }
});

var BookmarkList = React.createClass({
  propTypes: {
    bookmarks: React.PropTypes.array.isRequired,
    onPressBookmark: React.PropTypes.func.isRequired
  },

  componentWillMount: function() {
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
  },

  render: function() {
    var dataSource = this.dataSource.cloneWithRows(this.props.bookmarks);
    return (
      <ListView
        dataSource={dataSource}
        renderRow={(rowData) =>
          <Bookmark
             bookmark={rowData}
             onPress={() => this.props.onPressBookmark(rowData)}
          />
        }
        style={styles.listView}
      />
    );
  }
});

var Bookmark = React.createClass({
  propTypes: {
    bookmark: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired
  },

  _onPress: function() {
    this.props.onPress();
  },

  render: function() {
    var bookmark = this.props.bookmark;
    return (
      <TouchableHighlight onPress={this._onPress}>
        <View style={styles.container}>
          <Image
            source={{uri: bookmark.user.profile_image_url}}
            style={styles.profileImage}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.userName}>{bookmark.user.name}</Text>
            <Image
              source={{uri: bookmark.favicon_url}}
              style={styles.favicon}
            />
            <Text style={styles.title}>{bookmark.title}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },

  rightContainer: {
    flex: 1,
    marginLeft: 10
  },

  favicon: {
    width: 16,
    height: 16
  },

  title: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'left',
  },

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  profileImage: {
    width: 48,
    height: 48,
    marginLeft: 10,
  },

  listView: {
  }
});

AppRegistry.registerComponent('RCTFav', () => RCTFav);
