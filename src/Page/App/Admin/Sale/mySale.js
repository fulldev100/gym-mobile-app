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
    ScrollView
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from "react-redux";
import { fetchAdminDashboardlist, loadingStart } from "../../../redux/actions/adminDashboard";
import { Logoutmember } from "../../../redux/actions/auth";
import { t } from '../../../../../locals';
import styleCss from '../../../../style.js';
import SelectDropdown from 'react-native-select-dropdown';

const day_region = [
    'Today',
    'This month',
    'For 3 month',
    'This year',
    'So far',
  ];

class MyEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ImageLoading: false,
            modalVisible: false,
            cardNumber: '',
            isMembershipView: true,
            date_region: 1
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
            onPress: () => this.myAdmindata(),
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

    onMembershipView = () => {
        this.setState({ isMembershipView: true });
    }

    onTicketView = () => {
        this.setState({ isMembershipView: false });
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('myAdminDashboard')

    renderItem = ({ item }) => {
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
                        <Text style={styleCss.NaveText}>24hr-fitness.eu</Text>
                    </Col>
                    <Col style={styleCss.nutrition_list_name_col_1}>
                    </Col>

                    <Col style={styleCss.AlignRightNavbar}>
                        <Text style={styleCss.NaveText}>en</Text>
                    </Col>
                </Row>
                <Row style={styleCss.AdminDateRegionBar}>
                    <SelectDropdown
                            data={day_region}
                            defaultValueByIndex={this.state.date_region} // use default value by index or default value
                            // defaultValue={'Canada'} // use default value by index or default value
                            onSelect={(selectedItem, index) => {
                                this.setState({date_region: index})
                                this.myAdmindata()
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
                </Row>
                <Row style={styleCss.AdminDateRegionBarUnder}>
                    <View style={styleCss.AdminDashboardRowView}>
                    {
                        this.state.isMembershipView ?
                        <>
                            <View style={styleCss.AdminDashboardColumn}><Text onPress={() => this.onMembershipView()} style={styleCss.AdminDashboardSmallLabelActive}>Membership</Text></View> 
                            <View><Text onPress={() => this.onTicketView()} style={styleCss.AdminDashboardSmallLabel}>Ticket</Text></View>
                        </>
                        :
                        <>
                            <View style={styleCss.AdminDashboardColumn}><Text onPress={() => this.onMembershipView()} style={styleCss.AdminDashboardSmallLabel}>Membership</Text></View> 
                            <View><Text onPress={() => this.onTicketView()} style={styleCss.AdminDashboardSmallLabelActive}>Ticket</Text></View>
                        </>
                    }
                     </View>
                </Row>
                <TouchableOpacity key={item.invoice_id} style={styleCss.TouchScreenCSS}>
                    
                    <View>

                    <ScrollView> 
                    { !this.state.isMembershipView ?
                        item.total_guest_list.map((prop, key) => {
                            return (
                                <Row style={styleCss.product_list_row}>
                                    {/* <Col style={styleCss.nutrition_list_col}>
                                        <Col style={styleCss.product_list_image_col}>
                                            <Image style={styleCss.product_list_image}
                                                // source={require('../../../images/Date-blue-512.png')}
                                                source={{uri: item.product_image}}
                                            />
                                        </Col>
                                    </Col> */}
                                    <Col style={styleCss.history_list_details_col}>
                                        <Row style={styleCss.history_list_details_row}>
                                            <Text style={styleCss.nutrition_list_details_label}>€{prop.paid_amount}   {prop.card_number} ,{prop.created_date}</Text>
                                        </Row>

                                        <Row style={styleCss.history_list_details_row}>
                                            <Text style={styleCss.nutrition_list_details_text}>{prop.start_date} ~ {prop.end_date}</Text>
                                        </Row>

                                        <Row style={styleCss.history_list_details_row}>
                                            <Text style={styleCss.nutrition_list_details_text}>{prop.guest_email}, {prop.gender == "M" ? "Male" : "Female" }</Text>
                                        </Row>
                                    </Col>
                                </Row>
                            )
                        })
                        :
                        item.total_membership_list.map((prop, key) => {
                            if (prop.paid_amount > 0)
                            return (
                                <Row style={styleCss.product_list_row}>
                                    {/* <Col style={styleCss.nutrition_list_col}>
                                        <Col style={styleCss.product_list_image_col}>
                                            <Image style={styleCss.product_list_image}
                                                // source={require('../../../images/Date-blue-512.png')}
                                                source={{uri: item.product_image}}
                                            />
                                        </Col>
                                    </Col> */}
                                    <Col style={styleCss.history_list_details_col}>
                                        

                                        <Row style={styleCss.history_list_details_row}>
                                            <Text style={styleCss.nutrition_list_details_label}>{prop.membership_title}</Text>
                                        </Row>

                                        <Row style={styleCss.history_list_details_row}>
                                            <Text style={styleCss.nutrition_list_details_text}>{prop.currency_symbol}{prop.paid_amount}   {prop.card_number} ,{prop.created_date}</Text>
                                        </Row>

                                        <Row style={styleCss.history_list_details_row}>
                                            <Text style={styleCss.nutrition_list_details_text}>{'('}{prop.membership_valid_from} ~ {prop.membership_valid_to}{')'}, {prop.member_name}</Text>
                                        </Row>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    </ScrollView>
                    </View>
                    
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
                        keyExtractor={(item) => {item.invoice_id}}
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
                                    <Text style={styleCss.NaveText}>24hr-fitness.eu</Text>
                                </Col>
                                <Col style={styleCss.nutrition_list_name_col_1}>
                                </Col>

                                <Col style={styleCss.AlignRightNavbar}>
                                    <Text style={styleCss.NaveText}>en</Text>
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
                                    source={require('../../../../images/small_gym.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Dashboard</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myEntry')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/small_location.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Entry</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('mySale')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/small_product.png')}
                                />
                                <Text style={styleCss.bottomViewColumnTextActive}>Sale</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.myAdmindata()} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/small_refresh.png')}
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myAdminDashboard')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/small_gym.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Dashboard</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('myEntry')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/small_location.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Entry</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('mySale')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/small_product.png')}
                                />
                                <Text style={styleCss.bottomViewColumnTextActive}>Sale</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.myAdmindata() } style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../../images/small_refresh.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Refresh</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyEntry);