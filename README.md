# simon-react

This demonstrates using a web framework. When your applications start getting more and more complex it becomes necessary to use a web framework that helps with tasks such as builiding modular components, providing reactive UI elements, supporting sessions, lazy loading, and reducing (minifying) the size of your application.

Some frameworks take the additional step of abstracting parts of HTML and CSS to make authoring components easier. When this happens the project must be pre-processed in order to turn it into HTML and CSS that the browser can execute. This process requires a tool chain that executes to produce a browser ready bundle.

For this project we will use [React](https://reactjs.org/) framework and the associated `create-react-app` package to convert Simon into a React based application.

# Converting to Simon React

The following section discusses the general steps necessary to convert the Simon application from a simple HTML/CSS/JavaScript application to a React application. You will need to take similar steps for your start up project and so it is important to understand what is happening at each step conversion process.

1. Run `npx create-react-app simon-react`
1. Uninstall the unnecessary modules that create-react-app add (eg stats, test)
1. Delete the unecessary create-react-app files (eg images)
1. Rename `js` JSX files have `jsx` extension (strange that it wasn't already jsx)
1. Replace the `favicon.ico` with the Simon version
1. Update `manifest.json` to represent Simon
1. Move application header and footer into the `app.jsx`
1. Create the component files `login.jsx`, `play.jsx`, `scores.jsx`, and `about.jsx`.
1. Move css into components
1. Move HTML into components
1. Move JavaScript into components
1. Create the router in `app.jsx`

The major steps in this process are detailed below.

## Converting the app

One of the big advantages of React is the ability to represent your web application as a modular application instead of a set of interconnected HTML pages. The `app.jsx` file represents the application component that is the parent of all our other components. To make `app.jsx` the Simon application component we first move the header and footer into the render function for the app. Since this is now JSX instead of HTML we rename the `class` attribute to be `className` so that it doesn't conflict with the JavaScript keyword.

```jsx
function App() {
  return (
    <div className='body bg-dark text-light'>
      <header className='container-fluid'>
        <nav className='navbar fixed-top navbar-dark'>
          <div className='navbar-brand'>
            Simon<sup>&reg;</sup>
          </div>
          <menu className='navbar-nav'>
            <li className='nav-item'>
              <a className='nav-link active' href='index.html'>
                Home
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='play.html'>
                Play
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='scores.html'>
                Scores
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='about.html'>
                About
              </a>
            </li>
          </menu>
        </nav>
      </header>

      <footer className='bg-dark text-dark text-muted'>
        <div className='container-fluid'>
          <span className='text-reset'>Author Name(s)</span>
          <a
            className='text-reset'
            href='https://github.com/webprogramming260/simon-react'
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}
```

In order for the styling to show up wemove the `main.css` cotnent into a file named `app.css` and import the CSS file into the app.

```jsx
import `./app.css`
```

## Converting components

Each of the HTML pages in the original code needs to be converted to a component represented by a corresponding `jsx` file. The following shows the changes that were made to convert the Login page. Similar changes were done for the About, Scores, and Play components.

### Original Simon Login files

**login.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simon</title>

    <script src="login.js"></script>
    <link rel="stylesheet" href="main.css" />

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
      crossorigin="anonymous"
    />
  </head>
  <body class="bg-dark text-light">
    <header class="container-fluid">
      <nav class="navbar fixed-top navbar-dark">
        <a class="navbar-brand" href="#">Simon<sup>&reg;</sup></a>
        <menu class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" href="index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="play.html">Play</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="scores.html">Scores</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="about.html">About</a>
          </li>
        </menu>
      </nav>
    </header>

    <main class="container-fluid bg-secondary text-center">
      <div>
        <h1>Welcome</h1>
        <p>Login to play</p>
        <div>
          <input type="text" id="name" placeholder="Your name here" />
          <button class="btn btn-primary" onclick="login()">Login</button>
        </div>
      </div>
    </main>

    <footer class="bg-dark text-dark text-muted">
      <div class="container-fluid">
        <span class="text-reset">Author Name(s)</span>
        <a
          class="text-reset"
          href="https://github.com/webprogramming260/simon-db"
          >Source</a
        >
      </div>
    </footer>
  </body>
</html>
```

**login.js**

```javascript
function login() {
  const nameEl = document.querySelector('#name');
  localStorage.setItem('userName', nameEl.value);
  window.location.href = 'play.html';
}
```

### Resulting React Component

In order to convert the code to a React component we make the following changes.

- The header (along with navigation) and footer are moved into the app component and so we can drop that duplicated code out of the component HTML.
- The login function becomes a function on the Login component.
- The `class` attribute is renamed to `className` so that it doesn't conflict with the JavaScript keyword `class`.
- `onclick` is renamed to the expected React `onClick` attribute. The value is changed to a function call on the component (`{this.login()}`).

**login.jsx**

```jsx
export class Login extends React.Component {
  login() {
    const nameEl = document.querySelector('#name');
    localStorage.setItem('userName', nameEl.value);
    window.location.href = '/play';
  }

  render() {
    return (
      <main className='container-fluid bg-secondary text-center'>
        <div>
          <h1>Welcome</h1>
          <p>Login to play</p>
          <div>
            <input type='text' id='name' placeholder='Your name here' />
            <button className='btn btn-primary' onClick={() => this.login()'>
              Login
            </button>
          </div>
        </div>
      </main>
    );
  }
}
```

The Login component doesn't have any specific styling and so we don't create and import a CSS file. If it did we would pull the specific styling out of `app.css` and put it in a CSS file for the component. That file would then be imported into the component JSX file just like we did for `app.jsx`.

## Setting up the router

With `app.jsx` containing the header and footer and all the component code created, we can now create the router that will display each component as the navigation UI requests it.

This is done by inserting the `react-router-dom` package into the project. First, install the package with `npm install react-router-dom` and then include the router component in the `index.jsx` and `app.jsx` files.

**index.jsx**
The router controls the whole application and so we put the `BrowserRouter` component elment around our `App` element.

```
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

**app.jsx**
In the App component we replace `a` elements with the router's `NavLink` component. The `href` attribute is replaced with the router's `to` attribute. The NavLink component prevents the browser's default navigation functionality and instead handles it by replacing the currently display component.

```jsx
<a className="nav-link" href="play.html">Play</a>

// to

<NavLink className='nav-link' to='/play'>Play</NavLink>
```

The router definitions are then inserted so that the router knows what component to display for a given path.

```jsx
<Routes>
  <Route path='/' element={<Login />} exact />
  <Route path='/play' element={<Play />} />
  <Route path='/scores' element={<Scores />} />
  <Route path='/about' element={<About />} />
  <Route path='*' element={<NotFound />} />
</Routes>
```

Notice that the `*` (default matcher) was added to handle the case where an unknown path is requested. A simple `NotFound` component is added to the `app.jsx` file to handle the default.

```jsx
function NotFound() {
  return (
    <main className='container-fluid bg-secondary text-center'>
      404: Return to sender. Address unknown.
    </main>
  );
}
```

## Test as you go

That was a lot of changes and it is easy to make a mistake during the process. It is easier if you start with the working app that `create-react-app` build and then make sure it runs (using `npm run start`) without error and appears as you expect. Then commit the project to GitHub. Then make small changes, make sure they work, and commit at each successful milestone. That way you can see where things get broken and can revert to a previous commit if things get out of hand.

# ☑ Assignment

- Convert your `simon` application, or the class example [simon-db](https://github.com/webprogramming260/simon-db) application, to use React. You can view the class example of [Simon React](https://simon-react.cs260.click) and the [source code](https://github.com/webprogramming260/simon-db) if you need help.
- Update the simon-db repository README.md to record and reflect on what you are learning.
- When you have completed your version. Do a final push of your code and deploy your final version to your production environment using the `deploy.sh` script.
- Make sure your project is visible from your production enviornment.
- Submit the URL to your project on the production environment (e.g. https://yourhostname/simon) for grading using the Canvas assignment page.

## Grading Rubric

- 10% - Used `create-react-app` to build a template React application
- 20% - Successfully converted the header and footer to the App component
- 30% - Successfully converted the components
- 20% - Successfully implemented the router
- 10% - At least four Git commits for the project (Initial, milestone, ..., milestone, final)
- 10% - Notes in your Simon repository README.md about what you have learned
