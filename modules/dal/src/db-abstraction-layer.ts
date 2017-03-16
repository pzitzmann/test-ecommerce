import { esIndex } from './consts';
import {Injectable, Inject} from "@angular/core";

/**
 * Data abstraction layer is an absraction to some connector (for now realized {@link FirebaseConnector}, but you can create your own using this contract).
 * To use some connector you must provide it in app.module.ts
 * ```
 * providers: [
 *  ...,
 *  {
 *    provide: 'Connector'
 *    useClass: FirebaseConnector
 *  }
 * ]
 * ```
 * There are method with queryObject parameter. {@link ProductService} use them to work with products. Query object are generated in this service.
 */
@Injectable()
export class DbAbstractionLayer {

  constructor(@Inject('Connector') private connector){

  }

  /**
   * Add general category to database
   * 
   * @param {FormGroup} generalCategoryForm form of general category
   */
  addGeneralCategory(generalCategoryForm){
    this.connector.addGeneralCategory(generalCategoryForm);
  }

  /**
   * Add category to database
   * 
   * @param {FormGroup} categoryForm  form of category
   */
  addCategory(categoryForm){
    this.connector.addCategory(categoryForm);
  }

  /**
   * Add new attribute to database
   * 
   * @param {FormGroup} attributeForm  form of attribute
   * @param {string} categoryId id of category
   */
  addAttribute(attributeForm, categoryId){
    this.connector.addAttribute(attributeForm, categoryId);
  }

  /**
   * Add new tag to database
   * 
   * @param {FormGroup} tagForm  form of tag
   * @param {string} categoryId id of category
   */
  addTag(tagForm, categoryId){
    this.connector.addTag(tagForm, categoryId);
  }

  /**
   * Add product to database
   * 
   * @param {Object} product product Object
   */
  addProduct(product){
    this.connector.addProduct(product);
  }

  /**
   * Returns product by queryObj provided by DbAbstractionLayer
   * 
   * @param {Object} queryObj ElasticSearch query object
   * 
   * @returns Reference of product object.
   */
  getOneProduct(productId){
    var queryObj = {
            index: esIndex,
            type: 'product',
            query: {
                "query": {
                    "term":{
                        "_id": productId
                    }
                }
            }
        };
    return this.connector.getOneProduct(queryObj);
  }

  /**
   * Returns products by query object (look to {@link ProductService} method getProductsByIds)
   */
  getProductsByIds(queryObj){
    return this.connector.requestData(esIndex, 'product', queryObj);
  }

  /**
   * Returns basket content of specific user
   * 
   * @param {string} userId user Id
   * 
   * @returns Reference of basket
   */
  getBasketContent(id){
    return this.connector.getBasketContent(id);
  }

  /**
   * Returns basket history of user by userId or deviceId
   * 
   * @param {string} id  userId or deviceId
   * 
   * @returns database.Reference of basket history
   */
  getBasketHistoryById(id){
    return this.connector.getBasketHistoryById(id);
  }

  /**
   * Will be realized in next versions
   */
  getСomparison(id){
    return this.connector.getComparison(id);
  }

  /**
   * Set new basket by user id or device id
   * @param id  userId or deviceId
   * @param newBasket 
   */
  setNewBasket(id, newBasket){
   return this.connector.setNewBasket(id, newBasket);
  }

  /**
   * Will be realized in next versions
   */
  addProductToComparison(id, product){
    return this.connector.addProductToComparison(id, product);
  }

  /**
   * Will be realized in next versions
   */
  removeProductFromComparison(id, idInComparison){
    return this.connector.removeProductFromComparison(id, idInComparison);
  }

  /**
   * Gets data hits from ElasticSearch
   * 
   * @param {string} index ElasticSearch index
   * @param {string} type ElasticSearch type
   * @param {Object} queryObj query object for ElasticSearch
   * 
   * @returns  Reference of requested data hits
   */
  requestData(esIndex, type, queryObj){
    return this.connector.requestData(esIndex, type, queryObj);
  }

  /**
   * Gets full data from  ElasticSearch
   * 
   * @param {string} index ElasticSearch index
   * @param {string} type ElasticSearch type
   * @param {Object} queryObj query object for ElasticSearch
   * 
   * @returns  Reference of requested data
   */
  requestFullData(esIndex, type, queryObj){
    return this.connector.requestFullData(esIndex, type, queryObj);
  }

