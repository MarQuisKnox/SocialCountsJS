# SocialCountsJS


SocialCountsJS frees web developers from the look and feel of stock social network widgets by providing data in just one simple query.

SocialCountsJS is licensed under [![LGPLv3](http://www.gnu.org/graphics/lgplv3-88x31.png)](http://www.gnu.org/licenses/lgpl.html).

## Usage

### Include SocialCountsJS in your document.

```html
<script type="text/javascript" src="http://swook.github.io/SocialCountsJS/socialcounts.js"></script>
```

### Call the `socialcounts` function.

This can be done in two ways.

The following takes a specific URL and makes a request. A function is passed in as the second parameter and will be invoked on success.

```javascript
window.socialcounts(url, function(data) {
});
```

The following takes just a function argument, and queries counts for the current page.

```javascript
window.socialcounts(function(data) {
});
```

`data` is in the following form:

```javascript
{
	url: "http://swook.github.io/SocialCountsJS",
	counts: {
		googleplus: 98.0,
		facebook: 45.0,
		twitter: 67.0,
		linkedin: 23.0,
		stumbleupon: 54.0,
		pinterest: 1.0
	}
};
```

## Demo
You can view a demo at [swook.github.io/SocialCountsJS](http://swook.github.io/SocialCountsJS/)

