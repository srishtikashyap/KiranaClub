This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

Documentations :-

Suggested Ideas (Could not be implemented due to time constraint)
* A different section for pinned or star marked news.
* Implement a search bar that allows users to search for specific news articles by keywords.
* Add dark mode support, allowing users to switch between light and dark themes.
* Animations of item sliding up while deleting or while pinning.
* Allow users to share articles with friends and on social media directly from the app.

Assumptions:-
* Data shown is prepared using API 'https://newsapi.org/' with a given api Key in documentation.
* While refreshing, the whole list is not refreshed whereas the data is appended to the existing list.
* While scrolling to the bottom of the list , api will be called again after 100th element and appended into the existing list.
* On deleting an item no message is shown as there was no design for the same.
* The font has been changed, since the one used in Figma is Closed Source.

Third Party Libraries Used are:-
* react-native-swipe-list-view
* @react-native-async-storage/async-storage
* @react-navigation/native



