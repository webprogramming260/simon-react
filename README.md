# simon-react

This demonstrates using a web framework. When your applications start getting more and more complex it becomes necessary to use a web framework that helps with tasks such as builiding modular components, providing reactive UI elements, supporting sessions, lazy loading, and reducing the size of your application.

Some frameworks take the additional step of abstracting parts of HTML and CSS to make authoring components easier. When this happens the project must be pre-processed in order to turn it into HTML and CSS that the browser can execute. This process requires a tool chain that executes to produce a browser ready bundle.

For this project we will use [React](https://reactjs.org/) framework and the associated React CLI. React abstracts HTML into a JavaScript variate called JSX. JSX is converted into valid HTML and JavaScript using a preprocessor called Babel.

For example, a JSX file might contain the following:

```jsx
const list = (
  <ol>
    <li>Item 1</li>
  </ol>
);
```

Babel will convert that into valid JavaScript:

```Javascript
const header = React.createElement("ol", null,
  React.createElement("li", null, "Item 1")
);
```

# Learning React

- [Official Introduction Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [Mozilla Introduction Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started)

# React CLI

Use `create-react-app` to build a simple templated react project. If you want an even simpler one use `nano-react-app`. This one use [Vite](https://vitejs.dev/) instead of [webpack](https://webpack.js.org/). The main difference is that Vite uses native ECMAScript modules instead of transpiling the web frameworks modules into JavaScript.

You can remove functionality from the resulting `create-react-app` project with `npm run eject`. For example to remove `web-vitals` do `npm run eject web-vitals`.
