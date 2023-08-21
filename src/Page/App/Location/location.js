import React, { Component } from 'react';
import {
    BackHandler,
    ActivityIndicator,
    RefreshControl,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from "react-redux";
import { fetchHomelist, loadingStart } from "../../redux/actions/home";
import { Logoutmember } from "../../redux/actions/auth";
import { t,setLanguage } from '../../../../locals';
import styleCss from '../../../style.js';
import { WebView } from 'react-native-webview';
import SelectDropdown from 'react-native-select-dropdown'

const buggyHtml = `
<style>/*! elementor - v3.9.2 - 21-12-2022 */<br />
.elementor-widget-google_maps .elementor-widget-container{overflow:hidden}.elementor-widget-google_maps iframe{height:300px}
</style>
<iframe title="Bidovce 316" style="width: 100%; height: 100% !important" src="https://maps.google.com/maps?q=Bidovce%20316&amp;t=m&amp;z=10&amp;output=embed&amp;iwloc=near" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" aria-label="Bidovce 316"></iframe>
`;

const lang_region = [
    {
        value: "en",
        label: t("England")
    },
    {
        value: "sl",
        label: t("Slovakia")
    }
  ];

class MyLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLn: 'en',
            lang_value: 0
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    logout = async () => {
        Alert.alert(t("Gym App"), t("Are you sure you want to exit app?"), [
          {
            text: t("No"),
            onPress: () => this.myhomedata(),
            style: "cancel",
          },
          { text: t("Yes"), onPress: () => this.memberLogout()},
        ]);
        // await SecureStore.deleteItemAsync("userid");
        // await SecureStore.deleteItemAsync("access_token");
      };
    
    async memberLogout() {
        const { Logoutmember, loadingStart } = this.props;
        const { navigate } = this.props.navigation;
        loadingStart();
        const Id = await SecureStore.getItemAsync("id");
        const Token = await SecureStore.getItemAsync("access_token");
        const userData = {
            "current_user_id": Id,
            "access_token": Token,
        };
        Logoutmember(userData, navigate);
    }
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    componentDidMount() {
        this.myhomedata();
    }

    async myhomedata() {
        const { fetchHomelist, loadingStart } = this.props;
        loadingStart();
        const Id = await SecureStore.getItemAsync("id");
        const Token = await SecureStore.getItemAsync("access_token");

        const home_data = {
            "current_user_id": Id,
            "access_token": Token,
        };
        fetchHomelist(home_data);
    }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    onRefresh() {
        this.myhomedata();
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('myHome')
    renderItem = ({ item }) => {
        const { Gym_name, Gym_address, Gym_map_address, Gym_alternate_phone_number, Gym_contact_number, Gym_country, Gym_email } = this.props;
        return (
            <View style={styleCss.MembershipView}>
                <Row style={styleCss.NaveBar}>
                    <Col>
                        <TouchableOpacity style={styleCss.logout_image} onPress={() => this.logout() }>
                            <Image style={styleCss.logout_image}
                                source={require('../../../images/Logout-white.png')}
                            />
                        </TouchableOpacity>
                    </Col>
                    <Col style={styleCss.nutrition_list_name_col}>
                    </Col>

                    <Col style={styleCss.AlignRightNavbar}>
                        <SelectDropdown
                            data={lang_region}
                            defaultValueByIndex={this.state.lang_value}
                            onSelect={(selectedItem, index) => {
                            //   console.log(selectedItem, index)
                            //   this.setState({ selectedLn: selectedItem.value })
                                this.setState({lang_value: index})
                                setLanguage(selectedItem.value)
                            }}
                            dropdownIconPosition={'left'}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                return selectedItem.label
                            }}
                            rowTextForSelection={(item, index) => {
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item.label
                            }}
                            buttonStyle={styleCss.dropdown1BtnStyle}
                            buttonTextStyle={styleCss.dropdown1BtnTxtStyle}
                            renderDropdownIcon={isOpened => {
                                return <></>;
                            }}
                            dropdownStyle={styleCss.dropdown1DropdownStyle}
                            rowStyle={styleCss.dropdown1RowStyle}
                            rowTextStyle={styleCss.dropdown1RowTxtStyle}
                        />
                    </Col>
                </Row>
                <TouchableOpacity key={item} style={styleCss.TouchScreenCSS}>

                    <View style={styleCss.ImageLogoContainer}>
                        <WebView
                            style={styleCss.HTMLViewContainer}
                            originWhitelist={['*']}
                            source={{ html: 
                                `
                                <style>/*! elementor - v3.9.2 - 21-12-2022 */<br />
                                .elementor-widget-google_maps .elementor-widget-container{overflow:hidden}.elementor-widget-google_maps iframe{height:300px}
                                </style>
                                <iframe title="{Gym_address}" style="width: 100%; height: 100% !important" src="https://maps.google.com/maps?q=Bidovce%20316&amp;t=m&amp;z=10&amp;output=embed&amp;iwloc=near" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" aria-label="{Gym_address}"></iframe>
                                `
                             }}
                            />
                    </View>
                    
                    <Text style={styleCss.MembershipMemberName}>{Gym_name}</Text>
                    <Text style={styleCss.MembershipMemberName}>
                        {Gym_address} {Gym_country}
                    </Text>

                    <Text style={styleCss.MembershipMemberEmail}>{Gym_email}</Text>
                    <Text style={styleCss.MembershipMemberEmail}>{Gym_contact_number}</Text>

                </TouchableOpacity>
            </View>
        )
    }
    render() {

        const { navigate } = this.props.navigation;
        const { Data, Gym_name, Gym_address, Gym_alternate_phone_number, Gym_contact_number, Gym_country, Gym_email, loading } = this.props;

        if (!loading) {
            return (
                <View style={styleCss.containerMain}>
                    <FlatList
                        data={Data}
                        renderItem={this.renderItem}
                        style={styleCss.FlatListCss}
                        keyExtractor={(item) => {item.invoice_id}}
                        ListEmptyComponent={
                            <>
                            <View style={styleCss.MembershipView}>
                                <Row style={styleCss.NaveBar}>
                                    <Col>
                                        <TouchableOpacity style={styleCss.logout_image} onPress={() => this.logout() }>
                                            <Image style={styleCss.logout_image}
                                                source={require('../../../images/Logout-white.png')}
                                            />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={styleCss.nutrition_list_name_col}>
                                    </Col>

                                    <Col style={styleCss.AlignRightNavbar}>
                                        <SelectDropdown
                                            data={lang_region}
                                            defaultValueByIndex={this.state.lang_value}
                                            onSelect={(selectedItem, index) => {
                                            //   console.log(selectedItem, index)
                                            //   this.setState({ selectedLn: selectedItem.value })
                                                this.setState({lang_value: index})
                                                setLanguage(selectedItem.value)
                                            }}
                                            dropdownIconPosition={'left'}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                // text represented after item is selected
                                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                                return selectedItem.label
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                // text represented for each item in dropdown
                                                // if data array is an array of objects then return item.property to represent item in dropdown
                                                return item.label
                                            }}
                                            buttonStyle={styleCss.dropdown1BtnStyle}
                                            buttonTextStyle={styleCss.dropdown1BtnTxtStyle}
                                            renderDropdownIcon={isOpened => {
                                                return <></>;
                                            }}
                                            dropdownStyle={styleCss.dropdown1DropdownStyle}
                                            rowStyle={styleCss.dropdown1RowStyle}
                                            rowTextStyle={styleCss.dropdown1RowTxtStyle}
                                        />
                                    </Col>
                                </Row>
                                <TouchableOpacity key={1} style={styleCss.TouchScreenCSS}>

                                    <View style={styleCss.ImageLogoContainer}>
                                        <WebView
                                            style={styleCss.HTMLViewContainer}
                                            originWhitelist={['*']}
                                            source={{ html: 
                                                `
                                                <style>/*! elementor - v3.9.2 - 21-12-2022 */<br />
                                                .elementor-widget-google_maps .elementor-widget-container{overflow:hidden}.elementor-widget-google_maps iframe{height:300px}
                                                </style>
                                                <iframe title="{Gym_address}" style="width: 100%; height: 100% !important" src="https://maps.google.com/maps?q=Bidovce%20316&amp;t=m&amp;z=10&amp;output=embed&amp;iwloc=near" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" aria-label="{Gym_address}"></iframe>
                                                `
                                             }}
                                            />
                                    </View>
                                    
                                    <Text style={styleCss.MembershipMemberName}>{Gym_name}</Text>
                                    <Text style={styleCss.MembershipMemberName}>
                                        {Gym_address} {Gym_country}
                                    </Text>

                                    <Text style={styleCss.MembershipMemberEmail}>{Gym_email}</Text>
                                    <Text style={styleCss.MembershipMemberEmail}>{Gym_contact_number}</Text>

                                </TouchableOpacity>
                            </View>
                            </>
                        }
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={loading}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    />
                    <View style={styleCss.bottomView}>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myHome')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_gym.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Home</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_location.png')}
                                />
                                <Text style={styleCss.bottomViewColumnTextActive}>Location</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('products')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_product.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Product</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.myhomedata()} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_refresh.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Refresh</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styleCss.containerMain}>
                    <Text></Text>
                    <ActivityIndicator
                        style={styleCss.loading}
                        size="large"
                        color="#102b46"
                    />
                    <View style={styleCss.bottomView}>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myHome')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_gym.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Home")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_location.png')}
                                />
                                <Text style={styleCss.bottomViewColumnTextActive}>{t("Location")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('products')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_product.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Product")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.myhomedata() } style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_refresh.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Refresh")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        Data: state.home.homeData,
        Gym_name: state.home.gym_name,
        Gym_address: state.home.gym_address,
        Gym_map_address: state.home.gym_map_address,
        Gym_contact_number: state.home.gym_contact_number,
        Gym_alternate_phone_number: state.home.gym_alternate_phone_number,
        Gym_email: state.home.gym_email,
        Gym_country: state.home.gym_country,
        loading: state.home.loading,
    };
};

const mapDispatchToProps = {
    fetchHomelist,
    Logoutmember,
    loadingStart
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLocation);