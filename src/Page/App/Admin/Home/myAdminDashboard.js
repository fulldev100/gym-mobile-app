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
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from "react-redux";
import { fetchAdminDashboardlist, loadingStart } from "../../../redux/actions/adminDashboard";
import { Logoutmember } from "../../../redux/actions/auth";
import { t, setLanguage } from '../../../../../locals';
import styleCss from '../../../../style.js';
import SelectDropdown from 'react-native-select-dropdown';

const lang_region = [
    {
        value: "en",
        label: t("England")
    },
    {
        value: "sk",
        label: t("Slovakia")
    }
  ];

const day_region = [
    t("Today"),
    t("This month"),
    t("For 3 month"),
    t("This year"),
    t("So far")
  ];


class MyAdminDashboard extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            ImageLoading: false,
            modalVisible: false,
            cardNumber: '',
            date_region: 1,
            selectedLn: 'en',
            lang_value: 0
        }

        this.setLocalLang()
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    setLocalLang = async () => {
        const lang = await SecureStore.getItemAsync("lang");

        if (lang)
        {
            setLanguage(lang)
            if (lang == 'en') this.setState({lang_value: 0})
            else this.setState({lang_value: 1})
        }

        const date_region_index = await SecureStore.getItemAsync("date_region");
        if (date_region_index)
        this.setState({date_region: date_region_index})
    }

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    Visible(modalVisible) {
        this.setState({ modalVisible: false });
    }

    async setModalVisible(cardNumber) {
        this.setState({ cardNumber: cardNumber,modalVisible: true });
    }

    logout = async () => {
        Alert.alert(t("Gym App"), t("Are you sure you want to exit app?"), [
          {
            text: t("No"),
            onPress: () => {},
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
        this.setLocalLang()
        this.myAdmindata();
    }

    async myAdmindata() {
        const { fetchAdminDashboardlist, loadingStart } = this.props;
        loadingStart();

        const Id = await SecureStore.getItemAsync("id");
        const Token = await SecureStore.getItemAsync("access_token");

        const dashboard_data = {
            "current_user_id": Id,
            "access_token": Token,
            "date_region": this.state.date_region
        };
        fetchAdminDashboardlist(dashboard_data);
    }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    onRefresh() {
        this.myAdmindata();
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

    renderItem = ({ item }) => {
        const { modalVisible } = this.state;
        return (
            <View style={styleCss.MembershipView}>
                <Row style={styleCss.NaveBar}>
                    <Col>
                        <TouchableOpacity style={styleCss.logout_image} onPress={() => this.logout() }>
                            <Image style={styleCss.logout_image}
                                source={require('../../../../images/Logout-white.png')}
                            />
                        </TouchableOpacity>
                    </Col>
                    <Col style={styleCss.nutrition_list_name_col}>
                        <Text style={styleCss.NaveText}>24hr Fitness s.r.o</Text>
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
                <TouchableOpacity key={item.total_membership_price} style={styleCss.TouchScreenCSS}>

                    <View style={styleCss.ImageLogoContainer}>
                        <Image style={styleCss.nutrition_list_image}
                            source={require('../../../../images/Logo.png')}
                            alt='Logo'
                        />

                    <SelectDropdown
                        data={day_region}
                        defaultValueByIndex={this.state.date_region} // use default value by index or default value
                        // defaultValue={'Canada'} // use default value by index or default value
                        onSelect={(selectedItem, index) => {
                            this.setState({date_region: index})
                            this.myAdmindata()

                            SecureStore.setItemAsync("date_region", index)

                            this.setLocalLang()
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                        buttonStyle={styleCss.dropdown2BtnStyle}
                        buttonTextStyle={styleCss.dropdown2BtnTxtStyle}
                        renderDropdownIcon={isOpened => {
                            return <></>;
                        }}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styleCss.dropdown2DropdownStyle}
                        rowStyle={styleCss.dropdown2RowStyle}
                        rowTextStyle={styleCss.dropdown2RowTxtStyle}
                    />

                    </View>

                    <View style={styleCss.MembershipCardView}></View>

                    <View style={styleCss.AdminDashboardRowView}>
                        <View style={styleCss.AdminDashboardColumn}><Text style={styleCss.AdminDashboardSmallLabel}>{t("Membership Amount")}:</Text></View> 
                        <View><Text style={styleCss.MembershipMemberEmail}>€{item.total_membership_price}  </Text></View>
                    </View>

                    <View style={styleCss.AdminDashboardRowView}>
                        <View style={styleCss.AdminDashboardColumn}><Text style={styleCss.AdminDashboardSmallLabel}>{t("Count of Paid Memberships")}:</Text></View> 
                        <View><Text style={styleCss.MembershipMemberEmail}>{item.total_membership_count}  </Text></View>
                    </View>

                    <View style={styleCss.MembershipCardView}></View>

                    <View style={styleCss.AdminDashboardRowView}>
                        <View style={styleCss.AdminDashboardColumn}><Text style={styleCss.AdminDashboardSmallLabel}>{t("Ticket Amount")}:</Text></View>
                        <View><Text style={styleCss.MembershipMemberEmail}>€{item.total_guest_price}  </Text></View>
                    </View>

                    <View style={styleCss.AdminDashboardRowView}>
                        <View style={styleCss.AdminDashboardColumn}><Text style={styleCss.AdminDashboardSmallLabel}>{t("Count of Paid Tickets")}:</Text></View>
                        <View><Text style={styleCss.MembershipMemberEmail}>{item.total_guest_count}  </Text></View>
                    </View>

                    <View style={styleCss.MembershipCardView}></View>

                    <View style={styleCss.AdminDashboardRowView}>
                        <View style={styleCss.AdminDashboardColumn}><Text style={styleCss.AdminDashboardSmallLabel}>{t("Count of Entry in Gym")}:</Text></View>
                        <View><Text style={styleCss.MembershipMemberEmail}>{item.total_entry_in}  </Text></View>
                    </View>

                    <View style={styleCss.AdminDashboardRowView}>
                        <View style={styleCss.AdminDashboardColumn}><Text style={styleCss.AdminDashboardSmallLabel}>{t("Member Usage amount it")}:</Text></View> 
                        <View><Text style={styleCss.MembershipMemberEmail}>{item.total_member_in}  </Text></View>
                    </View>


                    <View style={styleCss.MembershipCardView}></View>

                </TouchableOpacity>
            </View>
        )
    }
    render() {
        const { Data, loading } = this.props;

        if (!loading) {
            return (
                <View style={styleCss.containerMain}>
                    <FlatList
                        data={Data}
                        renderItem={this.renderItem}
                        style={styleCss.FlatListCss}
                        ListEmptyComponent={
                            <>
                            <Row style={styleCss.NaveBar}>
                                <Col>
                                    <TouchableOpacity style={styleCss.logout_image} onPress={() => this.logout() }>
                                        <Image style={styleCss.logout_image}
                                            source={require('../../../../images/Logout-white.png')}
                                        />
                                    </TouchableOpacity>
                                </Col>
                                <Col style={styleCss.nutrition_list_name_col}>
                                    <Text style={styleCss.NaveText}>24hr Fitness s.r.o</Text>
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
                            <EmptyComponent title={t("Data not available")} />
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myAdminDashboard')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-dashboard-active.png')}
                                />
                                <Text style={styleCss.bottomViewColumnTextActive}>{t("Dashboard")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myEntry')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-door-sensor-checked-inactive.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Entry")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('failEntry')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-door-sensor-error-inactive.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Fail")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('mySale')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-sale-inactive.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Sale")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.myAdmindata()} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-refresh-inactive.png')}
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('myAdminDashboard')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-dashboard-active.png')}
                                />
                                <Text style={styleCss.bottomViewColumnTextActive}>{t("Dashboard")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myEntry')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-door-sensor-checked-inactive.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Entry")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('failEntry')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-door-sensor-error-inactive.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Fail")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('mySale')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-sale-inactive.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>{t("Sale")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.myAdmindata()} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/icons8-refresh-inactive.png')}
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
const EmptyComponent = ({ title }) => (
    <View style={styleCss.emptyContainer}>
        <Text style={styleCss.emptyText}>{title}</Text>
    </View>
);

const mapStateToProps = (state) => {
    return {
        Data: state.adminDashboard.adminDashboardData,
        loading: state.adminDashboard.loading,
    };
};

const mapDispatchToProps = {
    fetchAdminDashboardlist,
    Logoutmember,
    loadingStart,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAdminDashboard);