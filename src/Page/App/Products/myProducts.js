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
import { fetchProductlist, loadingStart } from "../../redux/actions/product";
import { t } from '../../../../locals';
import styleCss from '../../../style.js';

class MyProducts extends Component {
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
        this.productlist();
    }

    async productlist() {
        const { fetchProductlist, loadingStart } = this.props;
        loadingStart();
        const Id = await SecureStore.getItemAsync("id");
        const Token = await SecureStore.getItemAsync("access_token");

        const auth_data = {
            "current_user_id": Id,
            "access_token": Token,
            "member_id": Id
        };
        fetchProductlist(auth_data);
    }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    onRefresh() {
        this.productlist();
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('Dashboard')
    renderItem = ({ item }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('myProductSchedule', { productData:[item], paramKey1: item.sell_id, paramKey2: item.invoice_no })}>

                    <Row style={styleCss.nutrition_list_row}>
                        <Col style={styleCss.nutrition_list_col}>
                            <Col style={styleCss.product_list_image_col}>
                                <Image style={styleCss.nutrition_list_image}
                                    // source={require('../../../images/Date-blue-512.png')}
                                    source={{uri: item.product_image}}
                                />
                            </Col>
                        </Col>
                        <Col style={styleCss.nutrition_list_details_col}>
                            <Row style={styleCss.nutrition_list_details_row}>
                                <Text style={styleCss.nutrition_list_details_label}></Text>
                                <Text style={styleCss.nutrition_list_details_text}>{item.product_name_and_quantity}</Text>
                            </Row>

                            <Row style={styleCss.nutrition_list_details_row}>
                                <Text style={styleCss.nutrition_list_details_label}>Amount : </Text>
                                <Text style={styleCss.nutrition_list_details_text}>{item.paid_amount}</Text>
                            </Row>
                        </Col>
                    </Row>

                </TouchableOpacity>
            </View>
        )
    }
    render() {

        const { navigate } = this.props.navigation;
        const { Data, loading } = this.props;

        if (!loading) {
            return (
                <View style={styleCss.container}>

                    <Row style={styleCss.NaveBar}>
                        <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("CustomSideBar")} style={styleCss.menu_col}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Menu-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => navigate("Dashboard")} style={styleCss.back_arrow}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styleCss.nutrition_list_name_col}>
                            <Text style={styleCss.NaveText}>{t("Products")}</Text>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductsList')} style={styleCss.workout_col}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Fees-Payment-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        {/* <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Workouts')} style={styleCss.workout_col}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Workout-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Message')} style={styleCss.message_col}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Message-white.png')}
                                />
                            </TouchableOpacity>
                        </Col> */}
                    </Row>

                    <FlatList
                        data={Data}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.sell_id}
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

                </View>
            );
        } else {
            return (
                <View style={styleCss.container}>

                    <Row style={styleCss.NaveBar}>
                        <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("CustomSideBar")} style={styleCss.menu_col}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Menu-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => navigate("Dashboard")} style={styleCss.back_arrow}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styleCss.nutrition_list_name_col}>
                            <Text style={styleCss.NaveText}>{t("Products")}</Text>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Workouts')} style={styleCss.workout_col}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Workout-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Message')} style={styleCss.message_col}>
                                <Image style={styleCss.Naveicon}
                                    source={require('../../../images/Message-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <ActivityIndicator
                        style={styleCss.loading}
                        size="large"
                        color="#102b46"
                    />
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
        Data: state.product.productData,
        loading: state.product.loading,
    };
};

const mapDispatchToProps = {
    fetchProductlist,
    loadingStart
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProducts);