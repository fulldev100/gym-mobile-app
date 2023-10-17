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
    Modal,
    Button,
    Dimensions
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from "react-redux";
import { fetchHomelist, postMembership, loadingStart } from "../../redux/actions/home";
import { Logoutmember } from "../../redux/actions/auth";
import { t, setLanguage } from '../../../../locals';
import styleCss from '../../../style.js';
import * as WebBrowser from 'expo-web-browser';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { POST_MEMBERSHIP } from '../../redux/constant/types';

import SelectDropdown from 'react-native-select-dropdown'

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

export const membershipData = (data) => {
    return {
        type: POST_MEMBERSHIP,
        data,
      // OR map specific attributes from the data object
    }
  }

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageLoading: false,
            modalVisible: false,
            cardNumber: '',
            isBuyNewThing: true,
            selectedLn: 'en',
            lang_value: 0
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    isCloseWebpay = () => {
        this.props.membershipData({"result": ""})
        this.myhomedata();
    }

    async setModalVisible(cardNumber) {
        this.setState({ cardNumber: cardNumber, modalVisible: true });
    }

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

    componentDidMount() {
        this.myhomedata();
    }

    async myhomedata() {

        const { fetchHomelist, loadingStart } = this.props;

        this.setState({ isBuyNewThing: false })
        loadingStart();
        const Id = await SecureStore.getItemAsync("id");
        const Token = await SecureStore.getItemAsync("access_token");

        console.log("----------myhome----------")
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

    _handleBackButtonClick = () => {
        Alert.alert(t("Hold on!"), t("Are you sure you want to exit app?"), [
            {
              text: t("No"),
              onPress: () => null,
              style: "cancel",
            },
            { text: t("Yes"), onPress: () => BackHandler.exitApp() },
          ]);
          return true;
    }

    changeKIOSKView = () => {
        this.setState({ isBuyNewThing: !this.state.isBuyNewThing })
    }

    openBrowser = async (url) => {
        // Check if the device supports opening URLs
        await WebBrowser.openBrowserAsync(url);
      };

    handleOpenBrowser = () => {
        this.openBrowser('http://24hr-fitness.eu');
    };

    handleBuyPress = async (membership_id) => {
        
        const { postMembership, loadingStart } = this.props;

        loadingStart();
        const Id = await SecureStore.getItemAsync("id");
        const Token = await SecureStore.getItemAsync("access_token");

        const membership_data = {
            "current_user_id": Id,
            "access_token": Token,
            "membership_id": membership_id
        };
        postMembership(membership_data);

    };

    Visible = (visible) => {
        console.log(visible)
        this.setState({ modalVisible: false });
    }

    renderItem = ({ item }) => {
        const { modalVisible } = this.state;
        const { MembershipData, paymentURL } = this.props;
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
                        <Text style={styleCss.NaveText}>24hr-fitness.eu</Text>
                    </Col>

                    <Col style={styleCss.AlignRightNavbar}>
                        <View style={styleCss.NavBarCreditView}>
                            <Text style={styleCss.NaveCreditTitleText}>{t("Price")}:</Text>
                            <Text style={styleCss.NaveCreditText}>{item.amount} {item.currency_symbol}</Text>
                        </View>
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

                {
                !this.state.isBuyNewThing ? 
                
                <TouchableOpacity key={[1]} onPress={() => this.setModalVisible(item.card_number)} style={styleCss.TouchScreenCSS}>

                    {
                        item.payment_status == "Fully Paid"?
                        <Text style={styleCss.MembershipTitle}>{item.membership_title}</Text>
                        :
                        <Text style={styleCss.MembershipTitle}>{item.membership_title} ( {item.payment_status} )</Text>
                    }
                    

                    <View style={styleCss.ImageLogoContainer}>
                        <Image style={styleCss.nutrition_list_image}
                            source={require('../../../images/Logo.png')}
                        />
                        <Text style={styleCss.MembershipValidDate}>{item.membership_valid_from} To {item.membership_valid_to}</Text>
                    </View>
                    
                    <Text style={styleCss.MembershipMemberName}>{item.member_name}</Text>
                    <Text style={styleCss.MembershipMemberEmail}>{item.member_email}</Text>

                    <View style={styleCss.MembershipCardView}>
                        <>
                            <Row>
                                <Col>
                                    <Text style={styleCss.MembershipMemberEmail}>{t("Virtual Card no")}:</Text>
                                </Col>
                                <Col>
                                    <Text style={styleCss.MembershipCardNumber}>{item.card_number}</Text>
                                </Col>
                            </Row>
                            <Image style={styleCss.Membership_card_image} source={
                                item.card_number
                                ? { uri: 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=' + item.card_number }
                                : null
                            } />
                            <Text>{t("Click the image to zoom")}</Text>
                        </>
                        <View style={styleCss.containerButton}>
                            <TouchableOpacity style={styleCss.button} onPress={() => this.changeKIOSKView()}>
                                <Text style={styleCss.buttonText}>{t("Buy new membership")}</Text>
                            </TouchableOpacity>
                        </View>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}>

                            <View style={styleCss.qr_modal_main_view}>

                                <View style={styleCss.SubImageContainer}>

                                    <Row style={styleCss.membership_modal_row}>
                                        <Col style={styleCss.group_name_col}>
                                            <Text numberOfLines={1} style={styleCss.group_name_text}>{t("Take the image near the device")}</Text>
                                        </Col>
                                        <Col style={styleCss.group_back_arrow_col}>
                                            <TouchableOpacity onPress={() => { this.Visible(false) }} style={styleCss.group_back_arrow_text}>
                                                <Image
                                                    style={styleCss.group_close_image}
                                                    source={require('../../../images/Close-blue-512.png')} />
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>

                                    <View key={[1]} style={styleCss.SubImageContainer}>
                                        
                                        <TouchableOpacity onPress={() => { this.Visible(false) }} style={styleCss.zoomQRCode}>
                                            <Image onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                                onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                                                source={
                                                    item.card_number
                                                    ? { uri: 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=' + item.card_number }
                                                    : null
                                                }
                                                style={styleCss.ZoomProductImage} />
                                        </TouchableOpacity>
                                        
                                        <ActivityIndicator
                                            style={styleCss.loading}
                                            animating={this.state.ImageLoading}
                                            // size="small"
                                            color="#102b46"
                                        />
                                    </View>
                                </View>
                            </View>
                        </Modal>

                    </View>

                </TouchableOpacity>

                :

                <>
                {
                    MembershipData ? 
                    <>
                    <View style={{marginBottom: 85}}>    
                        {MembershipData.map(r => 
                            <>
                                <Row style={styleCss.MembershipCard}>
                                    <Col style={styleCss.membership_list_name_col}>
                                        <Text style={styleCss.MembershipTitleText}>{r.membership_label}</Text>
                                        <Text style={styleCss.MemebshipSignupFeeText}>{t("Signp fee")}</Text>

                                        {/* <Text style={styleCss.NaveText}> {r.membership_description} </Text> */}

                                        <Button title={t("Pay By GP Webpay")} color={'#f4ba16'} style={styleCss.Product_buy_button} onPress={() => this.handleBuyPress(r.membership_id)} />
                                    </Col>
                                    <Col style={styleCss.nutrition_list_name_col_1}>
                                    </Col>

                                    <Col style={styleCss.MembershipTitleText}>
                                        <Text style={styleCss.MembershipTitleText}>€{r.membership_amount}</Text>
                                        <Text style={styleCss.MemebshipSignupFeeText}>€{r.signup_fee}</Text>

                                        {/* <Text style={styleCss.NaveText}></Text> */}
                                        <Text style={{ border: "none", boxShadow: "none" }} ></Text>
                                    </Col>
                                </Row>
                            </>)
                            }    
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={paymentURL != ""}>

                        <View style={styleCss.group_modal_main_view}>

                            <View style={styleCss.gpwebpay_modal_view}>
                                <Row style={styleCss.membership_modal_row}>
                                    <Col style={styleCss.group_name_col}>
                                        <Text numberOfLines={1} style={styleCss.group_name_text}>{t("Thanks for your funding")}</Text>
                                    </Col>
                                    <Col style={styleCss.group_back_arrow_col}>
                                        <TouchableOpacity onPress={() => { this.isCloseWebpay() }} style={styleCss.group_back_arrow_text}>
                                            <Image
                                                style={styleCss.group_close_image}
                                                source={require('../../../images/Close-blue-512.png')} />
                                        </TouchableOpacity>
                                    </Col>
                                </Row>

                                <View key={[1]} style={styleCss.SubImageContainer}>
                                    <AutoHeightWebView
                                        style={{ width: Dimensions.get('window').width,  marginTop: 1 }}
                                        customScript={`document.body.style.background = 'transparent';`}
                                        customStyle={`
                                        * {
                                            // font-family: 'Times New Roman';
                                            // font-size: 11px !important;
                                        }
                                        `}
                                        onSizeUpdated={size => {}}
                                        files={[{
                                            href: 'cssfileaddress',
                                            type: 'text/css',
                                            rel: 'stylesheet'
                                        }]}
                                        source={{ uri: paymentURL }}
                                        scalesPageToFit={true}
                                        viewportContent={'width=device-width, user-scalable=yes'}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    </>
                    :
                    <Text>{t("Membership not found")}</Text>
                }
                </>
                    
                }
            </View>
        )
    }
    render() {
        const { modalVisible, cardNumber } = this.state;
        const { navigate } = this.props.navigation;
        const { Data, MembershipData, paymentURL, loading } = this.props;

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
                            <Row style={styleCss.NaveBar}>
                                <Col>
                                    <TouchableOpacity style={styleCss.logout_image} onPress={() => this.logout() }>
                                        <Image style={styleCss.logout_image}
                                            source={require('../../../images/Logout-white.png')}
                                        />
                                    </TouchableOpacity>
                                </Col>
                                <Col style={styleCss.nutrition_list_name_col}>
                                    <Text style={styleCss.NaveText}>24hr-fitness.eu</Text>
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
                            
                            <View style={styleCss.BuyNewMembershipView} >
                                <TouchableOpacity onPress={() => this.changeKIOSKView()}>
                                    <Text adjustsFontSizeToFit={true} style={styleCss.BuyNowText} >{!this.state.isBuyNewThing ? t("Buy now") : t("Close")}</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.isBuyNewThing ? 
                                <>
                                    {
                                        MembershipData ? 
                                        <>
                                        <View style={{marginBottom: 85}}>    
                                            {MembershipData.map(r => 
                                                <>
                                                    <Row style={styleCss.MembershipCard}>
                                                        <Col style={styleCss.membership_list_name_col}>
                                                            <Text style={styleCss.MembershipTitleText}>{r.membership_label}</Text>
                                                            <Text style={styleCss.MemebshipSignupFeeText}>Signp fee</Text>

                                                            {/* <Text style={styleCss.NaveText}> {r.membership_description} </Text> */}

                                                            <Button title={t("Pay By GP Webpay")} color={'#f4ba16'} style={styleCss.Product_buy_button} onPress={() => this.handleBuyPress(r.membership_id)} />
                                                        </Col>
                                                        <Col style={styleCss.nutrition_list_name_col_1}>
                                                        </Col>

                                                        <Col style={styleCss.MembershipTitleText}>
                                                            <Text style={styleCss.MembershipTitleText}>€{r.membership_amount}</Text>
                                                            <Text style={styleCss.MemebshipSignupFeeText}>€{r.signup_fee}</Text>

                                                            {/* <Text style={styleCss.NaveText}></Text> */}
                                                            <Text style={{ border: "none", boxShadow: "none" }} ></Text>
                                                        </Col>
                                                    </Row>
                                                </>)
                                                }    
                                        </View>

                                        <Modal
                                            animationType="slide"
                                            transparent={true}
                                            visible={paymentURL != ""}>

                                            <View style={styleCss.group_modal_main_view}>

                                                <View style={styleCss.gpwebpay_modal_view}>
                                                    <Row style={styleCss.membership_modal_row}>
                                                        <Col style={styleCss.group_name_col}>
                                                            <Text numberOfLines={1} style={styleCss.group_name_text}>{t("Thanks for your funding")}</Text>
                                                        </Col>
                                                        <Col style={styleCss.group_back_arrow_col}>
                                                            <TouchableOpacity onPress={() => { this.isCloseWebpay() }} style={styleCss.group_back_arrow_text}>
                                                                <Image
                                                                    style={styleCss.group_close_image}
                                                                    source={require('../../../images/Close-blue-512.png')} />
                                                            </TouchableOpacity>
                                                        </Col>
                                                    </Row>

                                                    <View key={[1]} style={styleCss.SubImageContainer}>
                                                        <AutoHeightWebView
                                                            style={{ width: Dimensions.get('window').width,  marginTop: 1 }}
                                                            customScript={`document.body.style.background = 'transparent';`}
                                                            customStyle={`
                                                            * {
                                                                // font-family: 'Times New Roman';
                                                                // font-size: 11px !important;
                                                            }
                                                            `}
                                                            onSizeUpdated={size => {}}
                                                            files={[{
                                                                href: 'cssfileaddress',
                                                                type: 'text/css',
                                                                rel: 'stylesheet'
                                                            }]}
                                                            source={{ uri: paymentURL }}
                                                            scalesPageToFit={true}
                                                            viewportContent={'width=device-width, user-scalable=yes'}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </Modal>
                                        </>
                                        :
                                        <Text>{t("Membership not found")}</Text>
                                    }
                                </>
                                :
                                <EmptyComponent title={t("Data not available")} visible={true} />
                            }
                            </>
                            
                        }
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={false}
                                onRefresh={() => {}}
                            />
                        }
                    />
                    
                    <View style={styleCss.bottomView}>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myHome')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_gym.png')}
                                />
                                <Text style={styleCss.bottomViewColumnTextActive}>{t("Home")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('location')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_location.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Location")}</Text>
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
                            <TouchableOpacity onPress={() => this.myhomedata()} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_refresh.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Refresh")}</Text>
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
                                <Text style={styleCss.bottomViewColumnTextActive}>{t("Home")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('location')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_location.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Location")}</Text>
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

// empty component
const EmptyComponent = ({ title, visible }) => (
    <View style={styleCss.emptyContainer} visible={visible}>
        <Text style={styleCss.emptyText}>{title}</Text>
    </View>
);

const mapStateToProps = (state) => {
    return {
        Data: state.home.homeData,
        MembershipData: state.home.membership,
        paymentURL: state.membership.membershipResultData,
        loading: state.home.loading,
    };
};

const mapDispatchToProps = {
    fetchHomelist,
    postMembership,
    Logoutmember,
    loadingStart,
    membershipData
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);