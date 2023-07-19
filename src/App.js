import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  removeCartItem = id => {
    console.log(id)
    this.setState(prv => ({
      cartList: prv.cartList.filter(each => each.id !== id),
    }))
  }

  reduceCount = id => {
    const {cartList} = this.state
    const item = cartList.find(each => each.id === id)
    if (item.quantity === 1) {
      this.setState(prv => ({
        cartList: prv.cartList.filter(each => each.id !== id),
      }))
    } else {
      item.quantity -= 1
      this.setState({cartList: [...cartList, item]})
    }
  }

  increment = id => {
    this.setState(prv => ({
      cartList: prv.cartList.map(each => {
        if (each.id === id) {
          return {...each, quantity: each.quantity + 1}
        }
        return each
      }),
    }))
  }

  decrement = id => {
    this.setState(prv => ({
      cartList: prv.cartList.map(each => {
        if (each.id === id && each.quantity > 1) {
          return {...each, quantity: each.quantity - 1}
        }
        return each
      }),
    }))
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item

  addCartItem = product => {
    const {cartList} = this.state
    const item = cartList.find(each => each.id === product.id)

    if (item !== undefined) {
      const newQuantity = item.quantity + product.quantity
      this.setState(prv => ({
        cartList: prv.cartList.map(each => {
          if (each.id === product.id) {
            return {...each, quantity: newQuantity}
          }
          return each
        }),
      }))
    } else {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.increment,
          decrementCartItemQuantity: this.decrement,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
