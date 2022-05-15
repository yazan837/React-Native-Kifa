import {
  React,
  useSelector,
  useDispatch,
  useState,
  useEffect,
  nativeElement,
  globalStyle,
  addOne,
  removeOne,
  Loader,
  secondaryColor,
  primaryColor,
  _objI,
  _objO,
  clearList,
} from '../utils/allImports';

import {useTranslation} from 'react-i18next';
import AutoComplete from './newAutoComplete';
import {View, Text, ScrollView, Platform} from 'react-native';
import {logout} from '../redux/actions/Auth';
import {readCustomers} from '../redux/actions/customers';
import {createOrder} from '../redux/actions/order';

import {NetPrinter} from 'react-native-thermal-receipt-printer';
import {readSettings, updateSettings} from '../redux/actions/settings';

export default function HomePageLeftSide({navigation}) {
  const [totals, setTotals] = useState({
    price: 0,
    quantity: 0,
    totalPriceWithDiscount: 0,
  });
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const [searchBy, setSearchBy] = useState(['name', 'phone', 'reference_id']);
  const appReducer = useSelector(state => state.appReducer);
  const authReducer = useSelector(state => state.AuthReducer);
  const customersReducer = useSelector(state => state.customersReducer);
  const settingsReducer = useSelector(state => state.settingsReducer);
  const [query, setQuery] = useState('');
  const [searchObject, setSearchObject] = useState({});
  const [state, setState] = useState({message: ''});
  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();

  const print = () => {
    NetPrinter.init().then(() => {
      setState(
        Object.assign({}, state, {
          printers: [{host: '192.168.1.3', port: 9100}],
        }),
      );
    });
  };
  const connectPrinter = async () => {
    NetPrinter.connectPrinter('192.168.1.3', 9100).then(
      printer => setState(Object.assign({}, state, {currentPrinter: printer})),
      error => console.warn(error),
    );
  };
  const printBillTest = () => {
    if (state?.currentPrinter) {
      NetPrinter.printBill('<C>sample bill</C>');
    }
  };
  useEffect(() => {
    dispatch(readSettings(authReducer.token));
  }, []);
  useEffect(() => {
    let totalPrice = appReducer.list.map(el => el.price * el.quantity);
    let totalPriceWithDiscount = appReducer.list.map(
      el => el.buying_price_after_discount * el.quantity,
    );
    let totalquantity = appReducer.list.map(el => el.quantity);
    setTotals({
      ...totals,
      quantity: totalquantity.reduce((a, b) => a + b, 0),
      price: totalPrice.reduce((a, b) => a + b, 0),
      totalPriceWithDiscount: totalPriceWithDiscount.reduce((a, b) => a + b, 0),
    });
  }, [appReducer.list]);
  const styles = globalStyle();
  useEffect(() => {
    dispatch(readCustomers(authReducer.token));
  }, []);

  if (authReducer.loading || customersReducer.loading) {
    return <Loader bgc={secondaryColor} color={primaryColor} />;
  } else {
    return (
      <View style={styles.container}>
        {/* Header Start */}
        <View style={styles.HomePageLeftSizeHeader}>
          <View
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 1000,
            }}>
            <nativeElement.Button
              onPress={() => dispatch(logout())}
              type="clear"
              icon={
                <nativeElement.Icon name="logout" size={30} color="#4E7D9B" />
              }
            />
            <Text style={{color: primaryColor}}>Logout</Text>
          </View>
          <View style={styles.flexCenter}>
            <Text style={styles.HomePageLeftSideTitleStyle}>Kifa pos</Text>
          </View>
          <View style={[styles.flexBetween, {height: 50}]}>
            <nativeElement.Button
              onPress={() => navigation.navigate('menu')}
              type="clear"
              icon={
                <nativeElement.Icon
                  name="grid-outline"
                  size={30}
                  type="ionicon"
                  color="#4E7D9B"
                />
              }
            />

            <AutoComplete
              data={customersReducer.customers}
              btnWidth="70%"
              setQuery={setQuery}
              query={query}
              searchElement={'reference_id'}
              renderedData={''}
              placeholder={t('searchCustomer')}
              name={'name'}
              pressHandler={setSearchObject}
              overlayWidth="50%"
              overLayHeight="100%"
              left="-25%"
              btnBorderColor={primaryColor}
              btnTextColor={primaryColor}
              btnBorderWidth={1}
              btnBorderRad={15}
              containerMarginTop={0}
              searchBy={searchBy}
            />
            <nativeElement.Button
              onPress={() => navigation.navigate('newCustomer')}
              type="clear"
              icon={
                <nativeElement.Icon
                  name="add-circle-outline"
                  size={35}
                  type="ionicon"
                  color="#4E7D9B"
                />
              }
            />
          </View>
          {suggestions.length > 0 || _objI(searchObject) ? (
            <View style={[styles.flexCenter]}>
              <View
                style={[
                  styles.flexStart,
                  {
                    width: '66%',
                    flexDirection: 'column',
                    position: 'relative',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                  },
                ]}>
                {_objI(searchObject) && searchObject.name ? (
                  <View style={[styles.flexBetween]}>
                    <Text style={styles.bold}>
                      Customer:{'  '}{' '}
                      <Text style={{fontWeight: '400'}}>
                        {searchObject.name}
                      </Text>
                    </Text>
                    <nativeElement.Button
                      style={{margin: 0, padding: 0}}
                      containerStyle={{margin: 0, padding: 0}}
                      onPress={() => setSearchObject({})}
                      type="clear"
                      icon={
                        <nativeElement.Icon
                          name="close"
                          size={25}
                          type="ionicon"
                          color="#4E7D9B"
                        />
                      }
                    />
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
          ) : (
            <></>
          )}
        </View>
        {/* Header end */}
        {/* start page body */}
        <ScrollView
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            position: 'relative',
            zIndex: -10,
          }}>
          <View
            style={[
              styles.flexBetween,
              styles.responsiveDirection,
              {marginBottom: 10},
            ]}>
            <View style={{width: '12%', borderWidth: 1, alignItems: 'center'}}>
              <Text style={[styles.tableHeaderTextStyle]}>#</Text>
            </View>
            <View style={{width: '45%', borderWidth: 1, alignItems: 'center'}}>
              <Text style={[styles.tableHeaderTextStyle]}>
                {t('productName')}
              </Text>
            </View>

            <View style={{width: '25%', borderWidth: 1, alignItems: 'center'}}>
              <Text style={[styles.tableHeaderTextStyle]}>{t('quantity')}</Text>
            </View>
            <View style={{width: '20%', borderWidth: 1, alignItems: 'center'}}>
              <Text style={[styles.tableHeaderTextStyle]}>{t('price')}</Text>
            </View>
          </View>
          {appReducer.list.map((item, index) => (
            <View
              key={index}
              style={[styles.flexBetween, styles.responsiveDirection]}>
              <View style={{width: '12%', alignItems: 'center'}}>
                <Text style={[styles.tableBodyTextStyle, {flexShrink: 1}]}>
                  {index + 1}
                </Text>
              </View>
              <View style={{width: '45%', alignItems: 'center'}}>
                <Text style={[styles.tableBodyTextStyle]}>{item.name}</Text>
              </View>

              <View
                style={{
                  width: '25%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <nativeElement.Button
                  onPress={() => dispatch(removeOne(item.id))}
                  type="clear"
                  icon={
                    <nativeElement.Icon
                      name="remove"
                      size={25}
                      color="#4E7D9B"
                      type="material"
                    />
                  }
                />
                <Text style={[styles.tableBodyTextStyle]}>{item.quantity}</Text>
                <nativeElement.Button
                  onPress={() => dispatch(addOne(item.id))}
                  type="clear"
                  icon={
                    <nativeElement.Icon
                      name="add"
                      size={25}
                      color="#4E7D9B"
                      type="material"
                    />
                  }
                />
              </View>
              <View style={{width: '20%', alignItems: 'center'}}>
                <Text style={[styles.tableBodyTextStyle, {flexShrink: 1}]}>
                  {item.price.toFixed(2)}{' '}
                  <Text style={[styles.tableBodyTextStyle, {fontSize: 9}]}>
                    SAR
                  </Text>
                </Text>
              </View>
            </View>
          ))}
          {appReducer.list.length > 0 ? (
            <>
              <nativeElement.Divider
                orientation="horizontal"
                width={5}
                style={{paddingVertical: 5, marginBottom: 5}}
              />
              <View style={[styles.flexBetween, styles.responsiveDirection]}>
                <View style={{width: '12%', alignItems: 'center'}}>
                  <Text
                    style={[styles.tableBodyTextStyle, {fontWeight: 'bold'}]}>
                    {t('totals')}
                  </Text>
                </View>
                <View style={{width: '23%', alignItems: 'center'}}>
                  <Text style={[styles.tableBodyTextStyle]}></Text>
                </View>

                <View
                  style={[
                    styles.between,

                    {
                      width: '45%',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: 5,
                    },
                  ]}>
                  <View
                    style={[styles.flexBetween, styles.responsiveDirection]}>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {
                          flexShrink: 1,
                          paddingVertical: 2,
                          color: primaryColor,
                        },
                      ]}>
                      {t('subTotal')}
                    </Text>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {
                          flexShrink: 1,
                          paddingVertical: 2,
                        },
                      ]}>
                      {totals.price.toFixed(2)}
                      <Text style={[styles.tableBodyTextStyle, {fontSize: 9}]}>
                        {` `}SAR
                      </Text>
                    </Text>
                  </View>
                  {/* <View
                    style={[styles.flexBetween, styles.responsiveDirection]}
                  >
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {
                          flexShrink: 1,
                          paddingVertical: 2,
                          color: primaryColor,
                        },
                      ]}
                    >
                      Total pieces
                    </Text>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        { flexShrink: 1, paddingVertical: 2 },
                      ]}
                    >
                      {totals.quantity}
                      <Text
                        style={[styles.tableBodyTextStyle, { fontSize: 9 }]}
                      >
                        {` `}P
                      </Text>
                    </Text>
                  </View> */}
                  <View
                    style={[styles.flexBetween, styles.responsiveDirection]}>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {
                          flexShrink: 1,
                          paddingVertical: 2,
                          color: primaryColor,
                        },
                      ]}>
                      {t('discountAmount')}
                    </Text>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {flexShrink: 1, paddingVertical: 2},
                      ]}>
                      {(totals.price - totals.totalPriceWithDiscount).toFixed(
                        2,
                      )}
                      <Text style={[styles.tableBodyTextStyle, {fontSize: 9}]}>
                        {` `}SAR
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={[styles.flexBetween, styles.responsiveDirection]}>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {
                          flexShrink: 1,
                          paddingVertical: 2,
                          color: primaryColor,
                        },
                      ]}>
                      {t('taxAmount')}
                    </Text>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {flexShrink: 1, paddingVertical: 2},
                      ]}>
                      {(
                        totals.totalPriceWithDiscount *
                        (Number(settingsReducer.settings.tax.value) / 100)
                      ).toFixed(2)}
                      <Text style={[styles.tableBodyTextStyle, {fontSize: 9}]}>
                        {` `}SAR
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={[styles.flexBetween, styles.responsiveDirection]}>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {
                          flexShrink: 1,
                          paddingVertical: 2,
                          color: primaryColor,
                        },
                      ]}>
                      {t('totals')}
                    </Text>
                    <Text
                      style={[
                        styles.tableBodyTextStyle,
                        {flexShrink: 1, paddingVertical: 2},
                      ]}>
                      {totals.totalPriceWithDiscount +
                        totals.totalPriceWithDiscount *
                          (Number(settingsReducer.settings.tax.value) / 100)}
                      <Text style={[styles.tableBodyTextStyle, {fontSize: 9}]}>
                        {` `}SAR
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={[styles.flexCenter]}>
              <Text>{t('noProductsInsertedYet')}</Text>
            </View>
          )}
          <View style={{marginVertical: 75}}></View>
        </ScrollView>
        {/* end page body */}

        {/* start action Buttons */}
        <View style={styles.floatingActionButtonsContainer}>
          <nativeElement.Button
            title={t('save&print')}
            onPress={() => {
              print();

              // dispatch(
              //   print,
              //   createOrder(
              //     {
              //       cashier_id: authReducer.user.id,
              //       customer_id: searchObject?.id || 0,
              //       // cost_with_tax: (
              //       //   totals.totalPriceWithDiscount +
              //       //   totals.totalPriceWithDiscount *
              //       //     (Number(settingsReducer.settings.tax.value) / 100)
              //       // ).toFixed(2),
              //       cost_without_tax: totals.price.toFixed(2),
              //       // tax: (
              //       //   totals.totalPriceWithDiscount *
              //       //   (Number(settingsReducer.settings.tax.value) / 100)
              //       // ).toFixed(2),
              //       is_paid: 1,
              //       order_details: [...appReducer.list],
              //     },
              //     authReducer.token
              //   )
              // )
              //   .then((res) => {
              //     if (res.status === 200) {
              //       print(res.data.data.invoice_link);
              //       setSearchObject({});
              //       setQuery("");
              //       dispatch(clearList());
              //       alert(t("dataSentSuc"));
              //       setTotals({
              //         price: 0,
              //         quantity: 0,
              //       });
              //     } else {
              //       alert(t("somethingWrongHappen"));
              //     }
              //   })
              //   .catch((err) => {
              //     console.log({ err });
              //   });
            }}
            type="solid"
            buttonStyle={styles.floatingActionButtonsStyle}
            icon={
              <nativeElement.Icon
                name="save"
                size={20}
                type="ionicon"
                color="#F8F8F8"
                style={{paddingRight: 7}}
              />
            }
          />
          <nativeElement.Button
            title={t('pending')}
            onPress={() => {
              dispatch(
                createOrder(
                  {
                    cashier_id: authReducer.user.id,
                    customer_id: searchObject.id,
                    cost_with_tax: (
                      totals.totalPriceWithDiscount +
                      totals.totalPriceWithDiscount *
                        (Number(settingsReducer.settings.tax.value) / 100)
                    ).toFixed(2),
                    cost_without_tax: totals.price.toFixed(2),
                    tax: (
                      totals.totalPriceWithDiscount *
                      (Number(settingsReducer.settings.tax.value) / 100)
                    ).toFixed(2),
                    is_paid: 0,
                    order_details: [...appReducer.list],
                  },
                  authReducer.token,
                ),
              )
                .then(res => {
                  if (res.status === 200) {
                    print(res.data.data.invoice_link);
                    setSearchObject({});
                    setQuery('');
                    dispatch(clearList());
                    alert(t('dataSentSuc'));
                    setTotals({
                      price: 0,
                      quantity: 0,
                    });
                  } else {
                    alert(t('somethingWrongHappen'));
                  }
                })
                .catch(err => {});
            }}
            buttonStyle={styles.floatingActionButtonsStyle}
            type="solid"
            icon={
              <nativeElement.Icon
                name="pending"
                size={21}
                color="#F8F8F8"
                style={{paddingRight: 7}}
              />
            }
          />
          <nativeElement.Button
            title={t('clear')}
            onPress={() => dispatch(clearList())}
            type="solid"
            buttonStyle={styles.floatingActionButtonsStyle}
            icon={
              <nativeElement.Icon
                name="clear"
                size={20}
                color="#F8F8F8"
                style={{paddingRight: 4}}
              />
            }
          />
        </View>
        {/* end action Buttons*/}
      </View>
    );
  }
}
