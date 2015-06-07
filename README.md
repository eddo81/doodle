# Doodle

###A canvas drawing app by way of a jQuery-plugin

Doodle is a simple to use jQuery-plugin that embeds a canvas based drawing app into your website. 

![Screenshot of plugin](http://www.student.bth.se/~edjo14/javascript/kmom07/img/screenshot-small.png)

Some of it's features include:

* A customizable color palette 
* The ability to configure the download format of your image as either .png or .jpeg
* A undo-button

###Installation
---
Doodle comes in both minified and uncompressed formats. To install Doodle simply clone this repo or download the zip-file. Then include it in your markup like this:

**jquery.doodle.css** (*The Doodle-CSS should be embeded below your own*)
```html
<head>
  <meta charset="utf-8">
  <title>Doodle</title>
  <link rel="stylesheet" href="yourStyleSheet.css">
  <link rel="stylesheet" href="jquery.doodle.css">
</head>
```

**jquery.doodle.js**
```html
<script src="jquery.js"></script>
<script src="jquery.doodle.js"></script> 
<script src="yourJavaScript.js"></script>
</body>
</html>
```

###Configuration
---
Embed Doodle via jQuery like so:

```javascript
$('#target').doodle(); 
```
(*Do make sure that the parent element is empty*)

The Doodle-canvas will conform to the width and height of its parent, although it does have a minimum width and height of 640 x 480px set with inline styling.
By default Doodle is configured to save images in the .png format. Likewise Doodle comes with a predefined color-palette. If you wish to modify these default settings simply pass a object litteral to the .doodle method like so:

```javascript
$('#target').doodle({
	format: 'jpeg',
	palette: ["white", "black", "red", "yellow", "green", "blue", "purple"]
}); 
``` 
The key "format" takes a lowercase string value, either "png" or "jpeg". The "palette" key takes and array of lowercase color words. The size of the palette is limited to 7, all color words beyond this limit are omitted.