  /**
   * Gets total item of data from ElasticSearch
   * 
   * @param {string} index ElasticSearch index
   * @param {string} type ElasticSearch type
   * @param {Object} queryObj query object for ElasticSearch
   * 
   * @returns  Reference of total item
   */
  requestItemsTotal(esIndex, type, queryObj){
    return this.connector.requestItemsTotal(esIndex, 'product', queryObj);
  }
  
  /**
   * Return tags by query object
   * 
   * @param {Object} queryObj  ElasticSearch query object
   * 
   * @returns Reference of tags
   */
  getTags(queryObj){
    return this.connector.requestData(esIndex, 'tags', queryObj);
  }

  /**
   * Return attributes by query object
   * 
   * @param {Object} queryObj  ElasticSearch query object
   * 
   * @returns Reference of attributes
   */
  getAttributes(queryObj){
    return this.connector.requestData(esIndex, 'attributes', queryObj);
  }

  /**
   * Logout user
   */
  logout(){
    this.connector.logout();
  }

  /**
   * Register user with email and password
   * 
   * @param {string} email  User email
   * @param {string} password  User password
   * 
   * @returns Promise containing user data
   */
  register(email, password){
    return this.connector.register(email, password);
  }

  /**
   * Register user with email and password. Save additional information in database
   * 
   * @param registerForm  Object that have email, password and any additional information about user. 
   * Additional information stores in database as user backet
   */
  registerUser(registerForm){
    return this.connector.registerUser(registerForm);
  }

  /**
   * Get user data
   * 
   * @param {string} uid  user Id
   * 
   * @returns Reference
   */ 
  getUserData(uid){
    return this.connector.getUserData(uid);
  }

  /**
   * Login with email and password
   * 
   * @param {string} email  User email
   * @param {string} password  User password
   * 
   * @returns Promise containing User
   */ 
  loginEmail(email, password){
    return this.connector.loginEmail(email, password);
  }

  /**
   * Check old session flow using device id
   * 
   * @param {string} deviceId  User device Id
   */
  checkOldSessionFlow(deviceId){
    this.connector.checkOldSessionFlow(deviceId);
  }

  /**
   * Connect [Session-flow]{@link https://www.npmjs.com/package/@nodeart/session-flow} to databese. 
   * 
   * @param {SessionFlow} sessionFlow  SessionFlow service
   * @param {string} deviceId  User device id generated by SessionFlow 
   * @param {string} sessionId  User session id generated by SessionFlow
   * 
   */
  connectSessionFlowToDB(sessionFlow, deviceId, sessionId){
    this.connector.connectSessionFlowToDB(sessionFlow, deviceId, sessionId);
  }

  /**
   * Returns visited routes
   * 
   * @returns array of visited routes objects
   */
  getVisitedRoutes(){
    return this.connector.getVisitedRoutes();
  }
  
  /**
   * Returns user clicks 
   * 
   * @returns array of user clicks objects
   */
  getUserClicks(){
    return this.connector.getUserClicks();
  }

  /**
   * Returns auth object. Avoid manipulating with connector directly. Use dal methods to communicate with connector
   * 
   * @returns  Auth object
   */
  getAuth(){
    return this.connector.getAuth();
  }

  /**
   * Save new order to database
   * 
   * @param {Object} paymentData
   * 
   * @returns Reference
   */
  saveOrder(orderData) {
    return this.connector.saveOrder(orderData);
  }
  
  /**
   * Add payment requets. Server listens database backet with payments request and process coming requests
   * 
   * @param {Object} data PaymentData
   * @param {string} paymentMethod  name of payment method
   * 
   * @returns Reference
   */
  addPaymentRequest(data, paymentMethod){
    return this.connector.addPaymentRequest(data, paymentMethod);
  }

  /**
   * Returns payment response by id
   * 
   * @param {string} paymentKey id of payment response. Payment request and payment response have same ids in their backets
   * 
   * @returns Reference of payment response
   */  
  listenPaymentResponse(paymentKey){
    return this.connector.listenPaymentResponse(paymentKey);
  }

  /**
   * Returns orders by user id
   * 
   * @param {string} userId user id
   * 
   * @
   */
  getOrdersByUserId(userId) {
    let queryObj = {
      query: {
        match: {
          userId: userId
        }
      }
    };
    return this.connector.requestData(esIndex, 'orders', queryObj);
  }

  /**
   * Send letter with password resetting to specific email 
   * 
   * @param {string} email User email
   * 
   * @returns      Promise containing void
   */
  resetPassword(email) {
    return this.connector.resetPassword(email);
  }

  /**
   * Get order by Id
   * @param id id of order
   * @returns {Observable} Observable of order
   */
  getOrderById(id) {
    return this.connector.getOrderById(id);
  }
}