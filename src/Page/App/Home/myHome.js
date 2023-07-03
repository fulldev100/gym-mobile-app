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
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from "react-redux";
import { fetchHomelist, loadingStart } from "../../redux/actions/home";
import { t } from '../../../../locals';
import styleCss from '../../../style.js';

class Home extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
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
        return (
            <View style={styleCss.MembershipView}>
                <Row style={styleCss.NaveBar}>

                    <Col style={styleCss.nutrition_list_name_col}>
                        <Text style={styleCss.NaveText}>24hr-fitness.eu</Text>
                    </Col>
                    <Col style={styleCss.nutrition_list_name_col_1}>
                    </Col>

                    <Col style={styleCss.AlignRightNavbar}>
                        <View style={styleCss.NavBarCreditView}>
                            <Text style={styleCss.NaveCreditTitleText}>Credit balance:</Text>
                            <Text style={styleCss.NaveCreditText}>{item.amount} {item.currency_symbol}</Text>
                        </View>
                    </Col>
                    <Col style={styleCss.AlignRightNavbar}>
                        <Text style={styleCss.NaveText}>en</Text>
                    </Col>
                </Row>
                <TouchableOpacity key={item} style={styleCss.TouchScreenCSS}>

                    <Text style={styleCss.MembershipTitle}>{item.membership_title}</Text>

                    <View style={styleCss.ImageLogoContainer}>
                        <Image style={styleCss.nutrition_list_image}
                            source={require('../../../images/Logo.png')}
                        />
                        <Text style={styleCss.MembershipValidDate}>{item.membership_valid_from} To {item.membership_valid_to}</Text>
                    </View>
                    
                    <Text style={styleCss.MembershipMemberName}>{item.member_name}</Text>
                    <Text style={styleCss.MembershipMemberEmail}>{item.member_email}</Text>

                    <View style={styleCss.MembershipCardView}>
                        {item.payment_status == "Fully Paid"?
                        <>
                            <Row>
                                <Col>
                                    <Text style={styleCss.MembershipMemberEmail}>Virtual Card no.:</Text>
                                </Col>
                                <Col>
                                    <Text style={styleCss.MembershipCardNumber}>{item.card_number}</Text>
                                </Col>
                            </Row>
                            <Image style={styleCss.Membership_card_image} source={
                                item.card_number
                                ? { uri: 'https://chart.googleapis.com/chart?cht=qr&chs=350x350&chl=' + item.card_number }
                                : null
                            } />
                        </> :
                            <Text>{item.payment_status}</Text>
                        }
                    </View>

                </TouchableOpacity>
            </View>
        )
    }
    render() {

        const { navigate } = this.props.navigation;
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
                            <EmptyComponent title={t("Data not available")} />
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
                                <Text style={styleCss.bottomViewColumnTextActive}>Home</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('location')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_location.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Location</Text>
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
                                <Text style={styleCss.bottomViewColumnTextActive}>Home</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styleCss.bottomViewColumn}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('location')} style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_location.png')}
                                />
                                <Text style={styleCss.bottomViewColumnText}>Location</Text>
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
                            <TouchableOpacity onPress={() => this.myhomedata() } style={styleCss.message_col}>
                                <Image style={styleCss.bottomViewColumnImg}
                                    source={require('../../../images/small_refresh.png')}
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
        Data: state.home.homeData,
        loading: state.home.loading,
    };
};

const mapDispatchToProps = {
    fetchHomelist,
    loadingStart
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);